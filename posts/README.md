# 以后在这里放文章

把 `.md` 文件放在这个目录即可。不用手写网页，也不用改 `content.js`。

```markdown
---
title: 第一篇笔记
slug: first-note
lang: zh
category: 随记
date: 2026-11-14
draft: true
summary: 用一句话说说这篇写了什么。
---

正文从这里开始。

## 一个小标题

支持段落、列表、引用、代码块、图片和链接。
```

- **还没写完就用 `draft: true`**。没有写 `draft` 也默认不发布。
- 想发布时，确认内容后改为 `draft: false`。
- 日期用真实的写作 / 发布日期；也可以暂时不填，不会用文件时间编造日期。
- `slug` 用小写英文字母、数字和短横线，是文章的固定链接标识。
- 中文文章用 `lang: zh`。以后有英文版，可以新建同 `slug` 的 `.en.md`，用 `lang: en`。没有英文稿时切换语言仍显示原文，不自动冒充已翻译。
- 本目录的 `README.md` 和 `_drafts/` 下的内容不会构建成文章。
- 图片可以放在 `assets/images/posts/`，Markdown 中写相对本站根目录的路径，例如 `![说明](assets/images/posts/example.webp)`。
- 不要把私有研究记录、内部材料、密钥或个人信息放在准备公开的文章里。

本地构建：

```bash
npm run build
python3 -m http.server 4173 --bind 127.0.0.1
```

浏览 `http://127.0.0.1:4173/`。确认后再提交、部署。你也可以直接把 Markdown 文件交给编码助手，请它先检查公开范围、排版和链接，再帮你发布。
