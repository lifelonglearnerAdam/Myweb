# 子墨的博客

- 主域名：https://zengzimo.cn/
- 英文界面：https://zengzimo.cn/?lang=en
- 课程代码记录：https://github.com/lifelonglearnerAdam/hust-course-notes
- GitHub Pages 镜像：https://lifelonglearneradam.github.io/Myweb/
- 备用网址：https://me.zimo-personal-space.workers.dev/

从大一实践课的网页改起。现在有文章、归档、冬日共学、项目和关于我。第一篇正式文章是 [Tor 网络可视化实测](https://zengzimo.cn/note.html?id=tor-onion-field-notes)：基于真实验收记录，明确标注 AI 辅助、原创生成插画、截图与未解决问题，不用虚构日期或结果填满首页。

[从 Windows 到 Linux：把日常工作搬进终端](https://zengzimo.cn/note.html?id=windows-to-linux-terminal-workflow) 记录 LibreOffice 文档兼容、Neovim 开发、终端工具协作与 pi 接入，区分终端入口和图形界面，也保留功能验收的边界。内容依据与参考博客见 [docs/LINUX-WORKFLOW-POST.md](docs/LINUX-WORKFLOW-POST.md)。

![桌面预览](docs/preview-desktop.webp)

## 以后怎么写文章

文章放在 **`posts/`**，用 Markdown。参考 [posts/README.md](posts/README.md)。

```markdown
---
title: 一篇学习笔记
slug: a-study-note
lang: zh
category: 随记
draft: true
---

正文从这里开始。
```

- `draft: true` 或没写 `draft` 都不发布。
- 确认要公开后改成 `draft: false`，再运行 `npm run build`。
- 日期可填真实日期，也可不填；不会拿文件时间编出一段博客历史。
- 有英文原稿时可以加同 slug 的 `.en.md`；没有英文稿就显示原文，不自动伪装成译文。
- 目前支持标题、段落、列表、引用、代码块、图片和链接。原始 HTML 不直接执行。
- 以后把 `.md` 文件交给编码助手，也可以由它帮你检查排版、公开范围和链接，再发布。

## 本地运行

```bash
npm run build
python3 -m http.server 4173 --bind 127.0.0.1
# http://127.0.0.1:4173/
```

Node.js 20+、Python 3 即可。前端不依赖框架或外部字体，也没有 npm 依赖要安装。

简单的 Python 预览服务器不支持音频字节范围请求。要测音乐跨页续播、定位或 PDF 分段读取，请使用和主站相同的 Worker：

```bash
python3 scripts/stage_site.py .public-site
wrangler dev --local --config server/static-site/wrangler.jsonc --port 4175
# http://127.0.0.1:4175/
```

## 目录

```text
posts/                        Markdown 文章与不发布的草稿模板
assets/js/posts.js            文章构建结果，勿手工编辑
assets/js/visual-story.js     可选分镜阅读、手动播放控制与图片放大
assets/css/visual-story.css   仅在图解文章中按需加载
assets/images/posts/tor/     Tor 文章的原创插画、SVG 与脱敏证据拼图
assets/js/content.js          个人信息、项目与界面文案
assets/js/winter-content.js   自己重写的开放式学习路线
assets/js/app.js              页面和全站侧栏
assets/js/navigation.js       换页时保留音乐和苏苏
assets/js/mascot.js            苏苏动画、拖动、指引/聊天切换
assets/js/companion-lines.js  本地的日常气泡台词
assets/js/companion-chat.js   主动发起的 AI 聊天，不含密钥
assets/css/site.css           基础样式
assets/css/blog.css           侧栏优先的博客布局
scripts/build_posts.py        Markdown → 本地文章数据与站点地图
scripts/stage_site.py         只打包公开站点文件
server/static-site/           自有域名与静态站配置
server/susu-worker/           独立 AI 后端；凭证只在 Secret
```

## 几个说明

- 桌面使用一套侧栏导航，详情页也保留；手机使用同一套菜单的抽屉版。
- 联系方式是 GitHub、邮箱、复制邮箱的小图标；主邮箱为 `zimozeng961@gmail.com`。
- 冬日共学是个人整理的自学与讨论路线，不声称已经举办，不带原资料里的机构、群号和原始手册。
- 项目可以有公开源码或演示；未发表研究只写宽泛兴趣，不复制私有仓库的细节。
- 鼠标移入苏苏、侧栏入口、项目卡片等位置，会冒出一句对应台词；移开再移入就换一句。在同一元素里移动不会刷屏，聊天、输入或拖动时不插话，也不调用模型。收起状态下，移到小苏苏按钮上也能看到提示。
- 侧栏保留“简历 / CV”。简历页有中文、英文两份实际 PDF 下载，不只是打开打印对话框；在线预览也保留。
- 简历的课程成绩只列已核对、专业相关且数字成绩在 85 分及以上的课程，不公开完整成绩单、学号，也不把“优”擅自换算为数字。
- 苏苏 AI 使用 `gpt-6.1-sol`，最近 16 轮聊天只在页面内存里，刷新或“重新聊”清空。主站通过同源 `/api/chat` 转发，API Key 不在网页中。
- AI 服务有每日全站上限，目前为 60 次；Cloudflare 托管免费，不等于上游模型调用免费。
- 《卡农》是 Lee Galloway 的授权钢琴录音，低音量循环、可暂停；首次播放受浏览器自动播放规则约束。
- 苏苏**没有冒充官方原声**，也没有克隆配音演员。复核参考站后，找到了 Shizuku 模型自带的 MP3，但那不是苏苏的声音；苏苏原声仍未加入。具体出处见 [docs/VOICE.md](docs/VOICE.md)。
- 樱花背景和头像沿用已生成的素材；诗卡是有署名和许可的外部摄影，英文诗只摘名家原文。

素材、音乐与隐私说明：[credits.html](https://zengzimo.cn/credits.html)、[图片署名](assets/images/ATTRIBUTION.md)、[音乐署名](assets/audio/ATTRIBUTION.md)。

## 检查与发布

```bash
# 简历或相关排版改动后，重新导出两份 PDF（需要 playwright-cli）
npm run resumes
npm run check

# 浏览器回归（已安装 playwright-cli 时）
playwright-cli open http://127.0.0.1:4173/
playwright-cli run-code --filename=tests/hover-checks.js
playwright-cli run-code --filename=tests/resume-checks.js
playwright-cli run-code --filename=tests/blog-checks.js
playwright-cli run-code --filename=tests/linux-workflow-checks.js
playwright-cli run-code --filename=tests/visual-story-checks.js
playwright-cli run-code --filename=tests/browser-checks.js
playwright-cli run-code --filename=tests/experience-checks.js
playwright-cli run-code --filename=tests/guide-mode-checks.js
playwright-cli run-code --filename=tests/chat-checks.js

# 免费主站：只上传打包后的公开文件
python3 scripts/stage_site.py .public-site
wrangler deploy --config server/static-site/wrangler.jsonc
```

GitHub 默认分支为 `main`，Pages 从 `master` 发布，两者同步。只暂存确认要公开的文件，别直接把目录里的个人图片或资料包 `git add -A`。原始 `css/`、`js/` 不再被新版引用，保留以免覆盖之前的本地改动。

域名和备案的区别见 [docs/DOMAIN.md](docs/DOMAIN.md)。外部下载资料只存在本地课程目录，不随网站或个人代码仓库上传。

设计参考：[Suwa shrine](https://sukunahust.moe/) 的博客结构。参考的是阅读与导航方式，不复制学长的文章、个人经历或下载资料到本站冒充原创。
