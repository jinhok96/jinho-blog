import * as path from 'path';

/**
 * IndexNow 키
 * - 검색엔진이 `{사이트}/{키}.txt` 내용과 대조해 소유권 확인 (공개 값)
 * - 바꾸면 public/{키}.txt 파일 이름·내용도 함께 변경 (indexnow.test.ts에서 검증)
 */
export const INDEXNOW_KEY = '9aaa7bea721398ce964f0d57d1b78207';

/** Bing IndexNow 엔드포인트 (제출된 URL은 IndexNow 참여 검색엔진끼리 공유) */
export const INDEXNOW_ENDPOINT = 'https://www.bing.com/indexnow';

/** 요청당 최대 URL 수 (IndexNow 프로토콜 제한) */
export const INDEXNOW_MAX_URLS = 10_000;

export type ChangeType = 'updated' | 'deleted';
export type FileChange = { file: string; type: ChangeType };
export type UrlChange = { url: string; type: ChangeType };

export type IndexNowPayload = { host: string; key: string; keyLocation: string; urlList: string[] };

type ContentRoutes = { contentDir: string; collections: Record<string, { route: string }> };

/**
 * `git diff --name-status -z` 출력 → 파일 변경 목록
 * - 이름 변경(R)은 이전 경로 삭제 + 새 경로 수정, 복사(C)는 새 경로 수정
 */
export function parseNameStatus(output: string): FileChange[] {
  const tokens = output.split('\0').filter(Boolean);
  const changes: FileChange[] = [];

  for (let i = 0; i < tokens.length; ) {
    const status = tokens[i++];

    if (status.startsWith('R')) {
      changes.push({ file: tokens[i++], type: 'deleted' }, { file: tokens[i++], type: 'updated' });
    } else if (status.startsWith('C')) {
      i++;
      changes.push({ file: tokens[i++], type: 'updated' });
    } else {
      changes.push({ file: tokens[i++], type: status === 'D' ? 'deleted' : 'updated' });
    }
  }

  return changes;
}

/**
 * 콘텐츠 파일 경로(앱 루트 기준) → 사이트 경로
 * - mdx-handler 레지스트리와 같은 규칙: `{contentDir}/{컬렉션}/{slug}.mdx` → `{route}/{slug}` (하위 디렉토리 제외)
 * - 컬렉션 MDX가 아니면(이미지 등) null
 */
export function contentFileToPath(file: string, { contentDir, collections }: ContentRoutes): string | null {
  const segments = path.posix.relative(path.posix.normalize(contentDir), file).split('/');
  if (segments.length !== 2) return null;

  const [collection, fileName] = segments;
  if (!Object.hasOwn(collections, collection) || !fileName.endsWith('.mdx')) return null;

  return `${collections[collection].route}/${fileName.slice(0, -'.mdx'.length)}`;
}

const XML_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** sitemap.xml → `<loc>` URL 목록 (XML 엔티티 복원) */
export function parseSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([, loc]) =>
    loc.replace(/&(amp|lt|gt|quot|apos);/g, (_, name: string) => XML_ENTITIES[name]),
  );
}

/**
 * 제출 대상 선별 (sitemap = 배포된 사이트 기준)
 * - 수정: sitemap에 있는 URL만 → 없으면 missing (초안이거나 배포 반영 전)
 * - 삭제: sitemap에서 빠진 URL만
 * - 같은 URL이 삭제·수정 모두면 수정으로 처리 (이름을 바꿨다가 되돌린 경우 등)
 */
export function selectUrls(
  changes: UrlChange[],
  sitemapUrls: ReadonlySet<string>,
): { submit: string[]; missing: string[] } {
  const types = new Map<string, ChangeType>();
  for (const { url, type } of changes) {
    if (types.get(url) !== 'updated') types.set(url, type);
  }

  const submit: string[] = [];
  const missing: string[] = [];

  for (const [url, type] of types) {
    if (type === 'deleted') {
      if (!sitemapUrls.has(url)) submit.push(url);
    } else if (sitemapUrls.has(url)) {
      submit.push(url);
    } else {
      missing.push(url);
    }
  }

  return { submit, missing };
}

/** GitHub REST API 조회 (현재 저장소 기준 경로 → JSON) */
export type GitHubRequest = (apiPath: string) => Promise<unknown>;

type Deployment = { id: number; sha: string };
type DeploymentStatus = { state: string };

/**
 * 같은 환경의 직전 성공 배포 커밋
 * - 배포 목록은 최신순, id는 생성 순으로 증가 → 현재 배포보다 id가 작은 것 중 처음 성공한 배포
 * - 이후 배포가 성공하면 이전 배포 상태가 inactive로 바뀌므로 상태 이력 전체에서 success 확인
 */
export async function findPreviousDeploymentSha({
  deploymentId,
  environment,
  request,
}: {
  deploymentId: number;
  environment: string;
  request: GitHubRequest;
}): Promise<string | null> {
  const deployments = (await request(
    `/deployments?environment=${encodeURIComponent(environment)}&per_page=30`,
  )) as Deployment[];

  for (const { id, sha } of deployments) {
    if (id >= deploymentId) continue;

    const statuses = (await request(`/deployments/${id}/statuses?per_page=100`)) as DeploymentStatus[];
    if (statuses.some(({ state }) => state === 'success')) return sha;
  }

  return null;
}

/** IndexNow 요청 본문 (요청당 최대 URL 수로 분할) */
export function buildPayloads(siteUrl: string, urls: string[]): IndexNowPayload[] {
  const payloads: IndexNowPayload[] = [];

  for (let i = 0; i < urls.length; i += INDEXNOW_MAX_URLS) {
    payloads.push({
      host: new URL(siteUrl).host,
      key: INDEXNOW_KEY,
      keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(i, i + INDEXNOW_MAX_URLS),
    });
  }

  return payloads;
}
