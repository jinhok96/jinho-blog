/**
 * 빌드 타임에 MDX 레지스트리를 생성
 * - 1단계: 모든 컬렉션의 MDX 파일을 스캔하고 frontmatter 스키마 검증 (실패 시 일괄 보고)
 * - 2단계: Git 히스토리·썸네일·이미지 경로를 처리하여 JSON으로 출력
 */

import * as fs from 'fs';
import * as path from 'path';

import { execSync } from 'child_process';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { z } from 'zod';

import { generateOgImage, generateThumbnail } from '@jinho-blog/thumbnail-generator';

import {
  type BaseFrontmatter,
  type CollectionDefinition,
  type CollectionMap,
  type ContentConfig,
  type GeneratedFields,
} from '../src/core/collection';
import { VIDEO_EXTENSIONS } from '../src/core/config';
import { type ContentPaths, resolveContentPaths } from '../src/core/paths';

// Zod 검증 메시지 한국어 로케일
z.config(z.locales.ko());

type ScannedFile = {
  slug: string;
  filePath: string;
};

type GitDates = {
  createdAt?: string;
  updatedAt?: string;
};

type GithubRepo = NonNullable<ContentConfig['github']>;

type GitDatesReader = (filePath: string) => Promise<GitDates>;

type MdxParseResult = { success: true; data: BaseFrontmatter; content: string } | { success: false; issues: string[] };

type ParsedMdxFile = ScannedFile & {
  data: BaseFrontmatter;
  content: string;
};

type ValidatedCollection = {
  name: string;
  definition: CollectionDefinition;
  files: ParsedMdxFile[];
};

/**
 * 레지스트리 JSON에 저장되는 항목 (스키마 출력 + 생성 필드)
 */
type RegistryEntry = BaseFrontmatter & GeneratedFields;

/**
 * 모노레포 루트 찾기 (pnpm-workspace.yaml 또는 package.json에 workspaces가 있는 디렉토리)
 */
export function findMonorepoRoot(startDir: string = process.cwd()): string {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }

    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { workspaces?: unknown };
      if (pkg.workspaces) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  // fallback: 이 파일이 packages/mdx-handler/scripts에 있다고 가정
  return path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));
}

/**
 * GitHub API로 파일의 커밋 히스토리 조회
 */
export async function getGitDatesFromAPI(filePath: string, github: GithubRepo, repoRoot: string): Promise<GitDates> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('⚠️  GITHUB_TOKEN not found, falling back to local git');
    return {};
  }

  try {
    // 파일 경로를 repository root 기준 상대 경로로 변환
    const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

    // Vercel 배포 브랜치 또는 기본 브랜치 사용
    const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';

    // GitHub API로 커밋 히스토리 조회 (newest first)
    const response = await fetch(
      `https://api.github.com/repos/${github.owner}/${github.repo}/commits?path=${relativePath}&sha=${branch}&per_page=100`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    if (!response.ok) {
      console.warn(`⚠️  GitHub API failed for ${relativePath}: ${response.status} ${response.statusText}`);
      return {};
    }

    const commits = (await response.json()) as Array<{ commit: { author: { date: string } } }>;

    if (!commits || commits.length === 0) {
      console.warn(`⚠️  No commits found for ${relativePath} on branch ${branch}`);
      return {};
    }

    // 첫 커밋 (가장 오래된 것) = createdAt
    // 마지막 커밋 (가장 최근 것) = updatedAt
    const createdAt = commits[commits.length - 1]?.commit.author.date;
    const updatedAt = commits[0]?.commit.author.date;

    return {
      createdAt: createdAt || undefined,
      updatedAt: updatedAt || undefined,
    };
  } catch (error) {
    console.warn(`⚠️  GitHub API error for ${filePath}:`, error);
    return {};
  }
}

/**
 * 로컬 Git 명령으로 파일의 생성/수정 날짜 추출
 */
export function getGitDatesFromLocal(filePath: string): GitDates {
  try {
    // 첫 커밋 날짜 (createdAt)
    const createdAt = execSync(`git log --follow --format=%aI --reverse "${filePath}" | head -1`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    // 마지막 커밋 날짜 (updatedAt)
    const updatedAt = execSync(`git log --follow -1 --format=%aI "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    return {
      createdAt: createdAt || undefined,
      updatedAt: updatedAt || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Git 날짜 조회 함수 생성
 * - Vercel 환경 + GITHUB_TOKEN + config.github: GitHub API 사용 (얕은 clone 대응)
 * - 그 외: 로컬 Git 명령 사용
 */
export function createGitDatesReader(github?: GithubRepo): GitDatesReader {
  if (process.env.VERCEL && process.env.GITHUB_TOKEN && github) {
    const repoRoot = findMonorepoRoot();
    return filePath => getGitDatesFromAPI(filePath, github, repoRoot);
  }

  return async filePath => getGitDatesFromLocal(filePath);
}

/**
 * MDX 콘텐츠의 상대 이미지 경로를 컬렉션 미디어 URL로 변환
 */
export function transformImagePaths(content: string, mediaUrl: string): string {
  // 인라인 이미지: ![alt](./path)
  let result = content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, `![$1](${mediaUrl}/$2)`);
  // 레퍼런스 스타일 정의: [ref]: ./path
  result = result.replace(/^(\[[^\]]+\]):\s*\.\/([\S]+)/gm, `$1: ${mediaUrl}/$2`);
  // HTML 태그 src="./path" 변환 (video, source 등)
  result = result.replace(/\bsrc="\.\/([^"]+)"/g, `src="${mediaUrl}/$1"`);
  return result;
}

function isVideoPath(url: string): boolean {
  const clean = url.split('?')[0].split('#')[0];
  const ext = clean.split('.').pop()?.toLowerCase();
  return ext ? (VIDEO_EXTENSIONS as readonly string[]).includes(`.${ext}`) : false;
}

/**
 * 썸네일 경로 추출 (frontmatter thumbnail → 콘텐츠 첫 이미지)
 */
export function extractFirstImage(
  thumbnail: string | undefined,
  content: string,
  mediaUrl: string,
): string | undefined {
  // 1. frontmatter에 thumbnail이 명시되어 있으면 우선 사용
  if (thumbnail) {
    // 상대 경로 ./로 시작하면 미디어 URL로 변환 (외부 URL·절대 경로는 그대로)
    if (thumbnail.startsWith('./')) {
      return thumbnail.replace('./', `${mediaUrl}/`);
    }

    return thumbnail;
  }

  // 2. 콘텐츠에서 첫 번째 이미지 추출 (인라인 vs 레퍼런스 사용 위치 비교)

  // 레퍼런스 정의 맵 생성: { refId: 'path' }
  const refDefRegex = /^\[([^\]]+)\]:\s*\.\/([\S]+)/gm;
  const refDefMap: Record<string, string> = {};
  for (const m of content.matchAll(refDefRegex)) {
    refDefMap[m[1].toLowerCase()] = m[2];
  }

  // 인라인 이미지: ![alt](./path)
  const inlineImageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/;
  const inlineMatch = content.match(inlineImageRegex);

  // 전체/축약 레퍼런스: ![alt][ref] 또는 ![id][] (collapsed)
  const fullRefUsageRegex = /!\[([^\]]*)\]\[([^\]]*)\]/;
  const fullRefMatch = content.match(fullRefUsageRegex);

  // 축약 레퍼런스: ![id] (뒤에 [ 또는 ( 없음)
  const shortcutRefUsageRegex = /!\[([^\]]+)\](?!\[|\()/;
  const shortcutRefMatch = content.match(shortcutRefUsageRegex);

  // 가장 앞에 위치한 레퍼런스 이미지 사용 선택
  const fullRefPos = fullRefMatch?.index ?? Infinity;
  const shortcutRefPos = shortcutRefMatch?.index ?? Infinity;

  let refUsagePos = Infinity;
  let refId: string | null = null;

  if (fullRefPos <= shortcutRefPos && fullRefMatch) {
    refUsagePos = fullRefPos;
    refId = (fullRefMatch[2] || fullRefMatch[1]).toLowerCase();
  } else if (shortcutRefMatch) {
    refUsagePos = shortcutRefPos;
    refId = shortcutRefMatch[1].toLowerCase();
  }

  const inlinePos = inlineMatch?.index ?? Infinity;

  if (refUsagePos < inlinePos && refId) {
    // 레퍼런스 방식 이미지가 더 앞에 위치
    const refPath = refDefMap[refId];
    if (refPath && !isVideoPath(refPath)) {
      return `${mediaUrl}/${refPath}`;
    }
  } else if (inlineMatch && !isVideoPath(inlineMatch[2])) {
    return `${mediaUrl}/${inlineMatch[2]}`;
  }

  // 외부 URL 이미지도 추출 (video URL 제외)
  const externalImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)/g;
  for (const match of content.matchAll(externalImageRegex)) {
    if (!isVideoPath(match[2])) {
      return match[2];
    }
  }

  return undefined;
}

/**
 * 디렉토리의 .mdx 파일 스캔 (하위 디렉토리 제외)
 */
export function scanMdxDirectory(dir: string): ScannedFile[] {
  const files: ScannedFile[] = [];

  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Warning: MDX directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.mdx')) {
      files.push({
        slug: item.name.replace(/\.mdx$/, ''),
        filePath: path.join(dir, item.name),
      });
    }
  }

  return files;
}

/**
 * MDX 파일 파싱 + frontmatter 스키마 검증
 */
export function parseMdxFile(filePath: string, schema: CollectionDefinition['schema']): MdxParseResult {
  let parsed: matter.GrayMatterFile<string>;

  try {
    parsed = matter(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, issues: [`(root): frontmatter 파싱 실패: ${message}`] };
  }

  const result = schema.safeParse(parsed.data);

  if (!result.success) {
    const issues = result.error.issues.map(issue => {
      const field = issue.path.length > 0 ? issue.path.map(String).join('.') : '(root)';
      return `${field}: ${issue.message}`;
    });
    return { success: false, issues };
  }

  return { success: true, data: result.data, content: parsed.content };
}

/**
 * 1단계: 모든 컬렉션의 MDX 파일을 파싱·검증
 * - 실패한 파일·이슈를 모두 모아 하나의 에러로 throw
 */
export function validateCollections(collections: CollectionMap, paths: ContentPaths): ValidatedCollection[] {
  console.log('🔍 Validating frontmatter...');

  const validated: ValidatedCollection[] = [];
  const failures: string[] = [];
  let fileCount = 0;

  for (const [name, definition] of Object.entries(collections)) {
    const files: ParsedMdxFile[] = [];

    for (const file of scanMdxDirectory(paths.collectionDir(name))) {
      fileCount++;
      const result = parseMdxFile(file.filePath, definition.schema);

      if (result.success) {
        files.push({ ...file, data: result.data, content: result.content });
      } else {
        const issues = result.issues.map(issue => `  - ${issue}`).join('\n');
        failures.push(`[${name}/${path.basename(file.filePath)}]\n${issues}`);
      }
    }

    validated.push({ name, definition, files });
  }

  if (failures.length > 0) {
    throw new Error(`Frontmatter 검증 실패 (${failures.length}개 파일)\n${failures.join('\n')}`);
  }

  console.log(`✅ Validated ${fileCount} files\n`);
  return validated;
}

/**
 * 로컬 썸네일(WebP)을 링크 미리보기용 OG 이미지(JPEG, 1200x630)로 변환
 * 외부 URL 썸네일이나 변환 실패 시 undefined를 반환하여 원본 썸네일을 그대로 사용하게 한다
 */
export async function buildOgImage(
  thumbnail: string | undefined,
  name: string,
  slug: string,
  paths: ContentPaths,
): Promise<string | undefined> {
  if (!thumbnail?.startsWith(`${paths.mediaRootUrl}/`)) return;

  const inputPath = path.join(paths.mediaRootDir, thumbnail.slice(paths.mediaRootUrl.length));
  const outputPath = path.join(paths.mediaDir(name), 'og', `${slug}.jpg`);

  try {
    await generateOgImage({ inputPath, outputPath });
    return `${paths.mediaUrl(name)}/og/${slug}.jpg`;
  } catch (error) {
    console.warn(`⚠️  OG 이미지 생성 실패 [${slug}]: ${(error as Error).message}`);
    return;
  }
}

/**
 * 2단계: 검증된 컬렉션의 레지스트리 항목 생성
 */
export async function buildCollectionEntries(
  { name, definition, files }: ValidatedCollection,
  paths: ContentPaths,
  readGitDates: GitDatesReader,
): Promise<RegistryEntry[]> {
  console.log(`📝 Building registry for collection: ${name}`);

  const mediaUrl = paths.mediaUrl(name);
  const entries: RegistryEntry[] = [];
  let generatedCount = 0;

  for (const { slug, filePath, data, content } of files) {
    console.log(`  - Processing: ${slug}`);

    // Git에서 날짜 추출
    const gitDates = await readGitDates(filePath);

    // 썸네일 추출 (우선순위: frontmatter → 첫 이미지)
    let thumbnail = extractFirstImage(data.thumbnail, content, mediaUrl);

    // 이미지가 없으면 제목으로 썸네일 생성
    if (definition.generateThumbnail && !thumbnail) {
      const outputPath = path.join(paths.mediaDir(name), 'generated', `${slug}.webp`);
      await generateThumbnail({ title: data.title, outputPath });
      thumbnail = `${mediaUrl}/generated/${slug}.webp`;
      generatedCount++;
    }

    const ogImage = await buildOgImage(thumbnail, name, slug, paths);

    // 날짜 우선순위: frontmatter → Git → (수정일은 발행일) → 빌드 시각
    // Git 이력이 없는 빌드 환경에서도 수정일이 빌드마다 바뀌지 않도록 발행일로 고정
    const createdAt = data.createdAt || gitDates.createdAt || new Date().toISOString();
    const updatedAt = data.updatedAt || gitDates.updatedAt || createdAt;

    entries.push({
      slug,
      ...data,
      createdAt,
      updatedAt,
      thumbnail,
      ogImage,
      content: transformImagePaths(content, mediaUrl),
      filePath,
      path: `${definition.route}/${slug}`,
    });
  }

  if (generatedCount > 0) {
    console.log(`📷 ${generatedCount}개 썸네일 생성 완료`);
    console.log(`📁 대상 경로: ${path.join(paths.mediaDir(name), 'generated')}`);
  }
  console.log(`✅ Built ${entries.length} entries for ${name}\n`);
  return entries;
}

/**
 * 콘텐츠 설정 기반 레지스트리 빌드
 * - 경로는 process.cwd()(앱 루트) 기준
 * - frontmatter 검증 실패 시 Git 조회·썸네일 생성 전에 에러 throw
 */
export async function buildContentRegistry<TCollections extends CollectionMap>(
  config: ContentConfig<TCollections>,
): Promise<void> {
  console.log('🚀 Starting registry build...\n');

  const paths = resolveContentPaths(config);

  // 1단계: 전체 파일 검증
  const collections = validateCollections(config.collections, paths);

  // 2단계: 레지스트리 항목 생성
  const readGitDates: GitDatesReader =
    config.gitDates === false ? async () => ({}) : createGitDatesReader(config.github);
  const registry: Record<string, RegistryEntry[]> = {};

  for (const collection of collections) {
    registry[collection.name] = await buildCollectionEntries(collection, paths, readGitDates);
  }

  // JSON 파일 생성
  fs.mkdirSync(path.dirname(paths.registryFile), { recursive: true });
  fs.writeFileSync(paths.registryFile, JSON.stringify({ ...registry, generatedAt: new Date().toISOString() }, null, 2));

  const summary = collections.map(({ name }) => `${name}=${registry[name].length}`).join(', ');

  console.log(`✨ Registry built successfully!`);
  console.log(`📦 Output: ${paths.registryFile}`);
  console.log(`📊 Total entries: ${summary}`);
}
