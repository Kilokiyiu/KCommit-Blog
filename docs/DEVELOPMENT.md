# 🛠️ 二次开发说明

在主题上改布局、加页面、接后端时看本文。只改文案 / Markdown 请先看 [CONTENT.md](./CONTENT.md)。

---

## 1. 开发环境

```bash
npm install
npm run dev       # 开发前台  http://localhost:4321
npm run admin     # 本机写稿后台 http://127.0.0.1:4322
npm run build     # 静态构建 → dist/
npm run preview   # 预览构建结果
```

可选：`npx wrangler pages dev dist` 模拟 Cloudflare Pages。  
Windows 也可双击 `admin/Start.bat` 启动管理端。

**本仓库当前 = 静态前端 + 本机管理端**：Astro 5 · Markdown（`marked`）· `@astrojs/rss` / `@astrojs/sitemap` · `admin/`（Node 读写本地文件）。  
（`.ts` / `.astro` 是前端工程语言，**不是**后端技术选型。）

**近期前端**：评论上线（Giscus）；管理端已可本机写文 / 推送。见 [ROADMAP.md](./ROADMAP.md)。  

**后端（后置）**：评论与体验就绪后，在本仓库新增 C# / ASP.NET Core（如 `backend/`），按 [API.md](./API.md) 提供 REST；前端再配 `PUBLIC_API_BASE_URL`。管理端届时再从「改本地文件」迁到写 API。

---

## 2. 目录职责

| 路径 | 职责 | 二次开发时 |
|:--|:--|:--|
| `src/pages/` | 文件系统路由 | 加页面 = 加 `.astro` 文件 |
| `src/layouts/` | 壳子（导航、SEO、播放器） | 改全站框架 |
| `src/components/` | UI 块（轮播、友链星空、Giscus…） | 抽改局部交互 |
| `src/styles/global.css` | 全局样式与变量 | 换肤、调色 |
| `src/site.ts` | 站点配置数据 | 尽量别塞业务逻辑 |
| `src/content.config.ts` | Collection schema | 加字段要同步改 schema |
| `src/lib/api/` | 统一取数 | 接远程时改这里与契约 |
| `src/lib/*.ts` | 工具（markdown、日期、星座…） | 纯函数优先 |
| `admin/` | 本机 CMS（Node + 静态 UI） | 只监听 127.0.0.1；勿部署到公网 |
| `public/` | 原样拷贝的静态文件 | 大图、字体、音乐 |
| `astro.config.mjs` | `site`、集成插件 | 加集成、改站点 URL |
| `docs/` | 仓库文档 | 与站内 `src/content/docs` 无关 |

站内「文档」频道（`/docs/`）读的是 `src/content/docs/*.md`，不是本目录。

---

## 3. 常见改法

### 换皮肤 / 排版

1. 看 `src/styles/global.css` 里的 CSS 变量与布局类  
2. 大结构在 `src/layouts/BaseLayout.astro`、`src/pages/index.astro`  
3. 尽量保持 class 语义，避免只在单个页面堆魔法数

### 加一个新栏目

1. （可选）在 `src/content.config.ts` 增加 collection + schema  
2. `src/content/<name>/` 放 Markdown  
3. `src/pages/<name>/` 写列表页与 `[slug].astro`  
4. `src/lib/api` 增加 list/get（local + remote 成对）  
5. `src/site.ts` 的 `nav` 加一项  

### 改首页模块

- 轮播：`site.bento` + `BentoCarousel.astro`  
- 播放器：`site.playlist` + `MusicPlayer.astro`  
- 个人卡：`site.profile*` + `index.astro` 对应区块  

### 评论

`site.giscus`：到 [giscus.app](https://giscus.app) 生成配置 → 填字段 → `enabled: true`。组件：`src/components/Giscus.astro`。

---

## 4. 数据层约定（重要）

页面**不要**直接 `getCollection` 散落各处新逻辑时，优先走：

```ts
import { listPosts, getSite } from '../lib/api';
```

| 文件 | 作用 |
|:--|:--|
| `lib/api/index.ts` | 按环境切换 local / remote |
| `lib/api/local.ts` | 读 Content Collections + `site.ts` |
| `lib/api/remote.ts` | `fetch` 预留实现 |
| `lib/api/types.ts` | 类型契约 |
| `lib/api/endpoints.ts` | 路径常量 |
| `lib/api/config.ts` | `PUBLIC_API_BASE_URL` |

远程契约见 [API.md](./API.md)。在本仓用 **ASP.NET Core（C#）** 实现契约 → 部署 API（可与 Pages 分开托管）→ 前端配 `PUBLIC_API_BASE_URL` → 尽量少改页面。

---

## 5. 扩展 checklist

- [ ] 新 frontmatter 字段已写入 `content.config.ts` schema  
- [ ] 本地 list/get 与类型已更新  
- [ ] 若支持远程：remote + `docs/API.md` 同步  
- [ ] `nav` / 链接 / sitemap 过滤是否需要调整  
- [ ] `npm run build` 通过  

---

## 6. 注意

- **静态优先**：构建期拿数据；浏览器里默认没有「动态 CMS」  
- **域名**：改自定义域后同步 `astro.config.mjs`、`robots.txt`、`site.friends.self`  
- **版权**：示例音乐勿直接用于公开商用站  
- **隐私**：开源仓库勿提交真实 QQ、未授权照片、`.env` 密钥  
- **许可**：再分发须保持 [LICENSE](../LICENSE)（**禁止商用**）；商用需另获授权  
- **与现站分离**：若另有线上个人站仓库，模板与现站内容分开维护  

PR / 改动建议附：动机、影响页面、是否改 API 契约。
