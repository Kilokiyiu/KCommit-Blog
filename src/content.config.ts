import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** 卡片封面：/img/covers/{slug}.png，与 md 文件名一致 */
    cover: z.string().optional(),
    /** 标签，用于归档与相关文章 */
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** 分组，如「本站」「前端」 */
    category: z.string().optional(),
    /** 文档封面，放 public/img/covers/ */
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** 看到别人写得好的东西，转一截链接过来 */
const shares = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shares' }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    /** 你为什么转：一两句就行 */
    description: z.string(),
    date: z.coerce.date(),
    /** 来源站点或作者，可选 */
    source: z.string().optional(),
    /** 卡片图，放 public/img/shares/ */
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** 个人项目：文件名 = 路由 slug，如 demo-app.md → /projects/demo-app/ */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    /** 正式站点；可为外链或本站路径如 / */
    url: z.string(),
    blurb: z.string(),
    status: z.string(),
    tags: z.array(z.string()).default([]),
    /** 卡片图：public/img/projects/{slug}.png */
    image: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, notes, docs, shares, projects };
