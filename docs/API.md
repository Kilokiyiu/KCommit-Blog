# 🔌 内容 API 契约（C# 后端用）

> **当前**：Cloudflare Pages 静态站，不依赖本文 REST。  
> **顺序**：先完成静态**管理页**与**评论**，再在本仓库用 **C# / ASP.NET Core** 实现下列接口。  
> 日常改内容见 [CONTENT.md](./CONTENT.md)；计划见 [ROADMAP.md](./ROADMAP.md)；改前端见 [DEVELOPMENT.md](./DEVELOPMENT.md)。

默认**纯静态**：数据来自 `src/content/**` 与 `src/site.ts`。页面统一走 `src/lib/api`。  
后端就绪后，实现下列契约并设置：

```bash
PUBLIC_API_BASE_URL=https://your-api.example.com
```

构建 / 运行时会改为请求远程（生成页面时 fetch），无需重写 Astro 页面。

## 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/site` | 站点信息（关于、联系、头像等） |
| GET | `/api/stats` | `{ posts, notes, projects }` 数量 |
| GET | `/api/projects` | 项目列表 |
| GET | `/api/projects/:id` | 单个项目（含介绍正文 `body`） |
| GET | `/api/posts` | 文章摘要列表（不含正文） |
| GET | `/api/posts/:slug` | 单篇文章（含 `markdown` 正文） |
| GET | `/api/notes` | 说说列表（含 `markdown`） |
| GET | `/api/docs` | 技术文档摘要列表 |
| GET | `/api/docs/:slug` | 单篇技术文档（含 `markdown`） |
| GET | `/api/shares` | 外链分享列表 |

路径常量见 `src/lib/api/endpoints.ts`，类型见 `src/lib/api/types.ts`。

## 响应示例

### `GET /api/posts`

```json
[
  {
    "id": "hello-site",
    "title": "欢迎使用 KCommit-Blog",
    "description": "……",
    "date": "2026-10-22T00:00:00.000Z",
    "draft": false
  }
]
```

### `GET /api/posts/:slug`

```json
{
  "id": "hello-site",
  "title": "欢迎使用 KCommit-Blog",
  "description": "……",
  "date": "2026-10-22T00:00:00.000Z",
  "markdown": "正文 Markdown……"
}
```

### `GET /api/notes`

```json
[
  {
    "id": "2026-10-20",
    "date": "2026-10-20T00:00:00.000Z",
    "markdown": "一两句话。"
  }
]
```

### `GET /api/site`

字段与 `src/site.ts` 中站点配置一致（不含 `projects`；项目走 `/api/projects`）。

## 实现位置

| 文件 | 作用 |
|------|------|
| `src/lib/api/index.ts` | 统一入口，按环境切换本地 / 远程 |
| `src/lib/api/local.ts` | 当前静态数据源 |
| `src/lib/api/remote.ts` | 预留 fetch 实现 |
| `src/lib/api/types.ts` | 类型契约 |

后台管理、鉴权、评论等不在本契约内；需要时另开接口，不要破坏上述只读内容 API。

## 后端实现提示（C#）

- 推荐：在本仓库新增 **ASP.NET Core** Web API 工程（如 `backend/`），与 Astro 前端同仓维护
- 部署可与 Cloudflare Pages 分开（API 另主机 / 容器），但代码仍在本仓库
- 按上表实现 GET 接口，JSON 字段与 `src/lib/api/types.ts` 对齐即可
- 配好 CORS（若浏览器直连）或仅供构建机访问
- 前端 `.env` 设置 `PUBLIC_API_BASE_URL` 指向该 API 根地址
