/**
 * Vercel Ignored Build Step: 앱에 영향 없는 커밋은 빌드를 건너뜀
 *
 * - 감시 경로: 앱 폴더 + workspace 의존 패키지(재귀) + 루트 공통 파일 + 인자로 받은 추가 경로
 * - 비교 기준: 해당 프로젝트·브랜치의 마지막 성공 배포 커밋(VERCEL_GIT_PREVIOUS_SHA) → 현재 커밋
 * - Vercel 규칙: exit 0 = 빌드 건너뜀, exit 1 = 빌드 진행
 * - 판단할 수 없으면(첫 배포, 기준 커밋이 shallow clone에 없음, git 오류) 항상 빌드
 *
 * 사용: apps/{app}/vercel.json → "ignoreCommand": "node ../../scripts/vercel-ignore.mjs [추가 감시 경로...]"
 * (추가 감시 경로는 저장소 루트 기준, 예: content/mdx)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** 모든 앱 빌드에 영향을 주는 루트 파일 */
const ROOT_WATCH_PATHS = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'scripts/vercel-ignore.mjs',
];

/** workspace 패키지가 있는 폴더 (pnpm-workspace.yaml과 동일) */
const WORKSPACE_DIRS = ['apps', 'packages'];

const BUILD = 1;
const SKIP = 0;

function git(rootDir, args) {
  return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

/**
 * workspace 패키지 목록: 패키지 이름 → { dir(루트 기준 경로), deps(workspace 의존 패키지 이름) }
 */
function readWorkspacePackages(rootDir) {
  const packages = new Map();

  for (const workspaceDir of WORKSPACE_DIRS) {
    const absDir = path.join(rootDir, workspaceDir);
    if (!existsSync(absDir)) continue;

    for (const entry of readdirSync(absDir, { withFileTypes: true })) {
      const packageJsonPath = path.join(absDir, entry.name, 'package.json');
      if (!entry.isDirectory() || !existsSync(packageJsonPath)) continue;

      const { name, dependencies = {}, devDependencies = {} } = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const deps = Object.entries({ ...dependencies, ...devDependencies })
        .filter(([, version]) => String(version).startsWith('workspace:'))
        .map(([depName]) => depName);

      packages.set(name, { dir: `${workspaceDir}/${entry.name}`, deps });
    }
  }

  return packages;
}

/**
 * 앱 빌드에 영향을 주는 경로 (루트 기준)
 */
function collectWatchPaths(packages, appDir, extraPaths) {
  const app = [...packages.values()].find(pkg => pkg.dir === appDir);
  if (!app) throw new Error(`workspace 패키지를 찾을 수 없음: ${appDir}`);

  const dirs = new Set();
  const visit = pkg => {
    if (dirs.has(pkg.dir)) return;
    dirs.add(pkg.dir);
    for (const depName of pkg.deps) {
      const dep = packages.get(depName);
      if (dep) visit(dep);
    }
  };
  visit(app);

  return [...dirs, ...ROOT_WATCH_PATHS, ...extraPaths];
}

function main() {
  const rootDir = git(process.cwd(), ['rev-parse', '--show-toplevel']);
  const appDir = path.relative(rootDir, process.cwd()).split(path.sep).join('/');
  const watchPaths = collectWatchPaths(readWorkspacePackages(rootDir), appDir, process.argv.slice(2));

  const base = process.env.VERCEL_GIT_PREVIOUS_SHA;
  const head = process.env.VERCEL_GIT_COMMIT_SHA || 'HEAD';

  console.log(`[vercel-ignore] ${appDir} 감시 경로: ${watchPaths.join(', ')}`);

  if (!base) {
    console.log('[vercel-ignore] 이전 성공 배포 없음 → 빌드');
    return BUILD;
  }

  try {
    git(rootDir, ['cat-file', '-e', `${base}^{commit}`]);
  } catch {
    console.log(`[vercel-ignore] 기준 커밋 ${base}이 clone에 없음 → 빌드`);
    return BUILD;
  }

  const changed = git(rootDir, ['diff', '--name-only', base, head, '--', ...watchPaths]);
  if (!changed) {
    console.log(`[vercel-ignore] ${base.slice(0, 7)}..${head.slice(0, 7)} 변경 없음 → 빌드 건너뜀`);
    return SKIP;
  }

  console.log(`[vercel-ignore] 변경 파일:\n${changed}\n→ 빌드`);
  return BUILD;
}

try {
  process.exit(main());
} catch (error) {
  console.log(`[vercel-ignore] 판단 실패 → 빌드: ${error instanceof Error ? error.message : error}`);
  process.exit(BUILD);
}
