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

要交 PDF 时，可以在 `report.docx` 所在目录跑这几行。需要 LibreOffice 和 `pdfinfo`（Ubuntu 的 `poppler-utils` 包）：

```bash
out=$(mktemp -d)
libreoffice -env:UserInstallation="file://$out/profile" \
  --headless --convert-to pdf --outdir "$out" report.docx
test -s "$out/report.pdf" && pdfinfo "$out/report.pdf"
```

临时目录不会混进旧 PDF。看到页数，说明这次确实导出了文件；用 `xdg-open "$out/report.pdf"` 再看分页和字体。

# 一个目录，几个窗格

![查找、编辑、构建、测试、检查差异的工作流：rg 和 fd、Neovim、CMake、CTest、git diff，pi 在旁辅助。Image2.6 示意图。](assets/images/posts/linux/workflow-art.webp)

Neovim 写，另一个窗格编译，pi 放旁边。tmux 管会话，Yazi 找文件，lazygit 看改动。没必要把每件事都塞成编辑器插件。

不用先找一个 CMake 工程。有 `git`、`cc`（Ubuntu 可装 `build-essential`）和 `nvim`，就能从空目录跑一遍：

```bash
dir=$(mktemp -d) && cd "$dir" && git init -q &&
  printf '%s\n' '#include <stdio.h>' \
    'int main(void) { puts("Windows"); }' > hello.c &&
  git add hello.c
```

`git add` 先存一份对照，不用提交。下面这段先跑一次：能编译，但 `check=1`，因为输出不是 `Linux`。

```bash
cc -Wall -Wextra hello.c -o hello &&
  ./hello | grep -x Linux
echo "check=$?"
git diff -- hello.c
```

运行 `nvim hello.c`。按 `Esc`，输入 `:%s/Windows/Linux/` 回车，再输入 `:wq` 回车。重跑同一段：这次打印 `Linux` 和 `check=0`，diff 只有一行被替换。编译通过和程序做对，是两件事。

# pi 就坐在旁边

也可以在改代码前，在练习目录运行已配置好的 `pi`。问它：「只读 `hello.c`，解释为什么编译成功，检查却返回 1；先别改文件。」看完解释，自己改、跑、看 diff。别把私有材料顺手喂进去。

# 看图这件小事

![同一张图片在两种终端里的处理方式：Kitty 内嵌显示，Ptyxis 从编辑器调用外部图片查看器。Image2.6 示意图。](assets/images/posts/linux/preview-art.webp)

Kitty 能内嵌图片，Ptyxis 这套环境不行。后来让 Neovim 直接叫起系统图片查看器，问题就结束了。

我想要的是顺手，不是为了“全终端”三个字跟一张 PNG 较劲。

# 接回工作台

`tmux new-session -A -s desk` 创建或接回会话。按 `Ctrl-b`，松开再按 `d` 断开，程序继续运行；这不等于跨重启保存。我的 `work`、`v`、`y` 是自定义入口，不是 Linux 自带命令。

---

AI 辅助整理。插图：CCSWITCH / Image2.6，均为示意，不是真实终端截图。更细的验证范围见[内容记录](https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/LINUX-WORKFLOW-POST.md)。

读过的好文章：[Julia Evans 的终端配置](https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/)、[Drew DeVault 的 Git 工作流](https://drewdevault.com/blog/My-weird-branchless-git-workflow/)、[Karthinks 的阅读模式](https://karthinks.com/software/more-less-emacs/)。
