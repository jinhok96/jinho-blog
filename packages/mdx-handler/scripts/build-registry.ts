/**
 * 빌드 타임에 MDX 레지스트리를 생성하는 스크립트
 * 모든 MDX 파일을 스캔하고 Git 히스토리를 추출하여 JSON으로 출력
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import matter from 'gray-matter';
import * as path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { PATHS } from '../src/core/config';
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

  return content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, `![$1](${PATHS.STATIC_MDX_URL}/${section}/$2)`);
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

  // 2. 콘텐츠에서 첫 번째 이미지 추출
  const imageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/;
  const match = content.match(imageRegex);

  if (match && section) {
    const imagePath = match[2];
    return `${PATHS.STATIC_MDX_URL}/${section}/${imagePath}`;
  }

  // 외부 URL 이미지도 추출
  const externalImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/;
  const externalMatch = content.match(externalImageRegex);

  if (externalMatch) {
    return externalMatch[2];
  }

  return undefined;
}

// 폰트 base64 캐시 (여러 blog 글 처리 시 한 번만 읽음)
let fontBase64Cache: string | null | undefined = undefined;

/**
 * 폰트 파일을 읽어 base64로 인코딩 (캐시 사용)
 */
function getFontBase64(): string | null {
  if (fontBase64Cache !== undefined) return fontBase64Cache;

  try {
    const fontPath = path.join(fileURLToPath(new URL('../assets/PretendardVariable.woff2', import.meta.url)));
    fontBase64Cache = fs.readFileSync(fontPath).toString('base64');
    return fontBase64Cache;
  } catch {
    console.warn('⚠️  Font file not found, thumbnail will use fallback font');
    fontBase64Cache = null;
    return null;
  }
}

/**
 * title 텍스트를 maxChars 기준으로 줄 배열로 분리
 * 최대 3줄, 초과 시 마지막 줄에 말줄임 처리
 */
function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let remaining = text.trim();

  while (remaining.length > 0 && lines.length < 3) {
    if (remaining.length <= maxChars) {
      lines.push(remaining);
      remaining = '';
      break;
    }

    // 공백 기준으로 자르기 시도
    let cutAt = maxChars;
    while (cutAt > 0 && remaining[cutAt] !== ' ') {
      cutAt--;
    }
    // 공백이 없으면 글자 수 기준으로 자르기
    if (cutAt === 0) cutAt = maxChars;

    lines.push(remaining.substring(0, cutAt));
    remaining = remaining.substring(cutAt).trim();
  }

  // 남은 텍스트가 있으면 마지막 줄에 말줄임
  if (remaining.length > 0 && lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > maxChars - 1 ? last.substring(0, maxChars - 1) + '…' : last + '…';
  }

  return lines;
}

/**
 * SVG 썸네일 문자열 생성
 */
function buildThumbnailSvg(title: string, fontBase64: string | null): string {
  const width = 1280;
  const height = 720;
  const paddingX = 80;
  const fontSize = 96;
  const lineHeight = fontSize * 1.35;
  const letterSpacing = fontSize * -0.03;
  // 텍스트 영역 너비 기준 자동 계산 (한/영 혼용 평균 글자 너비 ≈ fontSize * 0.79)
  const maxChars = Math.floor((width - paddingX * 2) / (fontSize * 0.79));

  const lines = wrapText(title, maxChars);
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 + fontSize;

  const fontFamily = fontBase64 ? 'Pretendard, Arial, sans-serif' : 'Arial, sans-serif';

  const fontFaceStyle = fontBase64
    ? `@font-face { font-family: 'Pretendard'; src: url('data:font/woff2;base64,${fontBase64}') format('woff2'); }`
    : '';

  const textLines = lines
    .map((line, i) => {
      const y = startY + i * lineHeight;
      const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return `<text x="${paddingX}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="900" letter-spacing="${letterSpacing}" fill="#ffffff" dominant-baseline="auto">${escaped}</text>`;
    })
    .join('\n  ');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${fontFaceStyle}</style>
  </defs>
  <rect width="${width}" height="${height}" fill="#314158"/>
  ${textLines}
</svg>`;
}

/**
 * blog 글의 자동 생성 썸네일 WebP 파일 생성
 * 실패 시 undefined 반환 (빌드 중단 없음)
 */
async function generateBlogThumbnail(slug: string, title: string): Promise<string | undefined> {
  try {
    const outputDir = path.join(MONOREPO_ROOT, PATHS.PUBLIC_STATIC_MDX_DIR, 'blog', '_generated');
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${slug}.webp`);

    const fontBase64 = getFontBase64();
    const svg = buildThumbnailSvg(title, fontBase64);

    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outputPath);

    console.log(`    🖼️  Generated thumbnail: ${slug}.webp`);
    return `${PATHS.STATIC_MDX_URL}/blog/_generated/${slug}.webp`;
  } catch (error) {
    console.warn(`⚠️  Failed to generate thumbnail for "${slug}":`, error);
    return undefined;
  }
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
 * MDX 파일 파싱 및 메타데이터 + 콘텐츠 추출
 */
async function parseMdxFile(filePath: string, section: ContentSection): Promise<Record<string, unknown>> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Git에서 날짜 추출
  const gitDates = await getGitDates(filePath);

  // 썸네일 추출 (우선순위: frontmatter → 첫 이미지 → 자동 생성)
  let thumbnail = extractFirstImage(data, content, section);

  if (!thumbnail && section === 'blog') {
    const slug = path.basename(filePath, '.mdx');
    const title = typeof data.title === 'string' ? data.title : slug;
    thumbnail = await generateBlogThumbnail(slug, title);
  }

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

  for (const file of files) {
    console.log(`  - Processing: ${file.slug}`);
    const metadata = await parseMdxFile(file.filePath, section);

    entries.push({
      slug: file.slug,
      ...metadata,
      filePath: file.filePath,
      path: `${MDX_ROUTES[section]}/${file.slug}`,
    });
  }

  console.log(`✅ Built ${entries.length} entries for ${section}\n`);
  return entries;
}

/**
 * 전체 레지스트리 빌드
 */
async function buildAllRegistries(): Promise<void> {
  console.log('🚀 Starting registry build...\n');

  // 자동 생성 썸네일 디렉토리 초기화 (매 빌드마다 새로 생성)
  const generatedDir = path.join(MONOREPO_ROOT, PATHS.PUBLIC_STATIC_MDX_DIR, 'blog', '_generated');
  fs.rmSync(generatedDir, { recursive: true, force: true });

  const registry: Record<ContentSection, RegistryEntry[]> = {
    blog: [],
    projects: [],
    libraries: [],
  };

  for (const section of SECTIONS) {
    registry[section] = await buildRegistry(section);
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
  buildThumbnailSvg,
  extractFirstImage,
  generateBlogThumbnail,
  getGitDates,
  getGitDatesFromAPI,
  getGitDatesFromLocal,
  parseMdxFile,
  scanMdxDirectory,
  transformImagePaths,
  wrapText,
};

// 스크립트 실행
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildAllRegistries().catch(error => {
    console.error('❌ Registry build failed:', error);
    process.exit(1);
  });
}
