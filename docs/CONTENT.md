# 📌 重要内容说明

日常改站优先看本文：内容放哪、字段怎么写、图放哪、配置改哪。

---

## 1. 两处「内容源」

| 类型 | 位置 | 改什么 |
|:--|:--|:--|
| 站点身份与全局文案 | `src/site.ts` | 名字、邮箱、关于、友链、歌单、Giscus、默认图路径 |
| 正文与列表数据 | `src/content/**/*.md` | 文章 / 说说 / 文档 / 分享 / 项目 |

页面通过 `src/lib/api` 读取；**默认读本地**，一般不用改代码。

---

## 2. 内容目录

| 集合 | 目录 | 路由 | 说明 |
|:--|:--|:--|:--|
| posts | `src/content/posts/` | `/posts/{slug}/` | 长文；文件名 = slug |
| notes | `src/content/notes/` | `/notes/` | 短想法，常按日期命名 |
| docs | `src/content/docs/` | `/docs/{slug}/` | 说明类文档 |
| shares | `src/content/shares/` | `/shares/` | 外链卡片，需合法 `url` |
| projects | `src/content/projects/` | `/projects/{slug}/` | 个人项目 |

- `draft: true` → 不进列表、不生成详情路径  
- Schema 定义在 `src/content.config.ts`（用 Zod 校验 frontmatter）

---

## 3. Frontmatter 骨架

**文章 `posts`**

```md
---
title: 标题
description: 一句话摘要
date: 2026-10-20
cover: /img/covers/your-slug.png   # 可选
tags: [标签]                        # 可选
draft: false                        # 可选
---
```

**说说 `notes`**

```md
---
date: 2026-10-20
---
一两句话。
```

**项目 `projects`**

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
```

**分享 `shares`**

```md
---
title: 标题
url: https://example.com/article
description: 为什么转
date: 2026-10-21
source: 来源名          # 可选
image: /img/shares/….png # 可选
---
```

---

## 4. 图片与静态资源

文件放 `public/`，路径以 `/` 开头写在 frontmatter 或 `site.ts`。

| 用途 | 建议路径 |
|:--|:--|
| 头像 | `/img/avatar.png` → `public/img/avatar.png` |
| Favicon | `/favicon.png` |
| 背景 | `site.backgroundImage` / `backgroundImageMobile` |
| 默认封面 | `/img/covers/default.png` |
| 文章封面 | `/img/covers/{slug}.png` |
| 项目图 | `/img/projects/{slug}.png` |
| 分享图 | `/img/shares/…` |
| 首页轮播 | `/img/bento/…`（四季墙等） |
| 友链星座 | `/img/friends/zodiac*`（主题素材，一般不动） |
| 音乐 | `/music/xxx.mp3` + `site.playlist` |

命名建议 kebab-case；缺文件会破图，先放占位再精修。

---

## 5. `site.ts` 里常改的块

| 字段块 | 用途 |
|:--|:--|
| `name` / `email` / `githubUser` | 对外身份 |
| `tagline` / `profileBio` / `about` | 首页与关于页文案 |
| `avatar` / `covers` / `bento` | 图片路径 |
| `friends` | 友链星图数据 |
| `playlist` | 首页播放器 |
| `giscus` | 评论（默认 `enabled: false`） |
| `contact.qq` | 可选；空字符串则联系页不显示 QQ |

域名相关另改：`astro.config.mjs` 的 `site`、`public/robots.txt`。

---

## 6. 示例内容

仓库自带欢迎帖、示例项目等，仅作结构参考。上线前请删除、改写或设 `draft: true`。

更多部署步骤见根目录 [README](../README.md)；改代码见 [DEVELOPMENT.md](./DEVELOPMENT.md)。
