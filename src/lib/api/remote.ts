import { getApiBaseUrl } from './config';
import { API_ENDPOINTS } from './endpoints';
import type {
  DocDetail,
  DocSummary,
  NoteItem,
  PostDetail,
  PostSummary,
  Project,
  ShareItem,
  SiteConfig,
  SiteStats,
} from './types';

async function getJson<T>(path: string): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('PUBLIC_API_BASE_URL is not set');
  }

  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** 远程实现：对接预留接口。后端就绪并配置 PUBLIC_API_BASE_URL 后生效。 */
export async function getSiteRemote(): Promise<SiteConfig> {
  return getJson(API_ENDPOINTS.site);
}

export async function getProjectsRemote(): Promise<Project[]> {
  return getJson(API_ENDPOINTS.projects);
}

export async function getProjectRemote(id: string): Promise<Project | null> {
  const base = getApiBaseUrl();
  if (!base) throw new Error('PUBLIC_API_BASE_URL is not set');

  const res = await fetch(`${base}${API_ENDPOINTS.project(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API project failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<Project>;
}

export async function listPostsRemote(): Promise<PostSummary[]> {
  return getJson(API_ENDPOINTS.posts);
}

export async function getPostRemote(slug: string): Promise<PostDetail | null> {
  const base = getApiBaseUrl();
  if (!base) throw new Error('PUBLIC_API_BASE_URL is not set');

  const res = await fetch(`${base}${API_ENDPOINTS.post(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API post failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<PostDetail>;
}

export async function listNotesRemote(): Promise<NoteItem[]> {
  return getJson(API_ENDPOINTS.notes);
}

export async function listDocsRemote(): Promise<DocSummary[]> {
  return getJson(API_ENDPOINTS.docs);
}

export async function getDocRemote(slug: string): Promise<DocDetail | null> {
  const base = getApiBaseUrl();
  if (!base) throw new Error('PUBLIC_API_BASE_URL is not set');

  const res = await fetch(`${base}${API_ENDPOINTS.doc(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API doc failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<DocDetail>;
}

export async function listSharesRemote(): Promise<ShareItem[]> {
  return getJson(API_ENDPOINTS.shares);
}

export async function getStatsRemote(): Promise<SiteStats> {
  return getJson(API_ENDPOINTS.stats);
}
