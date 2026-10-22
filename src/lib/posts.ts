import type { PostSummary } from './api/types';

/** 按共用 tags 推荐相关文章；没有 tag 时退回最新其它文 */
export function relatedPosts(current: PostSummary, all: PostSummary[], limit = 3): PostSummary[] {
  const others = all.filter((p) => p.id !== current.id);
  if (others.length === 0) return [];

  const tags = current.tags ?? [];
  if (tags.length === 0) return others.slice(0, limit);

  return others
    .map((post) => ({
      post,
      score: (post.tags ?? []).filter((t) => tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((x) => x.post);
}

export function collectTags(posts: PostSummary[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function tagPath(tag: string) {
  return `/tags/${encodeURIComponent(tag)}/`;
}
