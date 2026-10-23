import fs from 'node:fs/promises';
import path from 'node:path';
import { assertSafeSlug, getCollection } from './collections.mjs';
import { parseMarkdownFile, stringifyMarkdownFile, toDateInput } from './frontmatter.mjs';

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function mdPath(col, slug) {
  return path.join(col.dir, `${slug}.md`);
}

export async function listEntries(collectionId) {
  const col = getCollection(collectionId);
  if (!col) throw new Error('未知集合');
  await ensureDir(col.dir);
  const names = await fs.readdir(col.dir);
  const items = [];
  for (const name of names) {
    if (!name.endsWith('.md')) continue;
    const slug = name.slice(0, -3);
    const raw = await fs.readFile(path.join(col.dir, name), 'utf8');
    const { data } = parseMarkdownFile(raw);
    items.push({
      slug,
      title: String(data.title ?? data.name ?? slug),
      date: toDateInput(data.date),
      draft: Boolean(data.draft),
      description: String(data.description ?? data.blurb ?? ''),
    });
  }
  items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.slug.localeCompare(b.slug));
  return items;
}

export async function getEntry(collectionId, slug) {
  const col = getCollection(collectionId);
  if (!col) throw new Error('未知集合');
  assertSafeSlug(slug);
  const file = mdPath(col, slug);
  const raw = await fs.readFile(file, 'utf8');
  const { data, body } = parseMarkdownFile(raw);
  /** @type {Record<string, unknown>} */
  const frontmatter = { ...data };
  if ('date' in frontmatter) frontmatter.date = toDateInput(frontmatter.date);
  if (!('draft' in frontmatter)) frontmatter.draft = false;
  if (!('tags' in frontmatter) && col.fields.some((f) => f.key === 'tags')) {
    frontmatter.tags = [];
  }
  return { slug, frontmatter, body };
}

/**
 * @param {string} collectionId
 * @param {string} slug
 * @param {{ frontmatter: Record<string, unknown>, body: string, newSlug?: string }} payload
 */
export async function saveEntry(collectionId, slug, payload) {
  const col = getCollection(collectionId);
  if (!col) throw new Error('未知集合');
  assertSafeSlug(slug);
  const nextSlug = payload.newSlug ? assertSafeSlug(payload.newSlug) : slug;
  await ensureDir(col.dir);

  /** @type {Record<string, unknown>} */
  const data = { ...payload.frontmatter };
  if (typeof data.tags === 'string') {
    data.tags = data.tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(data.tags) && col.fields.some((f) => f.key === 'tags')) {
    data.tags = [];
  }
  if ('date' in data) data.date = toDateInput(data.date) || toDateInput(new Date());
  data.draft = Boolean(data.draft);

  const fileContent = stringifyMarkdownFile(data, payload.body ?? '');
  const dest = mdPath(col, nextSlug);

  if (nextSlug !== slug) {
    const old = mdPath(col, slug);
    try {
      await fs.access(old);
      await fs.rename(old, dest);
    } catch {
      // create new
    }
  }

  await fs.writeFile(dest, fileContent, 'utf8');
  return { slug: nextSlug };
}

export async function deleteEntry(collectionId, slug) {
  const col = getCollection(collectionId);
  if (!col) throw new Error('未知集合');
  assertSafeSlug(slug);
  await fs.unlink(mdPath(col, slug));
  return { ok: true };
}

/**
 * @param {string} collectionId
 * @param {string} slug
 * @param {{ contentType: string, dataBase64: string }} file
 */
export async function uploadImage(collectionId, slug, file) {
  const col = getCollection(collectionId);
  if (!col) throw new Error('未知集合');
  if (!col.imageField || !col.imageDir) throw new Error('该集合不支持配图上传');
  assertSafeSlug(slug);

  const type = (file.contentType || '').toLowerCase();
  let ext = '.png';
  if (type.includes('jpeg') || type.includes('jpg')) ext = '.jpg';
  else if (type.includes('webp')) ext = '.webp';
  else if (type.includes('gif')) ext = '.gif';
  else if (type.includes('png')) ext = '.png';

  await ensureDir(col.imageDir);
  const filename = `${slug}${ext}`;
  const abs = path.join(col.imageDir, filename);
  const buf = Buffer.from(file.dataBase64, 'base64');
  if (buf.length > 8 * 1024 * 1024) throw new Error('图片不能超过 8MB');
  await fs.writeFile(abs, buf);

  const publicPath =
    col.imageField === 'cover'
      ? `/img/covers/${filename}`
      : collectionId === 'shares'
        ? `/img/shares/${filename}`
        : `/img/projects/${filename}`;

  // Patch frontmatter image field if md exists
  try {
    const entry = await getEntry(collectionId, slug);
    entry.frontmatter[col.imageField] = publicPath;
    await saveEntry(collectionId, slug, {
      frontmatter: entry.frontmatter,
      body: entry.body,
    });
  } catch {
    // md may not exist yet; caller can set path after create
  }

  return { path: publicPath, field: col.imageField };
}
