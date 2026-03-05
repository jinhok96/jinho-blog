/**
 * 빌드 타임에 MDX 레지스트리를 생성하는 스크립트
 * 모든 MDX 파일을 스캔하고 Git 히스토리를 추출하여 JSON으로 출력
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import matter from 'gray-matter';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { generateThumbnail } from '@jinho-blog/thumbnail-generator';

import { PATHS } from '../src/core/config';
import { validateFrontmatter } from './validate-frontmatter.js';
import type { ContentSection } from '../src/types';

interface ScannedFile {
  slug: string;
  filePath: string;
}

interface GitDates {
  createdAt?: string;
  updatedAt?: string;
}

interface RegistryEntry {
  slug: string;
  filePath: string;
  path: string;
  [key: string]: unknown;
}

interface Registry {
  blog: RegistryEntry[];
  projects: RegistryEntry[];
  libraries: RegistryEntry[];
  generatedAt: string;
}

const SECTIONS: ContentSection[] = ['blog', 'projects', 'libraries'];
const MDX_ROUTES: Record<ContentSection, string> = {
  blog: '/blog',
  projects: '/projects',
  libraries: '/libraries',
};

/**
 * 모노레포 루트 찾기 (package.json에 workspaces가 있는 디렉토리)
 */
function findMonorepoRoot(): string {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        return currentDir;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  // fallback: 스크립트가 packages/mdx-handler/scripts에 있다고 가정
  return path.join(fileURLToPath(new URL('../../..', import.meta.url)));
}

const MONOREPO_ROOT = findMonorepoRoot();

// GitHub repository 정보
const GITHUB_OWNER = 'jinhok96';
const GITHUB_REPO = 'jinho-blog';

/**
 * GitHub API로 파일의 커밋 히스토리 조회
 */
async function getGitDatesFromAPI(filePath: string): Promise<GitDates> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('⚠️  GITHUB_TOKEN not found, falling back to local git');
    return {};
  }

  try {
    // 파일 경로를 repository root 기준 상대 경로로 변환
    const relativePath = path.relative(MONOREPO_ROOT, filePath).replace(/\\/g, '/');

    // Vercel 배포 브랜치 또는 기본 브랜치 사용
    const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';

    // GitHub API로 커밋 히스토리 조회 (oldest first)
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${relativePath}&sha=${branch}&per_page=100`,
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
function getGitDatesFromLocal(filePath: string): GitDates {
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
 * Git 히스토리에서 파일의 생성/수정 날짜 추출
 * Vercel 환경: GitHub API 사용
 * 로컬 환경: Git 명령 사용
 */
async function getGitDates(filePath: string): Promise<GitDates> {
  // Vercel 환경이고 GitHub token이 있으면 API 사용
  if (process.env.VERCEL && process.env.GITHUB_TOKEN) {
    return await getGitDatesFromAPI(filePath);
  }

  // 로컬 환경에서는 git 명령 사용
  return getGitDatesFromLocal(filePath);
}

/**
 * MDX 콘텐츠의 이미지 경로를 Next.js static 경로로 변환
 */
function transformImagePaths(content: string, section: ContentSection | null): string {
  if (!section) return content;

  // 인라인 이미지: ![alt](./path)
  let result = content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, `![$1](${PATHS.STATIC_MDX_URL}/${section}/$2)`);
  // 레퍼런스 스타일 정의: [ref]: ./path
  result = result.replace(/^(\[[^\]]+\]):\s*\.\/([\S]+)/gm, `$1: ${PATHS.STATIC_MDX_URL}/${section}/$2`);
  return result;
}

/**
 * MDX 콘텐츠에서 첫 번째 이미지 경로 추출
 */
function extractFirstImage(
  frontmatter: Record<string, unknown>,
  content: string,
  section: ContentSection | null,
): string | undefined {
  // 1. frontmatter에 thumbnail이 명시되어 있으면 우선 사용
  if (frontmatter.thumbnail && typeof frontmatter.thumbnail === 'string') {
    const thumbnail = frontmatter.thumbnail;

    // 외부 URL이면 그대로 반환
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
      return thumbnail;
    }

    // 상대 경로 ./로 시작하면 절대 경로로 변환
    if (thumbnail.startsWith('./') && section) {
      return thumbnail.replace('./', `${PATHS.STATIC_MDX_URL}/${section}/`);
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

  if (inlinePos !== Infinity || refUsagePos !== Infinity) {
    if (section) {
      if (refUsagePos < inlinePos && refId) {
        // 레퍼런스 방식 이미지가 더 앞에 위치
        const refPath = refDefMap[refId];
        if (refPath) {
          return `${PATHS.STATIC_MDX_URL}/${section}/${refPath}`;
        }
      } else if (inlineMatch) {
        return `${PATHS.STATIC_MDX_URL}/${section}/${inlineMatch[2]}`;
      }
    }
  }

  // 외부 URL 이미지도 추출
  const externalImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/;
  const externalMatch = content.match(externalImageRegex);

  if (externalMatch) {
    return externalMatch[2];
  }

  return undefined;
}

/**
 * MDX 파일 파싱 및 메타데이터 + 콘텐츠 추출
 */
async function parseMdxFile(filePath: string, section: ContentSection): Promise<Record<string, unknown>> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Frontmatter 검증
  const validation = validateFrontmatter(data, section);
  if (!validation.valid) {
    const errorMessages = validation.errors.map(e => `  - ${e.field}: ${e.message}`).join('\n');
    throw new Error(`Frontmatter 검증 실패 [${path.basename(filePath)}]:\n${errorMessages}`);
  }

  // Git에서 날짜 추출
  const gitDates = await getGitDates(filePath);

  // 썸네일 추출 (우선순위: frontmatter → 첫 이미지)
  const thumbnail = extractFirstImage(data, content, section);

  // 이미지 경로 변환
  const transformedContent = transformImagePaths(content, section);

  // 메타데이터 + 콘텐츠 생성
  const now = new Date().toISOString();
  const metadata = {
    ...data,
    createdAt: data.createdAt || gitDates.createdAt || now,
    updatedAt: data.updatedAt || gitDates.updatedAt || now,
    thumbnail,
    content: transformedContent, // 변환된 MDX 콘텐츠 포함
  };

  return metadata;
}

/**
 * 특정 섹션의 레지스트리 생성
 */
async function buildRegistry(section: ContentSection): Promise<RegistryEntry[]> {
  console.log(`📝 Building registry for section: ${section}`);

  const files = scanMdxDirectory(section);
  const entries: RegistryEntry[] = [];
  let generatedCount = 0;

  for (const file of files) {
    console.log(`  - Processing: ${file.slug}`);
    const metadata = await parseMdxFile(file.filePath, section);

    if (section === 'blog' && !metadata.thumbnail) {
      const outputPath = path.join(
        MONOREPO_ROOT,
        PATHS.PUBLIC_STATIC_MDX_DIR,
        section,
        'generated',
        `${file.slug}.webp`,
      );
      await generateThumbnail({ title: metadata.title as string, outputPath });
      metadata.thumbnail = `${PATHS.STATIC_MDX_URL}/${section}/generated/${file.slug}.webp`;
      generatedCount++;
    }

    entries.push({
      slug: file.slug,
      ...metadata,
      filePath: file.filePath,
      path: `${MDX_ROUTES[section]}/${file.slug}`,
    });
  }

  if (generatedCount > 0) {
    console.log(`📷 ${generatedCount}개 썸네일 생성 완료`);
  }
  console.log(`✅ Built ${entries.length} entries for ${section}\n`);
  return entries;
}

/**
 * MDX 디렉토리를 스캔하여 모든 .mdx 파일 찾기
 */
function scanMdxDirectory(section: ContentSection): ScannedFile[] {
  const mdxDir = path.join(MONOREPO_ROOT, 'content', 'mdx', section);
  const files: ScannedFile[] = [];

  if (!fs.existsSync(mdxDir)) {
    console.warn(`⚠️  Warning: MDX directory not found: ${mdxDir}`);
    return files;
  }

  const items = fs.readdirSync(mdxDir, { withFileTypes: true });

  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.mdx')) {
      const fullPath = path.join(mdxDir, item.name);
      const slug = item.name.replace(/\.mdx$/, '');

      files.push({
        slug,
        filePath: fullPath,
      });
    }
  }

  return files;
}

/**
 * 전체 레지스트리 빌드
 */
async function buildAllRegistries(): Promise<void> {
  console.log('🚀 Starting registry build...\n');

  const registry: Record<ContentSection, RegistryEntry[]> = {
    blog: [],
    projects: [],
    libraries: [],
  };

  for (const section of SECTIONS) {
    registry[section] = await buildRegistry(section);
  }

  const totalGenerated = registry.blog.filter(e => (e.thumbnail as string | undefined)?.includes('/generated/')).length;
  if (totalGenerated > 0) {
    console.log(`📷 총 ${totalGenerated}개 썸네일 생성 완료`);
    console.log(`📁 대상 경로: ${path.join(PATHS.PUBLIC_STATIC_MDX_DIR, 'blog', 'generated')}\n`);
  }

  // 출력 디렉토리 생성
  const outputPath = path.join(MONOREPO_ROOT, PATHS.REGISTRY_JSON);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // JSON 파일 생성
  const registryWithTimestamp: Registry = {
    ...registry,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(registryWithTimestamp, null, 2));

  console.log(`✨ Registry built successfully!`);
  console.log(`📦 Output: ${outputPath}`);
  console.log(
    `📊 Total entries: blog=${registry.blog.length}, projects=${registry.projects.length}, libraries=${registry.libraries.length}`,
  );
}

export {
  buildAllRegistries,
  buildRegistry,
  extractFirstImage,
  getGitDates,
  getGitDatesFromAPI,
  getGitDatesFromLocal,
  parseMdxFile,
  scanMdxDirectory,
  transformImagePaths,
};

// 스크립트 실행
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildAllRegistries().catch(error => {
    console.error('❌ Registry build failed:', error);
    process.exit(1);
  });
}
