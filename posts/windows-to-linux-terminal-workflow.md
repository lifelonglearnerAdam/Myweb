---
title: 从 Windows 搬到 Linux
slug: windows-to-linux-terminal-workflow
lang: zh
category: Linux · 工作台
date: 2026-11-17
draft: false
cover: assets/images/posts/linux/linux-cover-art.webp
summary: LibreOffice 交文档，Neovim 写代码，pi 放在旁边。主力环境换成了 Ubuntu，事情还是那些事情。
---

现在日常用 Ubuntu。代码、Git、编译和调试基本都在终端里；文档和图片，该开窗口就开窗口。

# 文档还得交

![内容阅读和页面排版是两条不同的路径：Neovim 读正文，LibreOffice 检查版式并导出 PDF。Image2.6 示意图，不是软件截图。](assets/images/posts/linux/office-art.webp)

LibreOffice 接住 DOCX 和 PPTX，Neovim 里的 DOCX 插件用来快速读正文。一个看内容，一个看排版，别混用。

上次一份 PPTX 死活打不开，其他文件却正常。最后查到内部索引的兼容问题，规范后，副本的 26 页都能读了。原件没动。

能打开，不代表分页、字体和动画都一样。要交的文件，还是打开看一遍。

# 一个目录，几个窗格

![查找、编辑、构建、测试、检查差异的工作流：rg 和 fd、Neovim、CMake、CTest、git diff，pi 在旁辅助。Image2.6 示意图。](assets/images/posts/linux/workflow-art.webp)

Neovim 写，另一个窗格编译，pi 放旁边。tmux 管会话，Yazi 找文件，lazygit 看改动。没必要把每件事都塞成编辑器插件。

CMake 项目里，编辑完就回到这几步：

```bash
cmake -S . -B build -G Ninja \
  -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
cmake --build build
ctest --test-dir build --output-on-failure
git diff
```

这是已有 CMake 项目的用法，依赖和测试要先配好。补全再聪明，最后也得让编译器和测试说话。

# pi 就坐在旁边

在项目目录运行 `pi`。读报错、查代码、看差异，省掉来回复制粘贴。

学新东西时，我会让它先解释，别急着改。改完看 diff，再跑测试。接的是模型服务，别把密钥和私有材料顺手喂进去。

# 看图这件小事

![同一张图片在两种终端里的处理方式：Kitty 内嵌显示，Ptyxis 从编辑器调用外部图片查看器。Image2.6 示意图。](assets/images/posts/linux/preview-art.webp)

Kitty 能内嵌图片，Ptyxis 这套环境不行。后来让 Neovim 直接叫起系统图片查看器，问题就结束了。

我想要的是顺手，不是为了“全终端”三个字跟一张 PNG 较劲。

# 记在这里

- tmux 能接回会话，不替你保存文件，也不保证重启后任务还在。
- Neovim 不在保存时自动格式化；需要时手动来。
- `work`、`v`、`y` 是我自己的脚本、别名或函数，不是 Linux 自带命令。

配置还会改。这篇先记现在能用的部分。

---

AI 辅助整理。插图：CCSWITCH / Image2.6，均为示意，不是真实终端截图。更细的验证范围见[内容记录](https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/LINUX-WORKFLOW-POST.md)。

读过的好文章：[Julia Evans 的终端配置](https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/)、[Drew DeVault 的 Git 工作流](https://drewdevault.com/blog/My-weird-branchless-git-workflow/)、[Karthinks 的阅读模式](https://karthinks.com/software/more-less-emacs/)。
