/**
 * 预留 REST 契约（静态站暂不调用；接后端时按此路径实现即可）
 *
 * Base: PUBLIC_API_BASE_URL，例如 https://api.example.com
 */
export const API_ROUTES = {
  site: '/api/site',
  projects: '/api/projects',
  posts: '/api/posts',
  post: (slug: string) => `/api/posts/${encodeURIComponent(slug)}`,
  notes: '/api/notes',
  note: (id: string) => `/api/notes/${encodeURIComponent(id)}`,
  docs: '/api/docs',
  doc: (slug: string) => `/api/docs/${encodeURIComponent(slug)}`,
  shares: '/api/shares',
} as const;

/**
 * 约定响应示例（供后端对齐，不在运行时使用）
 *
 * GET /api/site        → SiteConfig
 * GET /api/projects    → Project[]
 * GET /api/posts       → PostSummary[]   (?includeDrafts=1)
 * GET /api/posts/:slug → PostDetail
 * GET /api/notes       → NoteItem[]
 * GET /api/notes/:id   → NoteItem
 * GET /api/docs        → DocSummary[]
 * GET /api/docs/:slug  → DocDetail
 * GET /api/shares      → ShareItem[]
 */
export const API_CONTRACT_VERSION = 1;
