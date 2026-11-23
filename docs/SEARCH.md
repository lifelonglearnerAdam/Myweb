# 搜索发现与主动提交

正式站的 [robots.txt](https://zengzimo.cn/robots.txt) 允许抓取公开页面和渲染所需的资源，排除 `/api/`，并指向 [sitemap.xml](https://zengzimo.cn/sitemap.xml)。地图列出主页、归档、冬日共学、简历、致谢和每个公开项目、已发布文章的独立地址；不含草稿、跳转页、语言切换参数或虚构的更新时间。

先构建、检查，再按 [发布说明](DOMAIN.md) 部署。GitHub Pages 镜像保留 `/Myweb/*.html`；构建 Cloudflare 发布目录时会改成主域名直接返回 200 的地址。下面的命令读取**已上线**的主站地图。构建、测试和部署本身不向搜索引擎发请求。

| 平台 | 提交方法 |
| --- | --- |
| Google | 登录 [Search Console → 站点地图](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Azengzimo.cn)，选择已验证的 `zengzimo.cn` 资源，提交 `https://zengzimo.cn/sitemap.xml`。也可用下方 API。旧的 sitemap ping 已停用，不使用仅面向特定内容类型的 Indexing API。 |
| Bing | 通过 [IndexNow](https://www.indexnow.org/documentation) 发送新增或变更页面的 URL。`/indexnow-key.txt` 是**必须可公开读取**的主机验证文件，不是站长账户密码。也可以在已验证的 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 里登记整张地图。 |
| 百度 | 登录[百度搜索资源平台 → 普通收录](https://ziyuan.baidu.com/linksubmit/index)，先验证 HTTPS 主站。若账户开放 sitemap 权限，提交地图地址；否则在「手动提交」逐行提交页面地址，或用「API 提交」。API 推送的是页面 URL，不是 sitemap 文件。 |

```bash
# 初次发现：使用已上线的地图通知 IndexNow（Bing 参与）。
python3 scripts/submit_search.py bing
# 后续只提交新发或实质更新的页面，不要定时重复推全站。
python3 scripts/submit_search.py bing 'https://zengzimo.cn/credits'

# 仅在本机安全地配置好对应凭据后执行：
python3 scripts/submit_search.py google
python3 scripts/submit_search.py baidu 'https://zengzimo.cn/credits'
```

Google API 需要环境变量 `GSC_ACCESS_TOKEN`，来自对该资源有提交权限的账号，OAuth scope 为 `https://www.googleapis.com/auth/webmasters`。默认使用 `sc-domain:zengzimo.cn`；仅验证了网址前缀时，设置 `GSC_PROPERTY=https://zengzimo.cn/`。百度 API 需要该站「普通收录」的 `BAIDU_PUSH_TOKEN` 和可用配额。**不要把 token 写入 Git、前端或聊天中。** 如果百度 API 无法通过 HTTPS 证书验证，就用官方 HTTPS 后台，不关闭验证，也不通过明文 HTTP 传输 token。

HTTP 200 / 202 等回执表示收到请求（IndexNow 的 202 还需校验密钥），不代表抓取或收录。Google、Bing、百度各自决定是否以及何时收录，可在各自的站长后台查看。
