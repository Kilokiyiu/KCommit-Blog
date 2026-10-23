import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');

/** @typedef {'posts' | 'notes' | 'docs' | 'shares' | 'projects'} CollectionId */

/** @type {Record<CollectionId, {
 *   id: CollectionId,
 *   label: string,
 *   dir: string,
 *   imageField?: 'cover' | 'image',
 *   imageDir?: string,
 *   fields: Array<{
 *     key: string,
 *     label: string,
 *     type: 'text' | 'textarea' | 'date' | 'tags' | 'boolean' | 'url',
 *     required?: boolean,
 *   }>,
 * }>} */
export const COLLECTIONS = {
  posts: {
    id: 'posts',
    label: '文章',
    dir: path.join(ROOT, 'src/content/posts'),
    imageField: 'cover',
    imageDir: path.join(ROOT, 'public/img/covers'),
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'description', label: '摘要', type: 'textarea', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'tags', label: '标签', type: 'tags' },
      { key: 'draft', label: '草稿', type: 'boolean' },
    ],
  },
  notes: {
    id: 'notes',
    label: '说说',
    dir: path.join(ROOT, 'src/content/notes'),
    fields: [
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'draft', label: '草稿', type: 'boolean' },
    ],
  },
  docs: {
    id: 'docs',
    label: '文档',
    dir: path.join(ROOT, 'src/content/docs'),
    imageField: 'cover',
    imageDir: path.join(ROOT, 'public/img/covers'),
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'description', label: '摘要', type: 'textarea', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'category', label: '分组', type: 'text' },
      { key: 'draft', label: '草稿', type: 'boolean' },
    ],
  },
  shares: {
    id: 'shares',
    label: '分享',
    dir: path.join(ROOT, 'src/content/shares'),
    imageField: 'image',
    imageDir: path.join(ROOT, 'public/img/shares'),
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'url', label: '链接', type: 'url', required: true },
      { key: 'description', label: '为什么转', type: 'textarea', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'source', label: '来源', type: 'text' },
      { key: 'draft', label: '草稿', type: 'boolean' },
    ],
  },
  projects: {
    id: 'projects',
    label: '项目',
    dir: path.join(ROOT, 'src/content/projects'),
    imageField: 'image',
    imageDir: path.join(ROOT, 'public/img/projects'),
    fields: [
      { key: 'name', label: '项目名', type: 'text', required: true },
      { key: 'url', label: '链接', type: 'text', required: true },
      { key: 'blurb', label: '简介', type: 'textarea', required: true },
      { key: 'status', label: '状态', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'tags', label: '标签', type: 'tags' },
      { key: 'draft', label: '草稿', type: 'boolean' },
    ],
  },
};

export function getCollection(id) {
  return COLLECTIONS[id] ?? null;
}

export function assertSafeSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('缺少 slug');
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$/.test(slug)) {
    throw new Error('slug 只能含字母数字、点、下划线、短横线');
  }
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error('非法 slug');
  }
  return slug;
}
