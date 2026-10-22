# 预留内容接口

当前站点默认是**纯静态**：数据来自 `src/content/**`（含 posts / projects / notes 等）与 `src/site.ts`（站点配置）。

代码里已通过 `src/lib/api` 统一取数。以后若做前后端分离，后端按下面契约实现，前端只需设置：

```bash
PUBLIC_API_BASE_URL=https://your-api.example.com
```

即可切换到远程数据（构建时请求这些接口生成页面）。

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
