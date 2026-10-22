/**
 * 预留 REST 路径（前后端分离时后端按此实现即可）。
 * 当前静态站不会请求这些地址，除非设置了 PUBLIC_API_BASE_URL。
 */
export const API_ENDPOINTS = {
  site: '/api/site',
  stats: '/api/stats',
  projects: '/api/projects',
  project: (id: string) => `/api/projects/${encodeURIComponent(id)}`,
  posts: '/api/posts',
  post: (slug: string) => `/api/posts/${encodeURIComponent(slug)}`,
  notes: '/api/notes',
  docs: '/api/docs',
  doc: (slug: string) => `/api/docs/${encodeURIComponent(slug)}`,
  shares: '/api/shares',
} as const;
