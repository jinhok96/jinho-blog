import { execFileSync } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

import { SITE_INDEXABLE, SITE_URL } from '../src/core/config';
import { contentConfig } from '../src/core/content';
import { absoluteUrl } from '../src/core/seo';
import {
  buildPayloads,
  contentFileToPath,
  findPreviousDeploymentSha,
  INDEXNOW_ENDPOINT,
  parseNameStatus,
  parseSitemapUrls,
  selectUrls,
  type UrlChange,
} from './lib/indexnow';

/** 수정된 글이 sitemap에 없을 때 재확인 횟수·간격 (배포 반영 대기. 초안이면 끝내 없음) */
const SITEMAP_ATTEMPTS = 4;
const SITEMAP_RETRY_MS = 15_000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`환경변수 ${name}가 필요합니다.`);
  return value;
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' });
}

/** 배포된 sitemap.xml의 URL */
async function fetchSitemapUrls(): Promise<Set<string>> {
  const response = await fetch(absoluteUrl('/sitemap.xml'));
  if (!response.ok) throw new Error(`sitemap 조회 실패 (${response.status})`);
  return new Set(parseSitemapUrls(await response.text()));
}

/** GitHub REST API (현재 저장소) */
async function githubRequest(apiPath: string): Promise<unknown> {
  const response = await fetch(`https://api.github.com/repos/${requireEnv('GITHUB_REPOSITORY')}${apiPath}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${requireEnv('GITHUB_TOKEN')}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API 조회 실패 (${response.status}): ${apiPath}`);
  return response.json();
}

/**
 * 직전 성공 배포 이후 바뀐 콘텐츠 URL
 * - 비교 범위: 같은 Vercel 환경의 직전 성공 배포 커밋 → 이번 배포 커밋
 * - 배포된 sitemap으로 초안·삭제 여부 확인
 */
async function collectChangedUrls(): Promise<string[]> {
  const head = requireEnv('DEPLOYMENT_SHA');
  const previous = await findPreviousDeploymentSha({
    deploymentId: Number(requireEnv('DEPLOYMENT_ID')),
    environment: requireEnv('DEPLOYMENT_ENVIRONMENT'),
    request: githubRequest,
  });
  // 직전 성공 배포를 찾지 못하면 첫 번째 부모와 비교 (main 머지 커밋이면 PR 전체 변경)
  const base = previous ?? `${head}^1`;
  console.log(`[indexnow] 비교 범위: ${base}..${head}`);

  const diff = git(['diff', '--name-status', '-z', '-M', '--relative', base, head, '--', contentConfig.contentDir]);
  const changes = parseNameStatus(diff).flatMap(({ file, type }): UrlChange[] => {
    const sitePath = contentFileToPath(file, contentConfig);
    return sitePath ? [{ url: absoluteUrl(sitePath), type }] : [];
  });
  if (changes.length === 0) return [];

  for (let attempt = 1; ; attempt++) {
    const { submit, missing } = selectUrls(changes, await fetchSitemapUrls());

    if (missing.length === 0 || attempt === SITEMAP_ATTEMPTS) {
      if (missing.length > 0) console.log(`[indexnow] sitemap에 없어 제외 (초안 등):\n${missing.join('\n')}`);
      return submit;
    }

    console.log(`[indexnow] sitemap 미반영 ${missing.length}건 → ${SITEMAP_RETRY_MS / 1000}초 후 재확인`);
    await sleep(SITEMAP_RETRY_MS);
  }
}

async function submit(urls: string[]) {
  for (const payload of buildPayloads(SITE_URL, urls)) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    // 200: 접수, 202: 접수(키 파일 검증 대기)
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`IndexNow 제출 실패 (${response.status}): ${await response.text()}`);
    }
    console.log(`[indexnow] ${payload.urlList.length}건 제출 완료 (${response.status})`);
  }
}

/**
 * IndexNow 제출 (Bing 등)
 * - INDEXNOW_MODE=changed(기본): 직전 성공 배포 이후 추가·수정·삭제된 글 (GitHub Actions deployment_status)
 * - INDEXNOW_MODE=all: 배포된 sitemap 전체 (초기 제출용)
 * - INDEXNOW_DRY_RUN=true: 대상 URL만 출력
 */
async function main() {
  // 도메인 미설정이면 자리표시 URL(example.com)이 제출되므로 중단
  if (!SITE_INDEXABLE) throw new Error('NEXT_PUBLIC_SITE_URL이 설정되지 않았습니다.');

  const mode = process.env.INDEXNOW_MODE || 'changed';
  if (mode !== 'changed' && mode !== 'all') throw new Error(`알 수 없는 INDEXNOW_MODE: ${mode}`);

  const urls = mode === 'all' ? [...(await fetchSitemapUrls())] : await collectChangedUrls();
  if (urls.length === 0) {
    console.log('[indexnow] 제출할 URL 없음');
    return;
  }

  console.log(`[indexnow] 제출 대상 ${urls.length}건:\n${urls.join('\n')}`);
  if (process.env.INDEXNOW_DRY_RUN === 'true') {
    console.log('[indexnow] dry run → 제출 생략');
    return;
  }

  await submit(urls);
}

main().catch(error => {
  console.error('❌ IndexNow 제출 실패:', error);
  process.exit(1);
});
