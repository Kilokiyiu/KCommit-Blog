import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLLECTIONS, ROOT, getCollection } from './lib/collections.mjs';
import { deleteEntry, getEntry, listEntries, saveEntry, uploadImage } from './lib/content.mjs';
import { parseMarkdownFile, toDateInput } from './lib/frontmatter.mjs';
import { getPublishStatus, publishContent } from './lib/publish.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITE_PUBLIC = path.join(ROOT, 'public');
const HOST = '127.0.0.1';
const PORT = Number(process.env.ADMIN_PORT || 4322);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  return JSON.parse(raw);
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendError(res, err, status = 400) {
  sendJson(res, status, { error: err instanceof Error ? err.message : String(err) });
}

async function serveStatic(req, res, urlPath) {
  let rel = urlPath === '/' ? '/index.html' : urlPath;
  rel = decodeURIComponent(rel.split('?')[0]);
  if (rel.includes('..')) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  const file = path.join(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
}

async function handleApi(req, res, pathname) {
  const parts = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);

  if (req.method === 'GET' && parts.length === 1 && parts[0] === 'meta') {
    sendJson(res, 200, {
      collections: Object.values(COLLECTIONS).map((c) => ({
        id: c.id,
        label: c.label,
        fields: c.fields,
        imageField: c.imageField ?? null,
      })),
    });
    return;
  }

  if (req.method === 'GET' && parts.length === 1 && parts[0] === 'publish-status') {
    try {
      sendJson(res, 200, await getPublishStatus());
    } catch (err) {
      sendError(res, err, 500);
    }
    return;
  }

  if (req.method === 'POST' && parts.length === 1 && parts[0] === 'publish') {
    try {
      const body = await readBody(req);
      sendJson(res, 200, await publishContent({ message: body?.message }));
    } catch (err) {
      sendError(res, err, 500);
    }
    return;
  }

  // Parse an uploaded .md without writing — fill the editor for the user.
  if (req.method === 'POST' && parts.length === 1 && parts[0] === 'parse-md') {
    try {
      const body = await readBody(req);
      const raw = String(body?.raw ?? '');
      if (!raw.trim()) throw new Error('空文件');
      const filename = String(body?.filename ?? '');
      const { data, body: mdBody } = parseMarkdownFile(raw);
      const frontmatter = { ...data };
      if ('date' in frontmatter) frontmatter.date = toDateInput(frontmatter.date);
      if (!('draft' in frontmatter)) frontmatter.draft = false;
      const base = filename.replace(/\.md$/i, '').trim();
      const slug = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$/.test(base) ? base : '';
      sendJson(res, 200, { slug, frontmatter, body: mdBody });
    } catch (err) {
      sendError(res, err);
    }
    return;
  }

  const collectionId = parts[0];
  if (!getCollection(collectionId)) {
    sendError(res, new Error('未知集合'), 404);
    return;
  }

  try {
    if (req.method === 'GET' && parts.length === 1) {
      sendJson(res, 200, await listEntries(collectionId));
      return;
    }

    if (req.method === 'GET' && parts.length === 2) {
      sendJson(res, 200, await getEntry(collectionId, parts[1]));
      return;
    }

    if (req.method === 'PUT' && parts.length === 2) {
      const body = await readBody(req);
      sendJson(res, 200, await saveEntry(collectionId, parts[1], body || {}));
      return;
    }

    if (req.method === 'DELETE' && parts.length === 2) {
      sendJson(res, 200, await deleteEntry(collectionId, parts[1]));
      return;
    }

    if (req.method === 'POST' && parts.length === 3 && parts[2] === 'image') {
      const body = await readBody(req);
      sendJson(res, 200, await uploadImage(collectionId, parts[1], body || {}));
      return;
    }

    sendError(res, new Error('未找到接口'), 404);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const notFound = msg.includes('ENOENT') || msg.includes('no such file');
    sendError(res, err, notFound ? 404 : 400);
  }
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || '';
  if (!host.startsWith('127.0.0.1') && !host.startsWith('localhost')) {
    res.writeHead(403).end('Admin is localhost-only');
    return;
  }

  const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  if (url.pathname.startsWith('/api/')) {
    await handleApi(req, res, url.pathname);
    return;
  }
  // Preview blog assets: /site-img/img/covers/foo.png → public/img/covers/foo.png
  if (url.pathname.startsWith('/site-img/')) {
    const rel = decodeURIComponent(url.pathname.slice('/site-img'.length));
    const file = path.normalize(path.join(SITE_PUBLIC, rel));
    if (!file.startsWith(SITE_PUBLIC) || rel.includes('..')) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    try {
      const data = await fs.readFile(file);
      const ext = path.extname(file);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404).end('Not found');
    }
    return;
  }
  await serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`KCommit Admin  http://${HOST}:${PORT}`);
  console.log('只监听本机。保存后可在页面里「发布上线」（git commit + push）。');
});
