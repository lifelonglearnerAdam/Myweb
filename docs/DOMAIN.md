# 免费短域名：`zimo.is-a.dev`

## 当前状态

- 当前可用主页：https://lifelonglearneradam.github.io/Myweb/
- 免费候选：**`zimo.is-a.dev`**。
- 检查时未发现 `domains/zimo.json` 的同名登记或保留记录；这不保证之后仍空闲，也不代表已经获得域名。
- **尚未创建申请 PR，尚未设置 CNAME，尚未生效。**

## 为什么需要本人提交

is-a.dev 的 [服务条款](https://is-a.dev/terms) 第 6 节允许 AI 辅助建立网站，但明确反对使用 AI 创建申请 PR，并保留关闭申请、阻止账号互动的权利。为避免给账号带来风险，不由编码代理代为创建申请或伪装成人工请求。

以下是配置说明，不是已经提交的注册申请。请本人阅读条款、按官方指南填写并提交。

## 本人操作步骤

1. 打开 [GitHub Pages 官方指南](https://docs.is-a.dev/guides/github-pages/) 和 [Quickstart](https://docs.is-a.dev/quickstart/)，阅读 [服务条款](https://is-a.dev/terms)。
2. 登录你的 GitHub，打开 https://github.com/is-a-dev/register/fork ，Fork 到个人账号。
3. 按官方指南，在 Fork 的 `domains` 目录新建 **`zimo.json`**。需要的实际 DNS 信息只有：
   - `owner.username`：**`lifelonglearnerAdam`**。
   - `records.CNAME`：**`lifelonglearneradam.github.io`**。
   - CNAME 只填主机名，不填 `https://`，也**不填 `/Myweb/` 路径**。
4. 本人依据官方模板创建 Pull Request，保留模板中的所有注释、标题与要求。预览网址填写 https://lifelonglearneradam.github.io/Myweb/ ，并如实说明这是个人软件工程 / 研究作品集与技术博客，不是聊天机器人、课程平台或商业站。
5. 等待维护者审核，不重复申请，也不私信催审。若同名被占用，再考虑 `zimozeng.is-a.dev`，不要同时囤积多个名字。

官方域名结构说明：https://docs.is-a.dev/domain-structure/

## 审核通过后再做

**不要在审核通过前设置 Custom domain。** 提前设置可能使现有网站跳转到尚未生效的地址。

1. 确认 PR 已合并，并且 DNS 的 `zimo.is-a.dev` CNAME 指向 `lifelonglearneradam.github.io`。
2. 在 `lifelonglearnerAdam/Myweb` → Settings → Pages → Custom domain 填 **`zimo.is-a.dev`**。
3. 根目录生成 / 保存 `CNAME` 文件，内容为该域名；确保 `main` 与 Pages 实际发布分支 `master` 同步。
4. 等待 GitHub 签发证书，再打开 **Enforce HTTPS**。DNS 或证书可能需要一段时间，不承诺即时完成。
5. 更新站点 canonical、Open Graph、JSON-LD、`robots.txt`、`sitemap.xml`、简历中的站点网址与 README；现在暂时保留原来的 GitHub Pages 地址。
6. `404.html` 当前有 `<base href="/Myweb/">`：绑定根域名后需同步改为 `/`。其余页面资源使用相对路径，便于迁移。
7. 建议按官方指南给 GitHub 账号增加域名所有权验证 TXT，以防子域名接管。TXT 应放在独立验证子域名，不与 CNAME 混写。

## 成本与限制

- 子域名本身免费，不会产生独立域名的年度注册费。
- 这是社区提供的**子域名使用权**，不是购买一个自己完全拥有的顶级域名。
- 审核时间、持续服务与长期保留由社区决定；条款不保证永久服务。
- 站点需继续符合软件开发相关、非商业等要求。个人作品集注明研究 / 实习机会，不等于商业收费平台。
- 请勿把 GitHub Token、密码、付款资料或实名证件放进申请仓库。
