import { getCollection, getEntry } from 'astro:content';
import { site } from '../../site';
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

function toIso(date: Date) {
  return date.toISOString();
}

export async function getSiteLocal(): Promise<SiteConfig> {
  return {
    name: site.name,
    githubUser: site.githubUser,
    email: site.email,
    tagline: site.tagline,
    description: site.description,
    avatar: site.avatar,
    favicon: site.favicon,
    backgroundImage: site.backgroundImage,
    backgroundImageMobile: site.backgroundImageMobile,
    about: site.about,
    contact: site.contact,
  };
}

export async function getProjectsLocal(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((project) => ({
      id: project.id,
      name: project.data.name,
      url: project.data.url,
      blurb: project.data.blurb,
      status: project.data.status,
      tags: project.data.tags,
      image: project.data.image,
      body: typeof project.body === 'string' ? project.body : '',
    }));
}

export async function getProjectLocal(id: string): Promise<Project | null> {
  const entry = await getEntry('projects', id);
  if (!entry || entry.data.draft) return null;
  return {
    id: entry.id,
    name: entry.data.name,
    url: entry.data.url,
    blurb: entry.data.blurb,
    status: entry.data.status,
    tags: entry.data.tags,
    image: entry.data.image,
    body: typeof entry.body === 'string' ? entry.body : '',
  };
}

export async function listPostsLocal(): Promise<PostSummary[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      date: toIso(post.data.date),
      cover: post.data.cover,
      tags: post.data.tags,
      draft: post.data.draft,
    }));
}

export async function getPostLocal(slug: string): Promise<PostDetail | null> {
  const entry = await getEntry('posts', slug);
  if (!entry || entry.data.draft) return null;
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    date: toIso(entry.data.date),
    cover: entry.data.cover,
    tags: entry.data.tags,
    draft: entry.data.draft,
    markdown: typeof entry.body === 'string' ? entry.body : '',
  };
}

export async function listNotesLocal(): Promise<NoteItem[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return notes
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((note) => ({
      id: note.id,
      date: toIso(note.data.date),
      draft: note.data.draft,
      markdown: typeof note.body === 'string' ? note.body : '',
    }));
}

export async function listDocsLocal(): Promise<DocSummary[]> {
  const docs = await getCollection('docs', ({ data }) => !data.draft);
  return docs
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((doc) => ({
      id: doc.id,
      title: doc.data.title,
      description: doc.data.description,
      date: toIso(doc.data.date),
      category: doc.data.category,
      cover: doc.data.cover,
      draft: doc.data.draft,
    }));
}

export async function getDocLocal(slug: string): Promise<DocDetail | null> {
  const entry = await getEntry('docs', slug);
  if (!entry || entry.data.draft) return null;
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    date: toIso(entry.data.date),
    category: entry.data.category,
    cover: entry.data.cover,
    draft: entry.data.draft,
    markdown: typeof entry.body === 'string' ? entry.body : '',
  };
}

export async function listSharesLocal(): Promise<ShareItem[]> {
  const shares = await getCollection('shares', ({ data }) => !data.draft);
  return shares
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((share) => ({
      id: share.id,
      title: share.data.title,
      url: share.data.url,
      description: share.data.description,
      date: toIso(share.data.date),
      source: share.data.source,
      image: share.data.image,
      draft: share.data.draft,
      markdown: typeof share.body === 'string' ? share.body : '',
    }));
}

export async function getStatsLocal(): Promise<SiteStats> {
  const [posts, notes, docs, shares, projects] = await Promise.all([
    listPostsLocal(),
    listNotesLocal(),
    listDocsLocal(),
    listSharesLocal(),
    getProjectsLocal(),
  ]);
  return {
    posts: posts.length,
    notes: notes.length,
    docs: docs.length,
    shares: shares.length,
    projects: projects.length,
  };
}
