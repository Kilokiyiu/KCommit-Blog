import { useRemoteApi } from './config';
import {
  getDocLocal,
  getPostLocal,
  getProjectLocal,
  getProjectsLocal,
  getSiteLocal,
  getStatsLocal,
  listDocsLocal,
  listNotesLocal,
  listPostsLocal,
  listSharesLocal,
} from './local';
import {
  getDocRemote,
  getPostRemote,
  getProjectRemote,
  getProjectsRemote,
  getSiteRemote,
  getStatsRemote,
  listDocsRemote,
  listNotesRemote,
  listPostsRemote,
  listSharesRemote,
} from './remote';
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

export type {
  DocDetail,
  DocSummary,
  NoteItem,
  PostDetail,
  PostSummary,
  Project,
  ShareItem,
  SiteConfig,
  SiteStats,
};
export { API_ENDPOINTS } from './endpoints';
export { getApiBaseUrl, useRemoteApi } from './config';

/**
 * 统一内容入口。
 * - 默认：本地 Markdown 内容集 + site.ts（静态站）
 * - 设置 PUBLIC_API_BASE_URL 后：改走预留 REST 接口
 */
export async function getSite(): Promise<SiteConfig> {
  return useRemoteApi() ? getSiteRemote() : getSiteLocal();
}

export async function getProjects(): Promise<Project[]> {
  return useRemoteApi() ? getProjectsRemote() : getProjectsLocal();
}

export async function getProject(id: string): Promise<Project | null> {
  return useRemoteApi() ? getProjectRemote(id) : getProjectLocal(id);
}

export async function listPosts(): Promise<PostSummary[]> {
  return useRemoteApi() ? listPostsRemote() : listPostsLocal();
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  return useRemoteApi() ? getPostRemote(slug) : getPostLocal(slug);
}

export async function listNotes(): Promise<NoteItem[]> {
  return useRemoteApi() ? listNotesRemote() : listNotesLocal();
}

export async function listDocs(): Promise<DocSummary[]> {
  return useRemoteApi() ? listDocsRemote() : listDocsLocal();
}

export async function getDoc(slug: string): Promise<DocDetail | null> {
  return useRemoteApi() ? getDocRemote(slug) : getDocLocal(slug);
}

export async function listShares(): Promise<ShareItem[]> {
  return useRemoteApi() ? listSharesRemote() : listSharesLocal();
}

export async function getStats(): Promise<SiteStats> {
  return useRemoteApi() ? getStatsRemote() : getStatsLocal();
}
