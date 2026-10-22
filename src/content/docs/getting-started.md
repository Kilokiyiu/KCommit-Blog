---
title: 开始使用
description: 部署骨架与仓库文档入口。
date: 2026-10-22
tags: [入门]
---

完整说明在仓库文档（GitHub / 本地 `docs/`），不在本页展开。

| 文档 | 内容 |
|------|------|
| 根目录 `README.md` | 整体介绍、Cloudflare 快速部署 |
| `docs/CONTENT.md` | 内容目录、frontmatter、图片 |
| `docs/DEVELOPMENT.md` | 二次开发 |
| `docs/API.md` | 预留 REST 接口 |
| `docs/CHANGELOG.md` | 更新记录 |

本地：

```bash
npm install
npm run dev
npm run build
```

Cloudflare Pages：构建 `npm run build`，输出 `dist`。细节按 README「快速部署」逐步做。
