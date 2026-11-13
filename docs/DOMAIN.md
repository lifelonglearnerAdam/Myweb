# 免费网址与发布

## 已上线的地址

- **免费新网址：https://me.zimo-personal-space.workers.dev/**
- GitHub Pages 镜像：https://lifelonglearneradam.github.io/Myweb/

两者均属于本人账户下的免费托管地址，没有购买独立域名或开通付费 Cloudflare 服务。新地址由 Cloudflare Workers Static Assets 直接提供页面，不需要社区域名审核。苏苏的聊天代理是独立 Worker，前端没有 API 密钥。

## 发布到 Cloudflare

静态托管与聊天分开部署，避免将后端代码、密钥或本地图片放进公共静态资源。

1. `python3 scripts/stage_site.py .public-site`
2. `wrangler deploy --config server/static-site/wrangler.jsonc`，仅上传准备好的 `.public-site`，Worker 名称为 `me`。
3. 账户的已注册 Workers 子域名为 `zimo-personal-space`，因此完整地址是 `me.zimo-personal-space.workers.dev`。
4. 构建脚本只复制公开站点文件，并把本站绝对链接、站点地图与 404 base 调整到新主机名根目录。
5. GitHub 的 `main` / `master` 同步推送；Pages 仍从 `master` 发布。

不应直接把整个工作目录作为 Static Assets 上传，也不要把 `image/` 中的个人照片、`.git/`、测试日志、Cloudflare 配置凭证或 `.dev.vars` 发布出去。

## 苏苏聊天的独立后端

- 网页聊天入口：**https://me.zimo-personal-space.workers.dev/api/chat**。
- 主站通过内部 Service Binding 转发到苏苏 Worker，浏览器不再额外请求独立代理子域名；GitHub 镜像也使用这个入口。
- 后端 Worker：https://zimo-susu-chat.zimo-personal-space.workers.dev（供维护，不是前端直连地址）。
- `server/susu-worker/` 保存**不含密钥**的后端源码与公开配置。
- API 地址、API Key 与限频盐值只存在 Cloudflare Secret 中。
- 来源白名单包括上述 Cloudflare 站点和 GitHub Pages。
- 目前全站每日最多 60 次模型请求；Cloudflare 托管免费不代表上游模型调用免费。

## 之前考虑的社区域名

`zimo.is-a.dev` **没有申请、没有获批**。该社区明确限制使用 AI 代建申请 PR，因此没有尝试以“有人旁观”为理由绕过规则。现在已有无需人工审核的免费托管网址，不影响网站使用。

独立注册域名仍然可以以后绑定，但购买、实名与续费需要本人另行决定；本轮没有产生域名购买行为。
