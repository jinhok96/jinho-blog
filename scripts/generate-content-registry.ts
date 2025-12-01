import * as fs from 'fs';
import * as path from 'path';

import matter from 'gray-matter';

type ContentSection = 'blog' | 'portfolio' | 'projects' | 'libraries';

interface ContentEntry {
  slug: string;
  importPath?: string; // TSX 파일의 경우
  filePath?: string; // MDX 파일의 경우
  fileType: 'tsx' | 'mdx';
  metadata?: Record<string, unknown>; // MDX 파일의 frontmatter
}

/**
 * 콘텐츠 디렉토리를 스캔하여 모든 .tsx 및 .mdx 파일 찾기
 */
function discoverContent(section: ContentSection): ContentEntry[] {
  const viewsDir = path.join(process.cwd(), 'src', 'views', section);
  const entries: ContentEntry[] = [];

  if (!fs.existsSync(viewsDir)) {
    console.warn(`⚠️  Warning: Views directory not found: ${viewsDir}`);
    return entries;
  }

  function scan(dir: string, relativePath: string = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const itemRelativePath = relativePath
        ? path.join(relativePath, item.name)
        : item.name;

      if (item.isDirectory()) {
        // 폴더 내부 스캔
        scan(fullPath, itemRelativePath);
      } else if (item.name === 'index.tsx' || item.name === 'index.mdx') {
        // {slug}/index.tsx 또는 {slug}/index.mdx 패턴
        const slug = relativePath || item.name.replace(/\.(tsx|mdx)$/, '');
        const fileType = item.name.endsWith('.mdx') ? 'mdx' : 'tsx';

        if (fileType === 'mdx') {
          // MDX 파일: 파일 경로와 메타데이터 저장
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(fileContent);
          entries.push({
            slug,
            filePath: fullPath,
            fileType,
            metadata: data,
          });
        } else {
          // TSX 파일: import 경로 저장
          entries.push({
            slug,
            importPath: `@/views/${section}/${slug}`,
            fileType,
          });
        }
      } else if ((item.name.endsWith('.tsx') || item.name.endsWith('.mdx')) && !relativePath) {
        // 루트 레벨의 단일 파일
        const slug = item.name.replace(/\.(tsx|mdx)$/, '');
        const fileType = item.name.endsWith('.mdx') ? 'mdx' : 'tsx';

        if (fileType === 'mdx') {
          // MDX 파일: 파일 경로와 메타데이터 저장
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(fileContent);
          entries.push({
            slug,
            filePath: fullPath,
            fileType,
            metadata: data,
          });
        } else {
          // TSX 파일: import 경로 저장
          entries.push({
            slug,
            importPath: `@/views/${section}/${slug}`,
            fileType,
          });
        }
      }
    }
  }

  scan(viewsDir);
  return entries;
}

/**
 * 섹션명을 PascalCase로 변환
 */
function toPascalCase(section: ContentSection): string {
  const map: Record<ContentSection, string> = {
    blog: 'Blog',
    portfolio: 'Portfolio',
    projects: 'Project',
    libraries: 'Library',
  };
  return map[section];
}

/**
 * 카테고리 타입명 생성
 */
function getCategoryType(section: ContentSection): string {
  const map: Record<ContentSection, string> = {
    blog: 'BlogCategory',
    portfolio: 'PortfolioCategory',
    projects: 'ProjectCategory',
    libraries: 'LibraryCategory',
  };
  return map[section];
}

/**
 * 엔티티 폴더명으로 변환 (views는 복수형, entities는 단수형)
 */
function getEntityFolderName(section: ContentSection): string {
  const map: Record<ContentSection, string> = {
    blog: 'blog',
    portfolio: 'portfolio',
    projects: 'project',
    libraries: 'library',
  };
  return map[section];
}

/**
 * 레지스트리 파일 생성
 */
function generateRegistry(section: ContentSection) {
  const entries = discoverContent(section);

  if (entries.length === 0) {
    console.warn(
      `⚠️  Warning: No content found for section: ${section}`
    );
    return;
  }

  const pascalSection = toPascalCase(section);
  const categoryType = getCategoryType(section);
  const typeName = pascalSection;

  // TSX 파일만 Import 문 생성
  const tsxEntries = entries.filter(e => e.fileType === 'tsx');
  const imports = tsxEntries
    .map(
      (entry, idx) =>
        `import Content${idx}, { metadata as meta${idx} } from '${entry.importPath}';`
    )
    .join('\n');

  // 배열 항목 생성
  let tsxIndex = 0;
  const arrayItems = entries
    .map(entry => {
      if (entry.fileType === 'tsx') {
        const idx = tsxIndex++;
        return `  {
    slug: '${entry.slug}',
    ...meta${idx},
    Component: Content${idx},
  }`;
      } else {
        // MDX 파일
        const metadataStr = JSON.stringify(entry.metadata, null, 4)
          .split('\n')
          .map((line, i) => (i === 0 ? line : `    ${line}`))
          .join('\n');
        // Windows 경로의 백슬래시를 슬래시로 변경
        const normalizedPath = entry.filePath?.replace(/\\/g, '/') || '';
        return `  {
    slug: '${entry.slug}',
    ...${metadataStr},
    filePath: '${normalizedPath}',
  }`;
      }
    })
    .join(',\n');

  // 카테고리 필터 함수명
  const filterFunctionName = `get${pascalSection}ListByCategory`;
  const registryName = `${section}Registry`;

  // TypeScript 코드 생성
  const code = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated by scripts/generate-content-registry.ts

import type { ${typeName} } from './types';
import type { ${categoryType} } from '@/core/types/metadata';

${imports}

export const ${registryName}: ${typeName}[] = [
${arrayItems}
];

/**
 * 카테고리로 콘텐츠 필터링
 */
export function ${filterFunctionName}(category: ${categoryType}): ${typeName}[] {
  return ${registryName}.filter(item => item.category.includes(category));
}
`;

  // 출력 경로 설정
  const entityFolder = getEntityFolderName(section);
  const outputPath = path.join(
    process.cwd(),
    'src',
    'entities',
    entityFolder,
    'registry.generated.ts'
  );

  // 파일 쓰기
  fs.writeFileSync(outputPath, code, 'utf-8');

  const tsxCount = entries.filter(e => e.fileType === 'tsx').length;
  const mdxCount = entries.filter(e => e.fileType === 'mdx').length;

  console.log(
    `✅ Generated ${section} registry: ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} (${tsxCount} TSX, ${mdxCount} MDX)`
  );
}

/**
 * 모든 섹션 레지스트리 생성
 */
function generateAllRegistries() {
  console.log('🔧 Generating content registries...\n');

  const sections: ContentSection[] = [
    'blog',
    'portfolio',
    'projects',
    'libraries',
  ];

  sections.forEach(section => {
    try {
      generateRegistry(section);
    } catch (error) {
      console.error(`❌ Error generating registry for ${section}:`, error);
      process.exit(1);
    }
  });

  console.log('\n✨ All registries generated successfully!');
}

// 스크립트 실행
generateAllRegistries();
