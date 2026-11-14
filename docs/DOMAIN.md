# 自有域名与发布

## 访问地址

- **主域名：https://zengzimo.cn/**
- **www：https://www.zengzimo.cn/**
- 免费备用地址：https://me.zimo-personal-space.workers.dev/
- GitHub Pages 镜像：https://lifelonglearneradam.github.io/Myweb/

域名在阿里云／万网注册，网站继续使用 Cloudflare 免费 Workers Static Assets 托管。没有购买服务器、付费 Cloudflare 套餐或备案服务。域名注册、实名、DNS、HTTPS 与 ICP 备案是不同事项；本文不代表已取得 ICP 备案。

## DNS 与域名绑定

- 注册商：阿里云计算有限公司（万网），注册商不变，没有域名转移。
- 域名实名通过后，注册局状态为 `ok`，原先的 `clientHold` 已解除。
- DNS 服务器已更换为 Cloudflare 为这个域名分配的：
  - `ara.ns.cloudflare.com`
  - `sean.ns.cloudflare.com`
- 更换前已检查阿里云解析列表为空，没有覆盖既有网站、邮箱或验证记录。
- `zengzimo.cn` 与 `www.zengzimo.cn` 都绑定至已有 `me` Worker，HTTPS 由 Cloudflare 管理。
- 源码中的 `server/static-site/wrangler.jsonc` 保留两个 Custom Domain 路由和 `workers_dev: true`，后续部署不会丢失绑定，免费备用网址也继续可用。
- DNS 缓存和证书签发可能有同步时间；绑定成功不等于保证所有国内运营商线路都稳定，仍需在实际网络上测试。

以后要更换 DNS 服务商，先导出并核对所有记录，包括新增的邮箱 MX、TXT、验证或其他子域名，再操作，不要只复制网站记录。

## 发布到 Cloudflare

```bash
python3 scripts/stage_site.py .public-site
wrangler deploy --config server/static-site/wrangler.jsonc
```

构建脚本默认将 canonical、Open Graph、站点地图、简历站点地址和 404 base 调整到 `https://zengzimo.cn/`，不修改其他项目的外链，也不覆盖 GitHub 镜像的源文件。

如需要独立构建其他主机，可显式指定：

```bash
python3 scripts/stage_site.py /tmp/zimo-site-test --site-url https://me.zimo-personal-space.workers.dev
```

不直接把整个工作目录作为 Static Assets 上传。构建只复制公开页面、资源与旧链接入口，不上传 `image/` 原图、`.git/`、后端源码、测试、`.dev.vars` 或账号配置。

## 苏苏聊天

- 主站入口：`https://zengzimo.cn/api/chat`；www 与备用站也各自使用自己的 `/api/chat`。
- 通过 Cloudflare 内部 `SUSU_CHAT` Service Binding 转发到后端，不要求浏览器连接另外的公共代理子域名。
- GitHub 镜像向自有域名的 `/api/chat` 发起允许的跨域请求。
- CORS 来源白名单包含自有域名、www、免费备用站与 GitHub。密钥与上游地址仍然只在后端 Secret，不放进网页或 Git。
- 部署新的静态站前，先更新并部署 `server/susu-worker/wrangler.jsonc` 中的来源权限。
- 同源调用、上下文、指引切换、限频与费用边界见 `server/susu-worker/README.md`。

## 关于以后备案

目前是 Cloudflare 的非中国内地免费托管，自有 `.cn` 域名并不自动要求购买境内服务器，也不代表已经备案。

如果以后决定接入中国内地服务器、CDN 或相应境内托管，需通过实际接入商按真实资源与个人资料办理备案；是否需要购买资源，应以最终平台的备案资格要求为准，不为了“先拿备案号”购买不用的服务器。实名认证、短信和人脸核验由本人在官方平台完成。

备案通过不等于公开 AI 聊天等所有功能自然满足全部要求；迁到境内时需另外核验相关服务与合规要求。

## 之前考虑的社区域名

`zimo.is-a.dev` 没有申请、没有获批；没有绕过该社区对 AI 代建 PR 的限制。现在使用本人已购买的域名，不依赖社区审核。
