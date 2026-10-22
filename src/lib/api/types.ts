/** 与未来后端 JSON 对齐的内容类型（预留契约） */

export interface SiteConfig {
  name: string;
  githubUser: string;
  email: string;
  tagline: string;
  description: string;
  avatar: string;
  favicon: string;
  backgroundImage: string;
  backgroundImageMobile: string;
  about: {
    headline: string;
    paragraphs: string[];
  };
  contact: {
    intro: string;
    qq?: string;
    wechatNote: string;
  };
}

export interface Project {
  /** 路由用，来自文件名，如 demo-app → /projects/demo-app/ */
  id: string;
  name: string;
  /** 正式站点；介绍页里再给外链，列表不直接跳 */
  url: string;
  blurb: string;
  /** 介绍页正文（Markdown，来自 md 正文） */
  body: string;
  status: string;
  tags: string[];
  image?: string;
}

export interface PostSummary {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 */
  date: string;
  cover?: string;
  tags?: string[];
  draft?: boolean;
}

export interface PostDetail extends PostSummary {
  /** Markdown 正文 */
  markdown: string;
}

export interface NoteItem {
  id: string;
  /** ISO 8601 */
  date: string;
  /** Markdown 正文 */
  markdown: string;
  draft?: boolean;
}

export interface DocSummary {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 */
  date: string;
  category?: string;
  cover?: string;
  draft?: boolean;
}

export interface DocDetail extends DocSummary {
  /** Markdown 正文 */
  markdown: string;
}

export interface ShareItem {
  id: string;
  title: string;
  url: string;
  description: string;
  /** ISO 8601 */
  date: string;
  source?: string;
  image?: string;
  /** 可选补充说明（Markdown） */
  markdown?: string;
  draft?: boolean;
}

export interface SiteStats {
  posts: number;
  notes: number;
  docs: number;
  shares: number;
  projects: number;
}
