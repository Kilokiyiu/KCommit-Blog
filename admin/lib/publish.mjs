import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { ROOT } from './collections.mjs';

const execFileAsync = promisify(execFile);

/** Only content + related images — not secrets, not random project files. */
const ALLOWED_PREFIXES = [
  'src/content/',
  'public/img/covers/',
  'public/img/shares/',
  'public/img/projects/',
];

function normalizeRepoPath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function isAllowedPath(repoPath) {
  const p = normalizeRepoPath(repoPath);
  if (p.includes('..') || p.startsWith('.env') || p.includes('/.env')) return false;
  return ALLOWED_PREFIXES.some((prefix) => p === prefix.slice(0, -1) || p.startsWith(prefix));
}

async function git(args, opts = {}) {
  try {
    const { stdout, stderr } = await execFileAsync('git', args, {
      cwd: ROOT,
      windowsHide: true,
      maxBuffer: 4 * 1024 * 1024,
      ...opts,
    });
    return { stdout: stdout || '', stderr: stderr || '' };
  } catch (err) {
    const msg = [err.stderr, err.stdout, err.message].filter(Boolean).join('\n').trim();
    throw new Error(msg || 'git 命令失败');
  }
}

function parsePorcelain(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  /** @type {{ status: string, path: string }[]} */
  const files = [];
  for (const line of lines) {
    // XY PATH or XY ORIG -> PATH for renames
    const status = line.slice(0, 2);
    let filePath = line.slice(3);
    if (filePath.includes(' -> ')) {
      filePath = filePath.split(' -> ').pop();
    }
    // quoted paths
    if (filePath.startsWith('"') && filePath.endsWith('"')) {
      filePath = JSON.parse(filePath);
    }
    files.push({ status: status.trim(), path: normalizeRepoPath(filePath) });
  }
  return files;
}

export async function getPublishStatus() {
  const { stdout: branchOut } = await git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const branch = branchOut.trim();

  let ahead = 0;
  let behind = 0;
  try {
    const { stdout } = await git(['rev-list', '--left-right', '--count', `@{upstream}...HEAD`]);
    const [b, a] = stdout.trim().split(/\s+/).map(Number);
    behind = b || 0;
    ahead = a || 0;
  } catch {
    // no upstream
  }

  const { stdout: porcelain } = await git(['status', '--porcelain']);
  const all = parsePorcelain(porcelain);
  const publishable = all.filter((f) => isAllowedPath(f.path));
  const other = all.filter((f) => !isAllowedPath(f.path));

  return {
    branch,
    ahead,
    behind,
    publishable,
    otherCount: other.length,
    canPublish: publishable.length > 0 || ahead > 0,
  };
}

/**
 * Stage allowed content changes, commit if needed, then push.
 * @param {{ message?: string }} opts
 */
export async function publishContent(opts = {}) {
  const status = await getPublishStatus();
  const toStage = status.publishable.map((f) => f.path);

  if (toStage.length === 0 && status.ahead === 0) {
    throw new Error('没有可发布的内容改动（也没有未推送的提交）');
  }

  if (toStage.length > 0) {
    const message = String(opts.message || '').trim();
    if (!message) throw new Error('请填写提交说明');

    // git add each path (handles new + modified + deleted if we use update)
    for (const p of toStage) {
      await git(['add', '-A', '--', p]);
    }

    const tmp = path.join(os.tmpdir(), `kcommit-admin-commit-${Date.now()}.txt`);
    await fs.writeFile(tmp, `${message}\n`, 'utf8');
    try {
      await git(['commit', '-F', tmp]);
    } finally {
      await fs.unlink(tmp).catch(() => {});
    }
  }

  const { stdout: pushOut, stderr: pushErr } = await git(['push']);
  const log = [pushOut, pushErr].filter(Boolean).join('\n').trim();

  return {
    ok: true,
    committed: toStage.length > 0,
    staged: toStage,
    pushLog: log,
    hint: 'Cloudflare Pages 收到推送后会自动构建，稍等一两分钟看线上。',
  };
}
