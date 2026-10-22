# KCommit-Blog

基于 [Astro](https://astro.build) 的个人博客主题：首页、文章、说说、文档、分享、项目、友链星图。内容用本地 Markdown，站点文案集中在 `src/site.ts`。可部署到 Cloudflare Pages。

> 示例站点信息与文章均为占位内容。Fork 后先改 `src/site.ts` 和 `astro.config.mjs` 里的域名。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## 站点分区

| 路径 | 内容 |
|------|------|
| `/` | 首页总览 |
| `/posts/` | 文章列表与详情 |
| `/notes/` | 说说（短想法） |
| `/docs/` | 文档 |
| `/shares/` | 外链分享 |
| `/projects/` | 项目 |
| `/friends/` | 友链（十二星座星图） |
| `/about/` | 关于 |
| `/contact/` | 联系 |

## 自定义

### 站点信息

编辑 [`src/site.ts`](./src/site.ts)：名字、邮箱、关于文案、友链、播放列表、Giscus 等。

域名：[`astro.config.mjs`](./astro.config.mjs) 的 `site`，以及 [`public/robots.txt`](./public/robots.txt) 里的 Sitemap。

### 写内容

**文章**：`src/content/posts/your-slug.md`

```md
---
title: 标题
description: 一句话摘要
date: 2026-10-20
---

正文 Markdown。
```

**说说**：`src/content/notes/2026-10-20.md`

```md
---
date: 2026-10-20
---

一两句话就行。
```

**项目**：`src/content/projects/your-slug.md`（封面放 `public/img/projects/`）

```md
---
name: 项目名
url: https://example.com
blurb: 一句话简介
status: 进行中
tags: [标签]
image: /img/projects/your-slug.png
date: 2026-10-22
---

详情正文 Markdown。
```

可选：`draft: true` 不会出现在列表和静态路径里。

### 图片与音乐

- 头像：`public/img/avatar.png`
- 背景：改 `site.backgroundImage` / `backgroundImageMobile`
- 轮播四季墙：`public/img/bento/wall-{spring|summer|autumn|winter}.jpg`
- 音乐：文件放 `public/music/`，在 `site.playlist` 登记

仓库里带了 **3 首示例曲**，仅供本地体验播放器。公开发布请换成自有或已授权音频。

### 评论（Giscus）

默认关闭。到 [giscus.app](https://giscus.app) 生成配置，填入 `site.giscus` 并将 `enabled` 设为 `true`。

## 内容接口（预留）

页面统一走 `src/lib/api`：

- **默认**：本地 Markdown + `site.ts`
- **可选**：设置 `PUBLIC_API_BASE_URL` 后走 REST（契约见 [docs/API.md](./docs/API.md)）

复制 `.env.example` 为 `.env` 即可配置。

## Cloudflare Pages

| 项 | 值 |
|----|-----|
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node | 18+（建议 20/22） |

本地静态预览：`npm run build` 后执行 `npx wrangler pages dev dist`。

## 结构

```
src/
  content/posts/      # 文章
  content/projects/   # 项目
  content/notes/      # 说说
  pages/
  layouts/
  styles/
  site.ts             # 站点配置
public/img/           # 静态图片
public/music/         # 播放列表音频
docs/API.md           # 预留 REST 契约
```

## License

[MIT](./LICENSE) © Kilokiyiu
