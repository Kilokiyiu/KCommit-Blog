import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { listPosts, getSite } from '../lib/api';

export async function GET(context: APIContext) {
  const site = await getSite();
  const posts = await listPosts();

  return rss({
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: new Date(post.date),
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}
