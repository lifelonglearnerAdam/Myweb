# Windows → Linux 工作流文章：内容依据与发布边界

- 文章：`posts/windows-to-linux-terminal-workflow.md`
- 公开地址：`https://zengzimo.cn/note.html?id=windows-to-linux-terminal-workflow`
- 整理日期：2026-11-17。此日期不是系统安装日期。
- 本人明确确认迁移方向为 Windows → Linux，并要求参考其他技术作者的博客、发表至本人网站。正文标注 AI 辅助，不创建未经本人提供的英文译稿。

## 本地记录支持的事实

- 当前工作环境为 Ubuntu 26.04；终端工作台使用 Neovim / LazyVim、tmux、Yazi、lazygit、fzf、ripgrep、fd、zoxide 等。Bash 中的别名、函数与自定义 `work` 脚本可支持正文描述；它们不是 Linux 标准命令。
- Neovim 配置接入相应语言服务与格式化工具，保存时自动格式化关闭。CMake 与 clangd 的关系按现有配置说明；正文的 CMake 命令是通用用法示例，不声称重新在某个私有项目验收。
- 2026-10-14 的安装记录确认编辑器 27 项、终端 13 项功能检查通过；记录同时说明可选健康检查提示、剪贴板验证边界和没有重启测试。正文不将其写成性能对比、全量健康检查通过或持续有效保证。
- 2026-11-06 的图片与 DOCX 预览记录确认 Kitty 内嵌图片，以及 Ptyxis / VTE 下使用外部图片查看器的退路。DOCX 是 Markdown 内容视图，编辑保存可能写回，不能说成只读或 Word 精确排版。
- 2026-11-16 的 PPTX 排错记录确认单个文件内部索引兼容问题，修复副本能读取 26 页并打开窗口。原件保留、文字及媒体资源不改动；不公开原课件、私人文件名、分工内容或截图，不把此前的安装状态猜测当成最终原因，不夸大为动画和版式逐项一致。
- pi 的基本使用方式以已安装版本的 README 与终端使用文档核对；不披露个人模型接口或凭据。正文不声称 pi 自带模型、免费无限调用、每次工具调用自动确认或天然安全隔离。

原始验证数据、私人会话和课程材料保留在本机，不加入 Git 或站点资源。本文只发布一般工作流与脱敏后的兼容排错事实，不包含未发表研究细节。

## 参考博客

2026-11-17 实际读取以下文章，均返回 HTTP 200：

- Julia Evans，2025-01-11：[What's involved in getting a “modern” terminal setup?](https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/)。参考按 Shell、终端与应用拆解需求和配置关联的方式，不沿用作者的个人配置、年限或感受。
- Drew DeVault，2021-12-05：[How new Linux users can increase their odds of success](https://drewdevault.com/blog/How-new-Linux-users-succeed/)。参考迁移预期与学习新工作方式的讨论；不将其中对其他平台的具体评价作为技术事实转载。
- Karthinks，2022-06-27：[more < less < emacs](https://karthinks.com/software/more-less-emacs/)。参考从一个小摩擦写到具体修改与边界的组织方式；没有复制 Emacs 代码或冒充本人使用 Emacs。

不转载这些作者的全文、插图或个人经历；公开文章附原文链接，明确其不是本机迁移事实的依据。

## 构建与回归

- Markdown 经既有构建脚本生成 `assets/js/posts.js` 和 `sitemap.xml`，首页及归档自动收录，不手写新页面。
- 将旧测试中“Tor 必须是列表第一项”的假设改为按生成顺序验证，Tor 文章本身仍按固定 slug 检查。
- `tests/linux-workflow-checks.js` 检查实际新文章的入口、目录、代码块、参考链接、语言回退和移动端宽度，不使用虚构文章替代验收。移动端检查发现长代码的最小内容宽度撑开文章网格；为阅读区子项设置 `min-width: 0`，让长命令只在代码块内部滚动，不隐藏整页溢出。
- 同步更新页面中的文章数据与阅读样式资源版本，避免已有浏览器继续读取旧缓存。共享阅读样式参与简历源文件指纹，因此按现有脚本重新导出 PDF，不修改简历内容。
- 发布时仅使用 `scripts/stage_site.py` 的公开文件允许列表，不上传原始记录、配置、会话或凭据。浏览器验收不主动调用 AI 接口。
