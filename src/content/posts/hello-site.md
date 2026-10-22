---
title: 欢迎使用 KCommit-Blog
description: 这是一篇示例文章，说明如何写内容、改站点配置。
date: 2026-10-22
cover: /img/covers/default.png
tags: [本站, 入门]
---

这是 **KCommit-Blog** 的示例文章。Fork 或克隆后，把这篇删掉或改成你自己的第一篇即可。

## 改站点信息

打开 `src/site.ts`，改名字、邮箱、关于文案、友链、播放列表等。域名在 `astro.config.mjs` 的 `site` 字段。

## 写内容

| 类型 | 目录 |
|------|------|
| 文章 | `src/content/posts/` |
| 说说 | `src/content/notes/` |
| 文档 | `src/content/docs/` |
| 分享 | `src/content/shares/` |
| 项目 | `src/content/projects/` |

文章 frontmatter 最少需要 `title`、`description`、`date`。可选 `cover`、`tags`、`draft: true`。

## 本地预览

```bash
npm install
npm run dev
```

构建：`npm run build`，输出在 `dist/`。

## 评论

Giscus 默认关闭。到 [giscus.app](https://giscus.app) 生成配置后，填进 `site.ts` 的 `giscus` 并把 `enabled` 设为 `true`。
