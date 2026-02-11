import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../core/utils/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../core/utils/index.js')>('../../core/utils/index.js');
  return {
    ...actual,
    getRegistry: vi.fn(),
  };
});

import type { Project } from './project.service.js';

import { getRegistry } from '../../core/utils/index.js';
import { getProject, getProjectContent, getProjects } from './project.service.js';

const mockGetRegistry = vi.mocked(getRegistry);

function makeProject(overrides: Partial<Project> & Pick<Project, 'slug' | 'title'>): Project {
  return {
    slug: overrides.slug,
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'personal',
    tech: overrides.tech ?? [],
    period: overrides.period ?? '2024.01 - 2024.06',
    members: overrides.members ?? '1명',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
    filePath: overrides.filePath ?? `/projects/${overrides.slug}.mdx`,
    path: overrides.path ?? `/projects/${overrides.slug}`,
    content: overrides.content ?? `# ${overrides.title}`,
  };
}

const MOCK_PROJECTS: Project[] = [
  makeProject({
    slug: 'blog',
    title: 'Blog',
    category: 'personal',
    tech: ['nextjs', 'typescript'],
    createdAt: '2024-01-01T00:00:00Z',
  }),
  makeProject({
    slug: 'tripmoney-app',
    title: 'TripMoney',
    category: 'tripmoney',
    tech: ['react', 'typescript'],
    createdAt: '2024-03-01T00:00:00Z',
  }),
  makeProject({
    slug: 'portfolio',
    title: 'Portfolio',
    category: 'personal',
    tech: ['react'],
    createdAt: '2024-02-01T00:00:00Z',
  }),
];

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetRegistry.mockReturnValue(MOCK_PROJECTS);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getProjects
// ---------------------------------------------------------------------------
describe('getProjects', () => {
  it('옵션 없이 기본 정렬(createdAt,desc)로 전체 반환', async () => {
    const result = await getProjects();
    expect(result.items).toHaveLength(3);
    expect(result.items[0].slug).toBe('tripmoney-app'); // createdAt,desc 최신순
  });

  it('category 필터링', async () => {
    const result = await getProjects({ category: 'personal' });
    expect(result.items.map(p => p.slug)).toEqual(expect.arrayContaining(['blog', 'portfolio']));
    expect(result.items).toHaveLength(2);
  });

  it('tech 필터링 (AND 조건)', async () => {
    const result = await getProjects({ tech: 'react,typescript' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('tripmoney-app');
  });

  it('search 필터링 (title 기준)', async () => {
    const result = await getProjects({ search: 'trip' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('tripmoney-app');
  });

  it('sort: alphabetic,asc 알파벳 오름차순', async () => {
    const result = await getProjects({ sort: 'alphabetic,asc' });
    expect(result.items[0].title).toBe('Blog');
  });

  it('pagination: count=1, page=2', async () => {
    const result = await getProjects({ count: '1', page: '2' });
    expect(result.items).toHaveLength(1);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.totalItems).toBe(3);
  });

  it('빈 registry', async () => {
    mockGetRegistry.mockReturnValue([]);
    const result = await getProjects();
    expect(result.items).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getProject
// ---------------------------------------------------------------------------
describe('getProject', () => {
  it('존재하는 slug: 해당 project 반환', async () => {
    const result = await getProject('blog');
    expect(result?.slug).toBe('blog');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getProject('nonexistent');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getProjectContent
// ---------------------------------------------------------------------------
describe('getProjectContent', () => {
  it('content 있는 slug: content 문자열 반환', async () => {
    const result = await getProjectContent('blog');
    expect(result).toBe('# Blog');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getProjectContent('nonexistent');
    expect(result).toBeNull();
  });

  it('content 필드 없는 project: null 반환', async () => {
    const projectWithoutContent = makeProject({ slug: 'no-content', title: 'No Content' });
    delete (projectWithoutContent as Record<string, unknown>).content;
    mockGetRegistry.mockReturnValue([projectWithoutContent]);

    const result = await getProjectContent('no-content');
    expect(result).toBeNull();
  });
});
