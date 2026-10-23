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

**文档 `docs`**

```md
---
title: 标题
description: 一句话摘要
date: 2026-10-20
category: 本站            # 可选
cover: /img/covers/your-slug.png  # 可选
draft: false              # 可选
---

正文里插图请用站点根路径，例如：

![步骤截图](/img/docs/your-slug/step-1.png)
```

---

## 4. 图片与静态资源

### 4.1 为什么推上去图片不显示？

本站是 **Astro 静态站**：浏览器只能请求到 `public/` 下的文件。  
Markdown 写在 `src/content/**`，**不会**把旁边的图片自动拷到线上。

| 错误做法 | 结果 |
|:--|:--|
| 图和 `.md` 放一起，写 `![](./shot.png)` | 本地编辑器可能能预览，线上 404 |
| 写 Windows 绝对路径 / `file:///...` | 只有你电脑能打开 |
| 只 `git add` 了 `.md`，忘了加 `public/img/...` | 仓库里有文、无线上图 |
| 用管理端「发布」但图不在白名单目录 | 文推上去了、图没进提交（见 §6） |

### 4.2 正确写法（正文插图）

1. 把图片放到 `public/` 下，例如：  
   `public/img/docs/getting-started/arch.png`
2. 在 Markdown **正文**里用**以站点根开头**的路径（注意前导 `/`）：

```md
![架构示意](/img/docs/getting-started/arch.png)
```

对应关系永远是：

```text
Markdown 里的 /img/...     →     磁盘上的 public/img/...
```

文档 / 文章建议按 slug 分子目录，避免文件名撞车：

| 内容类型 | 建议目录 |
|:--|:--|
| 文档正文图 | `public/img/docs/{slug}/` |
| 文章正文图 | `public/img/posts/{slug}/` |
| 说说附图 | `public/img/notes/`（可选） |

### 4.3 Frontmatter / 站点配置用图

文件仍放 `public/`，路径以 `/` 开头写在 frontmatter 或 `site.ts`。

| 用途 | 建议路径 |
|:--|:--|
| 头像 | `/img/avatar.png` → `public/img/avatar.png` |
| Favicon | `/favicon.png` |
| 背景 | `site.backgroundImage` / `backgroundImageMobile` |
| 默认封面 | `/img/covers/default.png` |
| 文章封面 | `/img/covers/{slug}.png` |
| 文档封面 | `/img/covers/{slug}.png`（与文章共用 covers） |
| 项目图 | `/img/projects/{slug}.png` |
| 分享图 | `/img/shares/…` |
| 首页轮播 | `/img/bento/…`（四季墙等） |
| 友链星座 | `/img/friends/zodiac*`（主题素材，一般不动） |
| 音乐 | `/music/xxx.mp3` + `site.playlist` |

命名建议 kebab-case（尽量别用空格）；缺文件会破图，先放占位再精修。

### 4.4 自检清单

推送前本地执行 `npm run build`，打开 `npm run preview`，点进带图的页面看是否裂图。  
或直接打开 `https://你的域名/img/docs/...`，能打开说明文件已在 `public` 且已部署。

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

## 6. 本机管理端（写文 / 发布）

不必手改 Markdown 时，可用本地管理端：

```bash
npm run admin
```

Windows 推荐双击仓库里的 **`admin/Start.bat`**（自动打开浏览器；关掉黑窗口即停止）。

打开 http://127.0.0.1:4322 （**仅本机**）：

| 能力 | 说明 |
|:--|:--|
| 列表 / 编辑 / 删除 | posts · notes · docs · shares · projects |
| 导入 Markdown | 选本地 `.md`，自动填正文与 frontmatter，再改配置后保存 |
| 配图上传 | 当前按钮主要写入 `public/img/covers|shares|projects/`，并回填封面字段 |
| 发布上线 | 默认提交 `src/content/**` 以及 `public/img/covers|shares|projects/**` |

注意：

- 保存只写本地磁盘；线上要变必须「提交并推送」（或你自己 `git push`）
- **正文插图**若放在 `public/img/docs/`、`public/img/posts/` 等目录：管理端一键发布**可能不会自动带上**；请用终端自行加入后推送，例如：  
  `git add src/content public/img && git commit -m "…" && git push`
- 发布不会带上 `.env` 等敏感文件
- 本机需已配置好 Git 远程与推送凭据（与平时 `git push` 相同）
- `site.ts`（关于 / 友链 / 歌单等）仍建议手改；管理端暂不覆盖

---

## 7. 示例内容

仓库自带欢迎帖、示例项目等，仅作结构参考。上线前请删除、改写或设 `draft: true`。

文章卡片与详情页日期旁会显示**距今相对时间**（昨天 / 3 天前…），由浏览器按当前时间刷新。

更多部署步骤见根目录 [README](../README.md)；改代码见 [DEVELOPMENT.md](./DEVELOPMENT.md)。
