# 📋 更新记录

本项目版本记录。根 README 只保留摘要。

## 1.1.1 — 2026-10-23

### 文档

- `CONTENT.md` / `README` 补充正文插图约定：须放 `public/img/...`，Markdown 使用 `/img/...`
- 说明管理端一键发布的配图白名单，以及文档图未带上时的手动 `git add` 做法
- 常见卡点增加「图片裂开」排查
- 修正 README 表格/加粗/链接笔误；目录锚点与版本号对齐
- 域名绑定：已在 CF 的简化说明；NS 改为「以控制台为准」勿照抄示例
- 示例文档 `getting-started` 去掉无效 `tags`（docs schema 无此字段），改用 `category`

---

## 1.1.0 — 2026-10-23

### 新增

- **本机管理端** `admin/`：写 / 改 / 删五类内容，导入 Markdown，上传配图
- 管理端 **发布上线**：对 `src/content/**` 与相关配图 `git commit` + `git push`（触发 Cloudflare Pages）
- 启动方式：`npm run admin` 或 `admin/Start.bat` → http://127.0.0.1:4322（仅本机）

### 调整

- 文章 / 文档元信息由「约 x 分钟」改为 **日期 · 距今相对时间**（浏览器端刷新）
- README / CONTENT / DEVELOPMENT / ROADMAP 同步管理端用法与注意点

### 说明

- 管理端**不要**部署到公网；保存只改本地文件，上线靠推送
- 评论（Giscus）仍默认关闭；C# 后端仍按路线图后置

---

## 1.0.0 — 2026-10-22

### 新增

- Astro 5 静态博客主题（文章 / 说说 / 文档 / 分享 / 项目 / 友链星图）
- `src/site.ts` 集中配置；Content Collections + Zod
- 首页轮播、音乐播放器、可选 Giscus
- `src/lib/api` 本地取数 + 预留远程 REST（`docs/API.md`，供日后 C# / ASP.NET 对接）
- Cloudflare Pages 部署说明与文档骨架  
  （`README` · `CONTENT` · `DEVELOPMENT` · `CHANGELOG`）

### 说明

- 当前：基本博客展示已具备；**管理页、评论未上线**（1.1.0 已补管理端）
- 路线：先静态管理页 + 评论，再同仓加入 C# / ASP.NET Core 后端
- 许可为 **PolyForm Noncommercial 1.0.0（禁止商用）**，见根目录 `LICENSE`
- 仓库内为占位文案与示例内容，需自行替换后再正式上线
