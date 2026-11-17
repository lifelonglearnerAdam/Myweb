/* Generated from owner-published posts/*.md. Drafts are never included. */
window.PORTFOLIO.notes = [
  {
    "id": "windows-to-linux-terminal-workflow",
    "languages": [
      "zh"
    ],
    "minutes": 9,
    "date": "2026-11-17",
    "layout": "article",
    "cover": "",
    "title": {
      "zh": "从 Windows 到 Linux：把日常工作搬进终端",
      "en": "从 Windows 到 Linux：把日常工作搬进终端"
    },
    "summary": {
      "zh": "用 LibreOffice 接住文档交付，用 Neovim、tmux 和一组小工具组织开发，再把 AI 接进 pi。一次从 Windows 迁到 Linux 的工作流重建，也记录那些不能被“全终端”三个字抹掉的边界。",
      "en": "用 LibreOffice 接住文档交付，用 Neovim、tmux 和一组小工具组织开发，再把 AI 接进 pi。一次从 Windows 迁到 Linux 的工作流重建，也记录那些不能被“全终端”三个字抹掉的边界。"
    },
    "category": {
      "zh": "Linux · 工作流",
      "en": "Linux · 工作流"
    },
    "html": {
      "zh": "\u003cp\u003e迁移到 Linux 是否成功，不该只看能不能启动桌面。对我来说，更有用的验收题是：拿到一份课件，能不能读；写完一段代码，能不能编译、测试、调试；最后交出去的文档，别人能不能正常打开。\u003c/p\u003e\n\u003cp\u003e这篇记录的是我从 Windows 转向 Linux 日常工作环境后，围绕 LibreOffice、Neovim 和终端 AI 工具 pi 搭起的一套工作台。它不是“一条命令告别 Windows”的教程，也不是一张装满软件图标的截图。比安装了什么更值得记下来的，是这些工具怎样接起来，以及它们在哪里接不上。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先把“完全迁移”说清楚\u003c/h2\u003e\n\u003cp\u003e现在这套工作环境运行在 Ubuntu 26.04 上。开发、文件检索、Git、构建和调试的主线已经放进 Linux，而不是只在 Windows 里偶尔开一个 Linux 终端。\u003c/p\u003e\n\u003cp\u003e但“完全迁移”说的是\u003cstrong\u003e日常工作的重心\u003c/strong\u003e，不是宣称已经删除了磁盘上的所有 Windows 分区，更不是证明每一种 Windows 软件都有替代品。\u003c/p\u003e\n\u003cp\u003e同样，我说的“全终端化”，也不是不用浏览器、不看图片、不打开办公软件。更准确的说法是：\u003cstrong\u003e尽可能从终端进入任务，让命令、文件和结果能够连成一条可追踪的路径；确实需要图形界面时，就正常使用它。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e这两句话听起来不够激进，却能省去很多为了证明“纯粹”而制造的麻烦。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003eLibreOffice：能打开，只是第一关\u003c/h2\u003e\n\u003cp\u003e代码可以换编辑器，协作文档却不能要求所有人跟着换格式。讲义、报告和演示文稿仍然会以 DOCX、PPTX 的形式出现。迁移首先得接住这些真实任务。\u003c/p\u003e\n\u003cp\u003eLibreOffice 在这里负责文档和演示文稿的阅读、编辑与导出，但我不会把“支持这个扩展名”理解成“与 Microsoft Office 完全一致”。字体、公式、分页、动画和嵌入对象都可能成为差异来源。能读到文字，与适合交付，是两种不同的验收。\u003c/p\u003e\n\u003cp\u003e11 月 16 日就有一次很具体的提醒：一份 PPTX 打不开。\u003c/p\u003e\n\u003cp\u003e最初看上去像是办公软件出了问题，但排查时，其他演示文稿能够正常打开，问题收敛到了这份文件本身。最后定位到它内部文件索引的写法与 LibreOffice 的兼容问题；规范索引后，修复副本的 26 页都能读取，窗口也正常打开。原文件保留，文字、图片和视频资源没有改动。\u003c/p\u003e\n\u003cp\u003e这件事不能推出“以后所有 PPT 都没问题”，也不证明每一页的动画和排版已经与 PowerPoint 逐项一致。它说明的是另一个更实用的习惯：\u003cstrong\u003e先分清是程序普遍失效，还是某一份输入触发了问题；修复副本，不拿原件冒险。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e文档处理也有适合交给命令行的部分。比如下面是一个简化的 PDF 导出示例，需先准备好自己的 \u003ccode\u003ereport.docx\u003c/code\u003e，导出后仍要打开检查：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003emkdir -p export\nlibreoffice --headless --convert-to pdf \\\n  --outdir ./export ./report.docx\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这只是命令用法，不是本文重新做过的一次格式兼容测试。导出命令退出，并不替代对分页、字体和公式的目视检查。需要共同编辑时按约定交源文件，需要固定阅读版时再附 PDF；PDF 也不能反过来代替可编辑原稿。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003eNeovim：先接通反馈回路，再记快捷键\u003c/h2\u003e\n\u003cp\u003e我的编辑环境是 Neovim 加 LazyVim，接入 C/C++、Python、Shell、Lua、JSON 和 Markdown 的相关工具。文件搜索、项目内检索、定义跳转、诊断、格式化和终端入口都围绕项目目录组织。\u003c/p\u003e\n\u003cp\u003e这套配置里有一个刻意保留的选择：\u003cstrong\u003e默认不在保存时自动格式化。\u003c/strong\u003e 需要时手动触发，避免刚接手一个项目，就因为保存文件产生一大块与任务无关的格式差异。\u003c/p\u003e\n\u003cp\u003e不过，编辑器能补全，不代表项目能编译；没有红色波浪线，也不代表程序正确。终端工作流真正重要的部分，是把编辑之后的反馈接回来。\u003c/p\u003e\n\u003cp\u003e以一个已配置好测试的 CMake 项目为例，可以把流程写成下面这样。它是通用示例，不是对任意工程都适用的安装脚本：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ecmake -S . -B build -G Ninja \\\n  -DCMAKE_BUILD_TYPE=Debug \\\n  -DCMAKE_EXPORT_COMPILE_COMMANDS=ON\ncmake --build build\nctest --test-dir build --output-on-failure\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e\u003ccode\u003ecompile_commands.json\u003c/code\u003e 把编译参数提供给 clangd，让语言服务更接近真实构建环境；Debug 构建则为后面的 GDB 调试保留必要信息。工程本身的依赖、编译器和测试配置，仍然要另外准备。\u003c/p\u003e\n\u003cp\u003e还有一个看似基础、实际上必须分清的问题：\u003cstrong\u003e眼前是哪一种提示符？\u003c/strong\u003e\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e在 Shell 里输入 \u003ccode\u003ecmake\u003c/code\u003e、\u003ccode\u003egit\u003c/code\u003e、\u003ccode\u003epython3\u003c/code\u003e。\u003c/li\u003e\u003cli\u003e在 Neovim 普通模式里，用 \u003ccode\u003e:w\u003c/code\u003e 保存，按 \u003ccode\u003ei\u003c/code\u003e 进入输入模式。\u003c/li\u003e\u003cli\u003e进入 GDB 后，在它的提示符里输入断点、运行和查看变量的命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e把几个窗口都放进终端，不会让它们变成同一种语言。先知道自己在和谁说话，比背下一整页快捷键更有用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e终端工作台不是一个软件\u003c/h2\u003e\n\u003cp\u003eNeovim 不需要承担所有任务。我把其他事情分给更小的工具：\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003etmux\u003c/strong\u003e 管会话、窗口和分屏，让编辑、编译和 AI 对话可以并排放着。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eYazi\u003c/strong\u003e 管文件；配置过的 \u003ccode\u003ey\u003c/code\u003e 函数还能在退出后把 Shell 切到选中的目录。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eripgrep、fd、fzf、zoxide\u003c/strong\u003e 分别帮助搜索内容、查文件、模糊选择和跳到访问过的目录。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003elazygit\u003c/strong\u003e 用文字界面查看暂存区、差异和提交，不要求每一步都靠手敲长命令。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ebtop\u003c/strong\u003e 看资源与进程；排错时再按需使用系统日志和其他命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e它们的价值不是“比图形软件更有黑客感”，而是可以围绕同一个目录工作，不必不断重新告诉每个工具：项目在哪里，刚才改了什么。\u003c/p\u003e\n\u003cp\u003e我还把重复动作收成了几个自己的入口：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ework .      # 创建或接回当前项目的 tmux 会话\nv .         # 用 Neovim 打开项目\ny           # 用 Yazi 浏览，退出后回到选中目录\nlg          # 打开 lazygit\ntermhelp    # 查看自己的工作台速查表\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这里的 \u003ccode\u003ework\u003c/code\u003e、\u003ccode\u003ev\u003c/code\u003e、\u003ccode\u003ey\u003c/code\u003e、\u003ccode\u003elg\u003c/code\u003e 和 \u003ccode\u003etermhelp\u003c/code\u003e 是本机脚本、函数或别名，\u003cstrong\u003e不是装上 Linux 就有的标准命令\u003c/strong\u003e。对一个刚迁移的人，把这些区别写清楚，比展示一段无法直接复现的终端录像更有帮助。\u003c/p\u003e\n\u003cp\u003etmux 也不是任务永生器。退出客户端后，只要服务器和相关进程仍在，会话就可以接回；注销、关机或重启则可能终止它们。该保存的文件、该落盘的任务状态，不能交给“窗口还在”这件事来保证。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e一次图片预览，把边界暴露出来\u003c/h2\u003e\n\u003cp\u003e我确实尝试过让 Neovim 读的不只是代码。\u003c/p\u003e\n\u003cp\u003eDOCX 可以借助 \u003ccode\u003envim-docx\u003c/code\u003e 转为 Markdown 内容视图，配合渲染插件看正文、标题和表格。快速读材料时很方便，但这不是 Word 页面预览，不会精确复现分页、页眉页脚和复杂版式。\u003c/p\u003e\n\u003cp\u003e而且它不是绝对只读：只打开阅读不会改写原文件，编辑后执行 \u003ccode\u003e:w\u003c/code\u003e 却可能写回 DOCX。重要文档应先留副本；要核对最终排版，仍然回到办公软件或导出的 PDF。\u003c/p\u003e\n\u003cp\u003e图片则暴露了终端模拟器之间的差别。Kitty 可以内嵌原图；我使用的 Ptyxis / VTE 环境不支持相同的图像显示路径。最后的处理不是继续把二进制当文本打开，也不是强行宣称“任何终端都能看图”，而是让 Neovim 调用系统图片查看器，自己留下不可编辑的提示缓冲区。\u003c/p\u003e\n\u003cp\u003e这一步用了图形界面，却让工作流更可靠。\u003cstrong\u003e从终端发起，与最终以文字界面呈现，是两回事。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003ePDF 也有类似边界：\u003ccode\u003epdftotext\u003c/code\u003e 适合提取有文字层的内容，不负责复原所有视觉布局；扫描件需要 OCR，公式和图表更不能只看提取出的文字就下结论。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e把 AI 接进 pi，而不是反复搬运代码\u003c/h2\u003e\n\u003cp\u003e终端工作台搭好后，AI 也不必一直待在另一个聊天网页里。\u003c/p\u003e\n\u003cp\u003e我使用 pi 作为终端里的 AI 编码助手。进入项目目录后启动它，让对话围绕实际文件、命令输出和修改差异展开；Neovim 留着编辑，旁边的终端可以构建测试，另一个窗口放 pi。\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003e# 先在 Shell 中进入要处理的项目目录\npi\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e模型与访问凭据需要预先配置。pi 本身不是模型，也不是“装好就免费获得无限 AI”；它连接什么服务、发送什么上下文、如何计费，取决于实际配置。这里不公开个人接口、令牌或账号配置。\u003c/p\u003e\n\u003cp\u003e对学习任务，我更愿意把协作范围说得具体一些。下面是一种提示方式，不是某次对话的逐字摘录：\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e先读构建配置和失败日志，解释报错的原因。暂时不要修改代码。给我一个最小验证步骤，我自己在 Neovim 里改完，再检查结果。\u003c/p\u003e\u003c/blockquote\u003e\n\u003cp\u003e也可以把任务限制为阅读差异、检查测试覆盖或整理文档。重点不是让助手替我完成一切，而是让它进入已有的反馈回路，而不是另外制造一份脱离项目的答案。\u003c/p\u003e\n\u003cp\u003e这里也有不能省略的安全边界：\u003cstrong\u003e能执行命令，不等于命令安全。\u003c/strong\u003e pi 不会因为运行在终端里，就自动替我隔离文件、隐藏密钥或阻止破坏性操作。第三方模型服务还可能接收到任务所需的代码与上下文，因此应限制工作目录、工具权限和可发送资料，敏感内容另行处理。\u003c/p\u003e\n\u003cp\u003e修改后仍然看 \u003ccode\u003egit diff\u003c/code\u003e，该跑的测试自己确认；涉及删除、安装、提交、推送或部署时明确范围。AI 的解释可以是线索，真正的验收仍然来自可检查的文件和执行结果。\u003c/p\u003e\n\u003cp\u003e顺便说一句，这些工具并不都专属于 Linux。Windows 同样可以有终端、Neovim 和 AI 助手。迁移的价值，不需要靠否认另一套系统的能力来成立。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e装好了之后，还有哪些没测过？\u003c/h2\u003e\n\u003cp\u003e装好一套工具以后，很容易把“程序启动了”当成结束。10 月 14 日的工作台记录里，我留下了更细的检查：编辑器行为 27 项、终端行为 13 项通过，实际走过语言服务、搜索、编译、测试和会话恢复等路径。这些数字的用途，是让我知道当时究竟检查了什么，不是给桌面打分。\u003c/p\u003e\n\u003cp\u003e同一份记录也留下了没检查完的事情：健康检查里仍有可选预览和运行时提示；剪贴板提供者可用，但没有覆盖当时的剪贴板做往返测试；也没有做重启验收。之后补上图片预览，并不意味着其他提示自然消失。\u003c/p\u003e\n\u003cp\u003e这些留白应该和成功记录一起保留。否则，几周后面对一次失败，很容易把“我记得装好了”误当成“这个路径确实测过”。\u003c/p\u003e\n\u003cp\u003e配置本身也需要维护：保留 Neovim 的插件锁文件，修改前备份相关配置，尽量一次改变一件事。若要把 dotfiles 放进公开仓库，先挑选并检查文件，而不是把整个配置目录连同凭据和私人路径一起上传。\u003c/p\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e迁移真正留下了什么\u003c/h2\u003e\n\u003cp\u003e这套环境并没有让所有事情都变简单。办公格式要复核，终端能力有差异，插件会变化，AI 也会出错。终端化不是消灭这些问题，而是让更多问题有一个可以定位的入口。\u003c/p\u003e\n\u003cp\u003e现在，一项开发任务可以沿着同一条路径走下去：找到目录，读文件，编辑，构建，测试，看差异，记录结果。需要帮助时，pi 加进来；需要看排版时，LibreOffice 加进来。它们不必互相取代。\u003c/p\u003e\n\u003cp\u003e如果重新整理迁移顺序，我会先保住文档交付和基本开发，再接通检索、会话与版本管理，最后处理那些确实影响日常使用的小摩擦，而不是先追求一个看起来无所不能的桌面。\u003c/p\u003e\n\u003cp\u003e从 Windows 到 Linux，最后值得留下的不是一张“已经彻底迁移”的证明，而是一套下次遇到问题时仍然能接着用、也能逐步修好的工作方式。\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e参考与说明\u003c/h2\u003e\n\u003cp\u003e本文由 AI 辅助整理，依据本人的终端工作台配置与验证记录、文档兼容排错记录及日常开发实践写成，整理日期为 2026-11-17。代码块是经过简化的用法示例，不代表本文对每条命令重新做过现场测试；不公开原始私人文档、会话日志、凭据或未发表研究资料。\u003c/p\u003e\n\u003cp\u003e写作时参考了以下技术博客的讨论方式：从具体需求出发，说明取舍，并保留工具不适用的地方。它们不是本文迁移经历的证据，也不代表作者使用了与我相同的配置。\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003ca href=\"https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans：What\u0026#x27;s involved in getting a “modern” terminal setup?\u003c/a\u003e——把终端体验拆到 Shell、终端模拟器和应用各层，讨论配置之间的牵连。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://drewdevault.com/blog/How-new-Linux-users-succeed/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eDrew DeVault：How new Linux users can increase their odds of success\u003c/a\u003e——讨论迁移时对新系统的预期；这里参考学习不同工作方式的角度，不照搬其中对具体平台的评价。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://karthinks.com/software/more-less-emacs/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eKarthinks：more \u0026lt; less \u0026lt; emacs\u003c/a\u003e——从阅读时一个很小的光标问题写起，解释为什么修改、怎样修改，以及仍然存在的限制。本文没有采用其中的 Emacs 配置代码。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e工具文档：\u003ca href=\"https://help.libreoffice.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eLibreOffice 帮助\u003c/a\u003e、\u003ca href=\"https://neovim.io/doc/user/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eNeovim 手册\u003c/a\u003e、\u003ca href=\"https://www.lazyvim.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eLazyVim 文档\u003c/a\u003e、\u003ca href=\"https://github.com/tmux/tmux/wiki/Getting-Started\" target=\"_blank\" rel=\"noopener noreferrer\"\u003etmux 入门\u003c/a\u003e、\u003ca href=\"https://pi.dev/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003epi\u003c/a\u003e。\u003c/p\u003e",
      "en": "\u003cp\u003e迁移到 Linux 是否成功，不该只看能不能启动桌面。对我来说，更有用的验收题是：拿到一份课件，能不能读；写完一段代码，能不能编译、测试、调试；最后交出去的文档，别人能不能正常打开。\u003c/p\u003e\n\u003cp\u003e这篇记录的是我从 Windows 转向 Linux 日常工作环境后，围绕 LibreOffice、Neovim 和终端 AI 工具 pi 搭起的一套工作台。它不是“一条命令告别 Windows”的教程，也不是一张装满软件图标的截图。比安装了什么更值得记下来的，是这些工具怎样接起来，以及它们在哪里接不上。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先把“完全迁移”说清楚\u003c/h2\u003e\n\u003cp\u003e现在这套工作环境运行在 Ubuntu 26.04 上。开发、文件检索、Git、构建和调试的主线已经放进 Linux，而不是只在 Windows 里偶尔开一个 Linux 终端。\u003c/p\u003e\n\u003cp\u003e但“完全迁移”说的是\u003cstrong\u003e日常工作的重心\u003c/strong\u003e，不是宣称已经删除了磁盘上的所有 Windows 分区，更不是证明每一种 Windows 软件都有替代品。\u003c/p\u003e\n\u003cp\u003e同样，我说的“全终端化”，也不是不用浏览器、不看图片、不打开办公软件。更准确的说法是：\u003cstrong\u003e尽可能从终端进入任务，让命令、文件和结果能够连成一条可追踪的路径；确实需要图形界面时，就正常使用它。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e这两句话听起来不够激进，却能省去很多为了证明“纯粹”而制造的麻烦。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003eLibreOffice：能打开，只是第一关\u003c/h2\u003e\n\u003cp\u003e代码可以换编辑器，协作文档却不能要求所有人跟着换格式。讲义、报告和演示文稿仍然会以 DOCX、PPTX 的形式出现。迁移首先得接住这些真实任务。\u003c/p\u003e\n\u003cp\u003eLibreOffice 在这里负责文档和演示文稿的阅读、编辑与导出，但我不会把“支持这个扩展名”理解成“与 Microsoft Office 完全一致”。字体、公式、分页、动画和嵌入对象都可能成为差异来源。能读到文字，与适合交付，是两种不同的验收。\u003c/p\u003e\n\u003cp\u003e11 月 16 日就有一次很具体的提醒：一份 PPTX 打不开。\u003c/p\u003e\n\u003cp\u003e最初看上去像是办公软件出了问题，但排查时，其他演示文稿能够正常打开，问题收敛到了这份文件本身。最后定位到它内部文件索引的写法与 LibreOffice 的兼容问题；规范索引后，修复副本的 26 页都能读取，窗口也正常打开。原文件保留，文字、图片和视频资源没有改动。\u003c/p\u003e\n\u003cp\u003e这件事不能推出“以后所有 PPT 都没问题”，也不证明每一页的动画和排版已经与 PowerPoint 逐项一致。它说明的是另一个更实用的习惯：\u003cstrong\u003e先分清是程序普遍失效，还是某一份输入触发了问题；修复副本，不拿原件冒险。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e文档处理也有适合交给命令行的部分。比如下面是一个简化的 PDF 导出示例，需先准备好自己的 \u003ccode\u003ereport.docx\u003c/code\u003e，导出后仍要打开检查：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003emkdir -p export\nlibreoffice --headless --convert-to pdf \\\n  --outdir ./export ./report.docx\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这只是命令用法，不是本文重新做过的一次格式兼容测试。导出命令退出，并不替代对分页、字体和公式的目视检查。需要共同编辑时按约定交源文件，需要固定阅读版时再附 PDF；PDF 也不能反过来代替可编辑原稿。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003eNeovim：先接通反馈回路，再记快捷键\u003c/h2\u003e\n\u003cp\u003e我的编辑环境是 Neovim 加 LazyVim，接入 C/C++、Python、Shell、Lua、JSON 和 Markdown 的相关工具。文件搜索、项目内检索、定义跳转、诊断、格式化和终端入口都围绕项目目录组织。\u003c/p\u003e\n\u003cp\u003e这套配置里有一个刻意保留的选择：\u003cstrong\u003e默认不在保存时自动格式化。\u003c/strong\u003e 需要时手动触发，避免刚接手一个项目，就因为保存文件产生一大块与任务无关的格式差异。\u003c/p\u003e\n\u003cp\u003e不过，编辑器能补全，不代表项目能编译；没有红色波浪线，也不代表程序正确。终端工作流真正重要的部分，是把编辑之后的反馈接回来。\u003c/p\u003e\n\u003cp\u003e以一个已配置好测试的 CMake 项目为例，可以把流程写成下面这样。它是通用示例，不是对任意工程都适用的安装脚本：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ecmake -S . -B build -G Ninja \\\n  -DCMAKE_BUILD_TYPE=Debug \\\n  -DCMAKE_EXPORT_COMPILE_COMMANDS=ON\ncmake --build build\nctest --test-dir build --output-on-failure\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e\u003ccode\u003ecompile_commands.json\u003c/code\u003e 把编译参数提供给 clangd，让语言服务更接近真实构建环境；Debug 构建则为后面的 GDB 调试保留必要信息。工程本身的依赖、编译器和测试配置，仍然要另外准备。\u003c/p\u003e\n\u003cp\u003e还有一个看似基础、实际上必须分清的问题：\u003cstrong\u003e眼前是哪一种提示符？\u003c/strong\u003e\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e在 Shell 里输入 \u003ccode\u003ecmake\u003c/code\u003e、\u003ccode\u003egit\u003c/code\u003e、\u003ccode\u003epython3\u003c/code\u003e。\u003c/li\u003e\u003cli\u003e在 Neovim 普通模式里，用 \u003ccode\u003e:w\u003c/code\u003e 保存，按 \u003ccode\u003ei\u003c/code\u003e 进入输入模式。\u003c/li\u003e\u003cli\u003e进入 GDB 后，在它的提示符里输入断点、运行和查看变量的命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e把几个窗口都放进终端，不会让它们变成同一种语言。先知道自己在和谁说话，比背下一整页快捷键更有用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e终端工作台不是一个软件\u003c/h2\u003e\n\u003cp\u003eNeovim 不需要承担所有任务。我把其他事情分给更小的工具：\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003etmux\u003c/strong\u003e 管会话、窗口和分屏，让编辑、编译和 AI 对话可以并排放着。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eYazi\u003c/strong\u003e 管文件；配置过的 \u003ccode\u003ey\u003c/code\u003e 函数还能在退出后把 Shell 切到选中的目录。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eripgrep、fd、fzf、zoxide\u003c/strong\u003e 分别帮助搜索内容、查文件、模糊选择和跳到访问过的目录。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003elazygit\u003c/strong\u003e 用文字界面查看暂存区、差异和提交，不要求每一步都靠手敲长命令。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ebtop\u003c/strong\u003e 看资源与进程；排错时再按需使用系统日志和其他命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e它们的价值不是“比图形软件更有黑客感”，而是可以围绕同一个目录工作，不必不断重新告诉每个工具：项目在哪里，刚才改了什么。\u003c/p\u003e\n\u003cp\u003e我还把重复动作收成了几个自己的入口：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ework .      # 创建或接回当前项目的 tmux 会话\nv .         # 用 Neovim 打开项目\ny           # 用 Yazi 浏览，退出后回到选中目录\nlg          # 打开 lazygit\ntermhelp    # 查看自己的工作台速查表\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这里的 \u003ccode\u003ework\u003c/code\u003e、\u003ccode\u003ev\u003c/code\u003e、\u003ccode\u003ey\u003c/code\u003e、\u003ccode\u003elg\u003c/code\u003e 和 \u003ccode\u003etermhelp\u003c/code\u003e 是本机脚本、函数或别名，\u003cstrong\u003e不是装上 Linux 就有的标准命令\u003c/strong\u003e。对一个刚迁移的人，把这些区别写清楚，比展示一段无法直接复现的终端录像更有帮助。\u003c/p\u003e\n\u003cp\u003etmux 也不是任务永生器。退出客户端后，只要服务器和相关进程仍在，会话就可以接回；注销、关机或重启则可能终止它们。该保存的文件、该落盘的任务状态，不能交给“窗口还在”这件事来保证。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e一次图片预览，把边界暴露出来\u003c/h2\u003e\n\u003cp\u003e我确实尝试过让 Neovim 读的不只是代码。\u003c/p\u003e\n\u003cp\u003eDOCX 可以借助 \u003ccode\u003envim-docx\u003c/code\u003e 转为 Markdown 内容视图，配合渲染插件看正文、标题和表格。快速读材料时很方便，但这不是 Word 页面预览，不会精确复现分页、页眉页脚和复杂版式。\u003c/p\u003e\n\u003cp\u003e而且它不是绝对只读：只打开阅读不会改写原文件，编辑后执行 \u003ccode\u003e:w\u003c/code\u003e 却可能写回 DOCX。重要文档应先留副本；要核对最终排版，仍然回到办公软件或导出的 PDF。\u003c/p\u003e\n\u003cp\u003e图片则暴露了终端模拟器之间的差别。Kitty 可以内嵌原图；我使用的 Ptyxis / VTE 环境不支持相同的图像显示路径。最后的处理不是继续把二进制当文本打开，也不是强行宣称“任何终端都能看图”，而是让 Neovim 调用系统图片查看器，自己留下不可编辑的提示缓冲区。\u003c/p\u003e\n\u003cp\u003e这一步用了图形界面，却让工作流更可靠。\u003cstrong\u003e从终端发起，与最终以文字界面呈现，是两回事。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003ePDF 也有类似边界：\u003ccode\u003epdftotext\u003c/code\u003e 适合提取有文字层的内容，不负责复原所有视觉布局；扫描件需要 OCR，公式和图表更不能只看提取出的文字就下结论。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e把 AI 接进 pi，而不是反复搬运代码\u003c/h2\u003e\n\u003cp\u003e终端工作台搭好后，AI 也不必一直待在另一个聊天网页里。\u003c/p\u003e\n\u003cp\u003e我使用 pi 作为终端里的 AI 编码助手。进入项目目录后启动它，让对话围绕实际文件、命令输出和修改差异展开；Neovim 留着编辑，旁边的终端可以构建测试，另一个窗口放 pi。\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003e# 先在 Shell 中进入要处理的项目目录\npi\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e模型与访问凭据需要预先配置。pi 本身不是模型，也不是“装好就免费获得无限 AI”；它连接什么服务、发送什么上下文、如何计费，取决于实际配置。这里不公开个人接口、令牌或账号配置。\u003c/p\u003e\n\u003cp\u003e对学习任务，我更愿意把协作范围说得具体一些。下面是一种提示方式，不是某次对话的逐字摘录：\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e先读构建配置和失败日志，解释报错的原因。暂时不要修改代码。给我一个最小验证步骤，我自己在 Neovim 里改完，再检查结果。\u003c/p\u003e\u003c/blockquote\u003e\n\u003cp\u003e也可以把任务限制为阅读差异、检查测试覆盖或整理文档。重点不是让助手替我完成一切，而是让它进入已有的反馈回路，而不是另外制造一份脱离项目的答案。\u003c/p\u003e\n\u003cp\u003e这里也有不能省略的安全边界：\u003cstrong\u003e能执行命令，不等于命令安全。\u003c/strong\u003e pi 不会因为运行在终端里，就自动替我隔离文件、隐藏密钥或阻止破坏性操作。第三方模型服务还可能接收到任务所需的代码与上下文，因此应限制工作目录、工具权限和可发送资料，敏感内容另行处理。\u003c/p\u003e\n\u003cp\u003e修改后仍然看 \u003ccode\u003egit diff\u003c/code\u003e，该跑的测试自己确认；涉及删除、安装、提交、推送或部署时明确范围。AI 的解释可以是线索，真正的验收仍然来自可检查的文件和执行结果。\u003c/p\u003e\n\u003cp\u003e顺便说一句，这些工具并不都专属于 Linux。Windows 同样可以有终端、Neovim 和 AI 助手。迁移的价值，不需要靠否认另一套系统的能力来成立。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e装好了之后，还有哪些没测过？\u003c/h2\u003e\n\u003cp\u003e装好一套工具以后，很容易把“程序启动了”当成结束。10 月 14 日的工作台记录里，我留下了更细的检查：编辑器行为 27 项、终端行为 13 项通过，实际走过语言服务、搜索、编译、测试和会话恢复等路径。这些数字的用途，是让我知道当时究竟检查了什么，不是给桌面打分。\u003c/p\u003e\n\u003cp\u003e同一份记录也留下了没检查完的事情：健康检查里仍有可选预览和运行时提示；剪贴板提供者可用，但没有覆盖当时的剪贴板做往返测试；也没有做重启验收。之后补上图片预览，并不意味着其他提示自然消失。\u003c/p\u003e\n\u003cp\u003e这些留白应该和成功记录一起保留。否则，几周后面对一次失败，很容易把“我记得装好了”误当成“这个路径确实测过”。\u003c/p\u003e\n\u003cp\u003e配置本身也需要维护：保留 Neovim 的插件锁文件，修改前备份相关配置，尽量一次改变一件事。若要把 dotfiles 放进公开仓库，先挑选并检查文件，而不是把整个配置目录连同凭据和私人路径一起上传。\u003c/p\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e迁移真正留下了什么\u003c/h2\u003e\n\u003cp\u003e这套环境并没有让所有事情都变简单。办公格式要复核，终端能力有差异，插件会变化，AI 也会出错。终端化不是消灭这些问题，而是让更多问题有一个可以定位的入口。\u003c/p\u003e\n\u003cp\u003e现在，一项开发任务可以沿着同一条路径走下去：找到目录，读文件，编辑，构建，测试，看差异，记录结果。需要帮助时，pi 加进来；需要看排版时，LibreOffice 加进来。它们不必互相取代。\u003c/p\u003e\n\u003cp\u003e如果重新整理迁移顺序，我会先保住文档交付和基本开发，再接通检索、会话与版本管理，最后处理那些确实影响日常使用的小摩擦，而不是先追求一个看起来无所不能的桌面。\u003c/p\u003e\n\u003cp\u003e从 Windows 到 Linux，最后值得留下的不是一张“已经彻底迁移”的证明，而是一套下次遇到问题时仍然能接着用、也能逐步修好的工作方式。\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e参考与说明\u003c/h2\u003e\n\u003cp\u003e本文由 AI 辅助整理，依据本人的终端工作台配置与验证记录、文档兼容排错记录及日常开发实践写成，整理日期为 2026-11-17。代码块是经过简化的用法示例，不代表本文对每条命令重新做过现场测试；不公开原始私人文档、会话日志、凭据或未发表研究资料。\u003c/p\u003e\n\u003cp\u003e写作时参考了以下技术博客的讨论方式：从具体需求出发，说明取舍，并保留工具不适用的地方。它们不是本文迁移经历的证据，也不代表作者使用了与我相同的配置。\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003ca href=\"https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans：What\u0026#x27;s involved in getting a “modern” terminal setup?\u003c/a\u003e——把终端体验拆到 Shell、终端模拟器和应用各层，讨论配置之间的牵连。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://drewdevault.com/blog/How-new-Linux-users-succeed/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eDrew DeVault：How new Linux users can increase their odds of success\u003c/a\u003e——讨论迁移时对新系统的预期；这里参考学习不同工作方式的角度，不照搬其中对具体平台的评价。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://karthinks.com/software/more-less-emacs/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eKarthinks：more \u0026lt; less \u0026lt; emacs\u003c/a\u003e——从阅读时一个很小的光标问题写起，解释为什么修改、怎样修改，以及仍然存在的限制。本文没有采用其中的 Emacs 配置代码。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e工具文档：\u003ca href=\"https://help.libreoffice.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eLibreOffice 帮助\u003c/a\u003e、\u003ca href=\"https://neovim.io/doc/user/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eNeovim 手册\u003c/a\u003e、\u003ca href=\"https://www.lazyvim.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eLazyVim 文档\u003c/a\u003e、\u003ca href=\"https://github.com/tmux/tmux/wiki/Getting-Started\" target=\"_blank\" rel=\"noopener noreferrer\"\u003etmux 入门\u003c/a\u003e、\u003ca href=\"https://pi.dev/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003epi\u003c/a\u003e。\u003c/p\u003e"
    },
    "toc": {
      "zh": [
        {
          "id": "post-heading-1",
          "title": "先把“完全迁移”说清楚",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "LibreOffice：能打开，只是第一关",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "Neovim：先接通反馈回路，再记快捷键",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "终端工作台不是一个软件",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "一次图片预览，把边界暴露出来",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "把 AI 接进 pi，而不是反复搬运代码",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "装好了之后，还有哪些没测过？",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "迁移真正留下了什么",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "参考与说明",
          "level": 2
        }
      ],
      "en": [
        {
          "id": "post-heading-1",
          "title": "先把“完全迁移”说清楚",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "LibreOffice：能打开，只是第一关",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "Neovim：先接通反馈回路，再记快捷键",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "终端工作台不是一个软件",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "一次图片预览，把边界暴露出来",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "把 AI 接进 pi，而不是反复搬运代码",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "装好了之后，还有哪些没测过？",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "迁移真正留下了什么",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "参考与说明",
          "level": 2
        }
      ]
    }
  },
  {
    "id": "tor-onion-field-notes",
    "languages": [
      "zh"
    ],
    "minutes": 9,
    "date": "2026-11-15",
    "layout": "visual-story",
    "cover": "assets/images/posts/tor/cover.webp",
    "title": {
      "zh": "给 Tor 接上代理以后：连通、断线和一个没解决的搜索问题",
      "en": "给 Tor 接上代理以后：连通、断线和一个没解决的搜索问题"
    },
    "summary": {
      "zh": "Clash 连上了，为什么还要检查 Tor 的路径？从一次实际配置出发，记录断线时的退路、五个洋葱站点的等待，以及默认搜索设置与眼前页面不一致的排错过程。",
      "en": "Clash 连上了，为什么还要检查 Tor 的路径？从一次实际配置出发，记录断线时的退路、五个洋葱站点的等待，以及默认搜索设置与眼前页面不一致的排错过程。"
    },
    "category": {
      "zh": "网络 · 可视化实测",
      "en": "网络 · 可视化实测"
    },
    "html": {
      "zh": "\u003cp\u003e给 Tor 接上代理，最容易检查的是“网页能不能打开”。但一个能打开的网页，回答不了我真正想确认的几个问题：它是不是经过了 Tor？代理断掉以后，会不会偷偷换一条路？设置里写着 Ahmia，为什么眼前的搜索框还是 DuckDuckGo？\u003c/p\u003e\n\u003cp\u003e这篇写的是 2026 年 11 月 14 日那次配置与浏览器实测。它不是一份到处都适用的匿名上网配方，而是把一套具体环境拆开看：哪些地方接通了，怎样确认的，还有哪里没解决。\u003c/p\u003e\n\u003cp\u003e文中的图帮助解释路径；真正的结果仍然以当时的运行记录和页面证据为准。本文由 AI 辅助整理，概念插画是生成图，不把它们当作实验截图。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先确定要去哪里，再讨论怎样过去\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/web-layers.svg\" alt=\"深网、暗网与公开网页的概念图：深网包含私人邮箱和登录系统；暗网只是特殊网络中的部分内容；示意不按规模比例绘制。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次要验证的是 Tor 和几个公开的洋葱服务首页，不是搜集一份“神秘网站大全”。先把几个容易混在一起的词拆开，后面的测试才不会变成自说自话。\u003c/p\u003e\n\u003cp\u003e私人邮箱、登录后的云盘和内部数据库不能被搜索引擎直接索引，也属于通常所说的 \u003cstrong\u003edeep web\u003c/strong\u003e，并没有因此变成暗网。\u003cstrong\u003edark web\u003c/strong\u003e 强调通过特定网络或软件访问；Tor 的 \u003ccode\u003e.onion\u003c/code\u003e 是一种例子。\u003c/p\u003e\n\u003cp\u003eTor Browser 还能打开普通 HTTPS 网站。所以，“我用 Tor 打开了一个页面”和“我打开了一个洋葱服务”不是同一项结果。后面有一个只打开了公网首页的观察，我没有把它算进洋葱站点的通过名单。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e网页打开了，究竟是谁看见了请求？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-routing.svg\" alt=\"普通 HTTPS 网站的典型 Tor 电路：浏览器经入口守卫、中继和出口到达网站。各节点掌握的信息不同，HTTPS 另在应用层保护传输内容。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e要判断有没有“走对路”，至少得知道这条路长什么样。\u003c/p\u003e\n\u003cp\u003e访问普通网站时，典型 Tor 电路经过入口守卫、中继和出口。不同跳处理不同层的保护，通常单个中继不会同时掌握通信的真实来源与最终目标。图里画的是这种常规路径，不是所有攻击情形的安全证明。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003e直接连入口时，入口知道连接来源；出口知道访问目标。\u003c/strong\u003e 如果目标网站没有 HTTPS，出口到网站之间的内容还可能暴露。HTTPS 是另一层保护，不能因为用了 Tor 就省掉。\u003c/p\u003e\n\u003cp\u003e我在这里关心的不是“是不是多套了一层”，而是那一层改变了谁能看见什么。只有先分清这些角色，才有办法讨论后面加进去的 Clash。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e洋葱服务没有那个普通出口\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/rendezvous-art.webp\" alt=\"概念插画：访问者与服务端各自穿过柔和的玻璃环，在中央会合。此图只表达会合的意象，不表示协议节点数量。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-rendezvous.svg\" alt=\"洋葱服务简化协议图：先通过服务描述符和介绍点建立联系，访问者与服务端各自建立电路，在会合点交换数据，不经过普通出口节点。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e如果访问的是 \u003ccode\u003e.onion\u003c/code\u003e，前一张图就不能直接照搬。\u003c/p\u003e\n\u003cp\u003e客户端先读取服务描述符，经介绍点传递会合信息；随后客户端和服务端分别建立电路，在 \u003cstrong\u003erendezvous point（会合点）\u003c/strong\u003e 连接起来。介绍点负责前面的联系，会合点负责后面的连接，它们不是同一个角色。\u003c/p\u003e\n\u003cp\u003e这个过程不需要先从普通 Tor 出口回到公网，再寻找一台“藏起来的服务器”。所以，讨论洋葱服务时，我不能再用“把出口也套进本机代理”这种说法。\u003c/p\u003e\n\u003cp\u003e上面的玻璃环是会合的视觉比喻，下面的线路图才负责说明流程；都没有把省略掉的密钥协商细节冒充成完整协议。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003eClash 要接在 Tor 前面，不是替换浏览器代理\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次实验的连接链：浏览器保留本地 Tor 代理，本地 Tor 经受限转发连接 Clash，再经过加密代理节点进入 Tor；网站仍看到 Tor 出口。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次采用的顺序是：\u003cstrong\u003e浏览器 → 本地 Tor → Clash 的专用代理通道 → 远端代理节点 → Tor 网络\u003c/strong\u003e。访问普通网站时，后面再接 Tor 出口与网站；访问洋葱服务时，则走前面说的会合流程。\u003c/p\u003e\n\u003cp\u003e这里有一个很容易配错的位置：我没有把浏览器的网页代理直接换成 Clash。那样虽然也可能打开普通网页，却可能把 Tor 整段绕过去。\u003c/p\u003e\n\u003cp\u003e另一个要检查的是规则。Clash 是代理和规则处理工具，不等于某一种 VPN 协议；填入本机代理端口，也不能证明请求一定去了远端代理节点，规则里可能还有 \u003ccode\u003eDIRECT\u003c/code\u003e。这次为 Tor 单独建立了不含直连选项的通道。\u003c/p\u003e\n\u003cp\u003e这样改动的是进入 Tor 之前的一段：入口看到的来源可以变成代理节点，但代理服务方仍可能知道用户的连接来源。信任没有消失，只是换了位置；多一跳也不保证更快。\u003c/p\u003e\n\u003cp\u003e这不是我推荐所有人照抄的固定组合。\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 官方关于 VPN 的说明\u003c/a\u003e同样提醒，应先理解自己的威胁模型，再决定是否组合使用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e我更想知道的是：断掉以后会怎样？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"概念插画：一条细光线穿过玻璃桥上的门，旁边的门保持关闭。表达代理失效就停止，而不是寻找不安全捷径。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e连通时的路径检查，只完成了一半。真正容易被忽略的是错误处理：指定代理不可用以后，程序是停下来，还是换成直连继续工作？\u003c/p\u003e\n\u003cp\u003e这次采用的是 \u003cstrong\u003efail closed：失败就停止\u003c/strong\u003e。在指定启动方式下，浏览器和 Tor 位于仅有回环接口、没有外网路由的网络命名空间里，只留下通往专用 Clash 通道的受限转发。\u003c/p\u003e\n\u003cp\u003e当时的直接 IPv4、IPv6 和 DNS/UDP 探测都被拒绝，代理失效模拟也没有回退直连。这些观察支持的是：\u003cstrong\u003e这套启动路径有降低误配置直连风险的约束\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e它没有覆盖其他应用，也没有覆盖绕过这个启动方式打开的程序。下载文件若交给外部阅读器，已经是另一个边界；软件或配置更新之后，也需要重新检查。几项探测通过，不能变成“这台电脑从此绝不泄漏”的保证。\u003c/p\u003e\n\u003cp\u003e这张门的插画想表达的只有一件事：既然要求不走别的路，出错时就不该悄悄把另一扇门打开。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e五个站点都打开了，但等待不能混着算\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"本次实际 Tor Browser 页面截图拼图：Riseup、Tor Metrics、Ahmia、Tor Project 与 SecureDrop 均显示正常正文并返回 HTTP 200。截图不是生成插画。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"五站首次验收耗时图：Riseup约13秒，Tor Metrics约17秒，Ahmia首页约28秒；Tor Project和SecureDrop首次超过45秒后续复测通过。复测缓存时间不能当作首次速度。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e路径检查之后，才轮到网页本身。不能看到 SOCKS 握手就宣布“网站正常”；这次在安装的 Tor Browser 里实际打开页面，核对正文、页面状态、HTTP 200 和截图。\u003c/p\u003e\n\u003cp\u003e最终确认的五个洋葱服务是 \u003cstrong\u003eRiseup、Tor Metrics、Ahmia、Tor Project 和 SecureDrop\u003c/strong\u003e。地址来自相应公开官网或 \u003ccode\u003eOnion-Location\u003c/code\u003e，没有靠猜同名镜像凑数。\u003c/p\u003e\n\u003cp\u003e首次验收记录里，Riseup 约 \u003cstrong\u003e13 秒\u003c/strong\u003e，Tor Metrics 约 \u003cstrong\u003e17 秒\u003c/strong\u003e，Ahmia 首页约 \u003cstrong\u003e28 秒\u003c/strong\u003e。Tor Project 和 SecureDrop 则先超过了 \u003cstrong\u003e45 秒\u003c/strong\u003e，之后复测才显示正常正文。\u003c/p\u003e\n\u003cp\u003e后两者还有热缓存下的 \u003cstrong\u003e0.37 秒和 3.52 秒\u003c/strong\u003e。这些数字如果只挑最漂亮的摆出来，很像一次巨大的提速；但它们不能和前面的首次打开公平比较。代理测速、Tor 建路和网页检查也不是同一种计时。\u003c/p\u003e\n\u003cp\u003e因此，我只把它们当作一次环境中的单次观察，不当作 Tor 的统计基准，更不许诺这些站点会一直在线。\u003c/p\u003e\n\u003cp\u003e失败的部分也留着：ZeroBin 的公网首页能经 Tor 打开，但它公布的 v3 onion 地址返回了\u003cstrong\u003e服务描述符未找到\u003c/strong\u003e。Sci-Hub 只验证了公网首页，没有检索或下载资料，因此不算洋葱服务通过。其他没能核实当前地址的名称，也不写进成功名单。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e“为什么还是 DuckDuckGo？”这个反馈没有错\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"两个搜索框的区别：地址栏默认引擎已经是Ahmia，但该版本Tor内置主页仍单独使用DuckDuckGo；另有Ahmia查询返回首页的未解决问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次最值得留下的一段排错，是一个看起来很小的界面问题：默认搜索引擎已经改成 Ahmia，眼前怎么还是 DuckDuckGo？\u003c/p\u003e\n\u003cp\u003e问题出在“默认搜索引擎”不负责我看到的所有搜索框。该版本 Tor 的内置欢迎页有独立实现，不跟随地址栏的引擎设置。只读配置文件，会以为已经改完；真正打开页面，才会发现用户反馈说的是另一个入口。\u003c/p\u003e\n\u003cp\u003e后来从运行中的浏览器内部确认，普通和隐私搜索引擎都已是 \u003cstrong\u003eAhmia\u003c/strong\u003e，再把主页改为 Ahmia，新标签页改为空白，避开那个独立的欢迎页搜索框。界面和网页语言偏好统一为 \u003cstrong\u003eEnglish (US)\u003c/strong\u003e，没有用堆扩展的方式改造浏览器。\u003c/p\u003e\n\u003cp\u003e但这不是一个可以写成“全部解决”的结尾。\u003c/p\u003e\n\u003cp\u003eAhmia 的测试查询和正常表单提交都回到了首页，没有验证到正常搜索结果。我没有足够证据断定原因一定在本机或站点端。最后能留下的结论只有：\u003cstrong\u003e引擎设置已生效，搜索功能未完全验收。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e能打开首页，不等于能用它搜索。把这个未完成状态写下来，比再截一张首页然后宣布成功更有用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e配置记录的价值，不是一句“绝对匿名”\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"隐私边界图：代理失效应该停止；隔离仅覆盖指定启动方式；真实身份登录、漏洞、恶意软件与流量关联仍需考虑，不能许诺绝对匿名。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e回头看，这次配置其实包含好几件不同的事：把 Tor 接到指定代理、限制失败时的退路、核实洋葱地址、等待真实页面，再处理浏览器界面与设置不一致的问题。\u003c/p\u003e\n\u003cp\u003e把它们统称为“配置成功”太粗了。下一次出问题时，我更需要知道的是：哪一段测过，测试看到的是什么，哪些结论并没有被证明。\u003c/p\u003e\n\u003cp\u003eEnglish (US) 和保留标准抗指纹配置，可以朝减少与常见用户差异的方向走，但并不是单独的匿名保证。真实身份登录、外部程序打开文件、浏览器漏洞、恶意软件和流量关联，仍然需要另外考虑。\u003c/p\u003e\n\u003cp\u003e所以这篇不是教人通过“多套几层”获得隐身能力。它更像给以后排错的自己留的一张路线图：这里接通了；这里断开后确实停了；这里还卡着，别把它忘掉。\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e资料、方法与这次修订\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003e时间\u003c/strong\u003e：配置与浏览器验收发生于 2026-11-14，文章初次发布于 2026-11-15，2026-11-17 按个人技术手记的方式重新组织叙事。此次修订没有重跑 Tor 测试，不把旧记录说成今天的网络状态。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e范围\u003c/strong\u003e：只验证公开首页，不登录、不提交匿名文件、不创建粘贴、不下载论文或书籍。加载耗时是单次验收记录，缓存复测另记。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eAI 与图像\u003c/strong\u003e：本文为 AI 辅助学习记录。封面、会合场景和门的意象由 \u003ccode\u003egpt-image-2.6\u003c/code\u003e 原创生成，不是拓扑或实验凭证；线路与数据图为独立制作的 SVG，不展示个人 IP、本机端口和代理节点信息。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e真实截图\u003c/strong\u003e：五站拼图来自当时的浏览器页面，不含账号、书签、地址栏和个人网络信息。各站页面内容、标志与设计归相应权利人，仅作有限技术说明。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e测试收尾\u003c/strong\u003e：当时测试结束后关闭临时控制服务、恢复临时推荐设置，保留正常窗口与原有抗指纹、本地 DNS 禁用、WebRTC 禁用和不回退直连设置。这不是完整安全审计。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e协议与使用边界的依据仍然来自 Tor 官方资料，而不是其他博客的个人经验：\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor Browser 如何工作\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：洋葱服务\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor 与 VPN 的常见问题\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/features/plugins/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：关于安装浏览器扩展\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://riseup.net/en/security/network-security/tor\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eRiseup：Tor 与网络安全\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://metrics.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Metrics\u003c/a\u003e、\u003ca href=\"https://ahmia.fi/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eAhmia\u003c/a\u003e、\u003ca href=\"https://www.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project\u003c/a\u003e、\u003ca href=\"https://securedrop.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eSecureDrop\u003c/a\u003e\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e写作时还读了 \u003ca href=\"https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans 的 A debugging manifesto\u003c/a\u003e。它讨论先观察问题、再修复的排错习惯；这里把它列为延伸阅读，不把作者的经历当作本次实测的证据。\u003c/p\u003e\n\u003cp\u003e这是 \u003ccode\u003ezengzimo.cn\u003c/code\u003e 的第一篇正式文章。修改的是讲述方式，原先的成功、超时和未解决问题都留在这里。\u003c/p\u003e",
      "en": "\u003cp\u003e给 Tor 接上代理，最容易检查的是“网页能不能打开”。但一个能打开的网页，回答不了我真正想确认的几个问题：它是不是经过了 Tor？代理断掉以后，会不会偷偷换一条路？设置里写着 Ahmia，为什么眼前的搜索框还是 DuckDuckGo？\u003c/p\u003e\n\u003cp\u003e这篇写的是 2026 年 11 月 14 日那次配置与浏览器实测。它不是一份到处都适用的匿名上网配方，而是把一套具体环境拆开看：哪些地方接通了，怎样确认的，还有哪里没解决。\u003c/p\u003e\n\u003cp\u003e文中的图帮助解释路径；真正的结果仍然以当时的运行记录和页面证据为准。本文由 AI 辅助整理，概念插画是生成图，不把它们当作实验截图。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先确定要去哪里，再讨论怎样过去\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/web-layers.svg\" alt=\"深网、暗网与公开网页的概念图：深网包含私人邮箱和登录系统；暗网只是特殊网络中的部分内容；示意不按规模比例绘制。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次要验证的是 Tor 和几个公开的洋葱服务首页，不是搜集一份“神秘网站大全”。先把几个容易混在一起的词拆开，后面的测试才不会变成自说自话。\u003c/p\u003e\n\u003cp\u003e私人邮箱、登录后的云盘和内部数据库不能被搜索引擎直接索引，也属于通常所说的 \u003cstrong\u003edeep web\u003c/strong\u003e，并没有因此变成暗网。\u003cstrong\u003edark web\u003c/strong\u003e 强调通过特定网络或软件访问；Tor 的 \u003ccode\u003e.onion\u003c/code\u003e 是一种例子。\u003c/p\u003e\n\u003cp\u003eTor Browser 还能打开普通 HTTPS 网站。所以，“我用 Tor 打开了一个页面”和“我打开了一个洋葱服务”不是同一项结果。后面有一个只打开了公网首页的观察，我没有把它算进洋葱站点的通过名单。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e网页打开了，究竟是谁看见了请求？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-routing.svg\" alt=\"普通 HTTPS 网站的典型 Tor 电路：浏览器经入口守卫、中继和出口到达网站。各节点掌握的信息不同，HTTPS 另在应用层保护传输内容。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e要判断有没有“走对路”，至少得知道这条路长什么样。\u003c/p\u003e\n\u003cp\u003e访问普通网站时，典型 Tor 电路经过入口守卫、中继和出口。不同跳处理不同层的保护，通常单个中继不会同时掌握通信的真实来源与最终目标。图里画的是这种常规路径，不是所有攻击情形的安全证明。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003e直接连入口时，入口知道连接来源；出口知道访问目标。\u003c/strong\u003e 如果目标网站没有 HTTPS，出口到网站之间的内容还可能暴露。HTTPS 是另一层保护，不能因为用了 Tor 就省掉。\u003c/p\u003e\n\u003cp\u003e我在这里关心的不是“是不是多套了一层”，而是那一层改变了谁能看见什么。只有先分清这些角色，才有办法讨论后面加进去的 Clash。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e洋葱服务没有那个普通出口\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/rendezvous-art.webp\" alt=\"概念插画：访问者与服务端各自穿过柔和的玻璃环，在中央会合。此图只表达会合的意象，不表示协议节点数量。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-rendezvous.svg\" alt=\"洋葱服务简化协议图：先通过服务描述符和介绍点建立联系，访问者与服务端各自建立电路，在会合点交换数据，不经过普通出口节点。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e如果访问的是 \u003ccode\u003e.onion\u003c/code\u003e，前一张图就不能直接照搬。\u003c/p\u003e\n\u003cp\u003e客户端先读取服务描述符，经介绍点传递会合信息；随后客户端和服务端分别建立电路，在 \u003cstrong\u003erendezvous point（会合点）\u003c/strong\u003e 连接起来。介绍点负责前面的联系，会合点负责后面的连接，它们不是同一个角色。\u003c/p\u003e\n\u003cp\u003e这个过程不需要先从普通 Tor 出口回到公网，再寻找一台“藏起来的服务器”。所以，讨论洋葱服务时，我不能再用“把出口也套进本机代理”这种说法。\u003c/p\u003e\n\u003cp\u003e上面的玻璃环是会合的视觉比喻，下面的线路图才负责说明流程；都没有把省略掉的密钥协商细节冒充成完整协议。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003eClash 要接在 Tor 前面，不是替换浏览器代理\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次实验的连接链：浏览器保留本地 Tor 代理，本地 Tor 经受限转发连接 Clash，再经过加密代理节点进入 Tor；网站仍看到 Tor 出口。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次采用的顺序是：\u003cstrong\u003e浏览器 → 本地 Tor → Clash 的专用代理通道 → 远端代理节点 → Tor 网络\u003c/strong\u003e。访问普通网站时，后面再接 Tor 出口与网站；访问洋葱服务时，则走前面说的会合流程。\u003c/p\u003e\n\u003cp\u003e这里有一个很容易配错的位置：我没有把浏览器的网页代理直接换成 Clash。那样虽然也可能打开普通网页，却可能把 Tor 整段绕过去。\u003c/p\u003e\n\u003cp\u003e另一个要检查的是规则。Clash 是代理和规则处理工具，不等于某一种 VPN 协议；填入本机代理端口，也不能证明请求一定去了远端代理节点，规则里可能还有 \u003ccode\u003eDIRECT\u003c/code\u003e。这次为 Tor 单独建立了不含直连选项的通道。\u003c/p\u003e\n\u003cp\u003e这样改动的是进入 Tor 之前的一段：入口看到的来源可以变成代理节点，但代理服务方仍可能知道用户的连接来源。信任没有消失，只是换了位置；多一跳也不保证更快。\u003c/p\u003e\n\u003cp\u003e这不是我推荐所有人照抄的固定组合。\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 官方关于 VPN 的说明\u003c/a\u003e同样提醒，应先理解自己的威胁模型，再决定是否组合使用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e我更想知道的是：断掉以后会怎样？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"概念插画：一条细光线穿过玻璃桥上的门，旁边的门保持关闭。表达代理失效就停止，而不是寻找不安全捷径。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e连通时的路径检查，只完成了一半。真正容易被忽略的是错误处理：指定代理不可用以后，程序是停下来，还是换成直连继续工作？\u003c/p\u003e\n\u003cp\u003e这次采用的是 \u003cstrong\u003efail closed：失败就停止\u003c/strong\u003e。在指定启动方式下，浏览器和 Tor 位于仅有回环接口、没有外网路由的网络命名空间里，只留下通往专用 Clash 通道的受限转发。\u003c/p\u003e\n\u003cp\u003e当时的直接 IPv4、IPv6 和 DNS/UDP 探测都被拒绝，代理失效模拟也没有回退直连。这些观察支持的是：\u003cstrong\u003e这套启动路径有降低误配置直连风险的约束\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e它没有覆盖其他应用，也没有覆盖绕过这个启动方式打开的程序。下载文件若交给外部阅读器，已经是另一个边界；软件或配置更新之后，也需要重新检查。几项探测通过，不能变成“这台电脑从此绝不泄漏”的保证。\u003c/p\u003e\n\u003cp\u003e这张门的插画想表达的只有一件事：既然要求不走别的路，出错时就不该悄悄把另一扇门打开。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e五个站点都打开了，但等待不能混着算\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"本次实际 Tor Browser 页面截图拼图：Riseup、Tor Metrics、Ahmia、Tor Project 与 SecureDrop 均显示正常正文并返回 HTTP 200。截图不是生成插画。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"五站首次验收耗时图：Riseup约13秒，Tor Metrics约17秒，Ahmia首页约28秒；Tor Project和SecureDrop首次超过45秒后续复测通过。复测缓存时间不能当作首次速度。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e路径检查之后，才轮到网页本身。不能看到 SOCKS 握手就宣布“网站正常”；这次在安装的 Tor Browser 里实际打开页面，核对正文、页面状态、HTTP 200 和截图。\u003c/p\u003e\n\u003cp\u003e最终确认的五个洋葱服务是 \u003cstrong\u003eRiseup、Tor Metrics、Ahmia、Tor Project 和 SecureDrop\u003c/strong\u003e。地址来自相应公开官网或 \u003ccode\u003eOnion-Location\u003c/code\u003e，没有靠猜同名镜像凑数。\u003c/p\u003e\n\u003cp\u003e首次验收记录里，Riseup 约 \u003cstrong\u003e13 秒\u003c/strong\u003e，Tor Metrics 约 \u003cstrong\u003e17 秒\u003c/strong\u003e，Ahmia 首页约 \u003cstrong\u003e28 秒\u003c/strong\u003e。Tor Project 和 SecureDrop 则先超过了 \u003cstrong\u003e45 秒\u003c/strong\u003e，之后复测才显示正常正文。\u003c/p\u003e\n\u003cp\u003e后两者还有热缓存下的 \u003cstrong\u003e0.37 秒和 3.52 秒\u003c/strong\u003e。这些数字如果只挑最漂亮的摆出来，很像一次巨大的提速；但它们不能和前面的首次打开公平比较。代理测速、Tor 建路和网页检查也不是同一种计时。\u003c/p\u003e\n\u003cp\u003e因此，我只把它们当作一次环境中的单次观察，不当作 Tor 的统计基准，更不许诺这些站点会一直在线。\u003c/p\u003e\n\u003cp\u003e失败的部分也留着：ZeroBin 的公网首页能经 Tor 打开，但它公布的 v3 onion 地址返回了\u003cstrong\u003e服务描述符未找到\u003c/strong\u003e。Sci-Hub 只验证了公网首页，没有检索或下载资料，因此不算洋葱服务通过。其他没能核实当前地址的名称，也不写进成功名单。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e“为什么还是 DuckDuckGo？”这个反馈没有错\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"两个搜索框的区别：地址栏默认引擎已经是Ahmia，但该版本Tor内置主页仍单独使用DuckDuckGo；另有Ahmia查询返回首页的未解决问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次最值得留下的一段排错，是一个看起来很小的界面问题：默认搜索引擎已经改成 Ahmia，眼前怎么还是 DuckDuckGo？\u003c/p\u003e\n\u003cp\u003e问题出在“默认搜索引擎”不负责我看到的所有搜索框。该版本 Tor 的内置欢迎页有独立实现，不跟随地址栏的引擎设置。只读配置文件，会以为已经改完；真正打开页面，才会发现用户反馈说的是另一个入口。\u003c/p\u003e\n\u003cp\u003e后来从运行中的浏览器内部确认，普通和隐私搜索引擎都已是 \u003cstrong\u003eAhmia\u003c/strong\u003e，再把主页改为 Ahmia，新标签页改为空白，避开那个独立的欢迎页搜索框。界面和网页语言偏好统一为 \u003cstrong\u003eEnglish (US)\u003c/strong\u003e，没有用堆扩展的方式改造浏览器。\u003c/p\u003e\n\u003cp\u003e但这不是一个可以写成“全部解决”的结尾。\u003c/p\u003e\n\u003cp\u003eAhmia 的测试查询和正常表单提交都回到了首页，没有验证到正常搜索结果。我没有足够证据断定原因一定在本机或站点端。最后能留下的结论只有：\u003cstrong\u003e引擎设置已生效，搜索功能未完全验收。\u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e能打开首页，不等于能用它搜索。把这个未完成状态写下来，比再截一张首页然后宣布成功更有用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e配置记录的价值，不是一句“绝对匿名”\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"隐私边界图：代理失效应该停止；隔离仅覆盖指定启动方式；真实身份登录、漏洞、恶意软件与流量关联仍需考虑，不能许诺绝对匿名。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e回头看，这次配置其实包含好几件不同的事：把 Tor 接到指定代理、限制失败时的退路、核实洋葱地址、等待真实页面，再处理浏览器界面与设置不一致的问题。\u003c/p\u003e\n\u003cp\u003e把它们统称为“配置成功”太粗了。下一次出问题时，我更需要知道的是：哪一段测过，测试看到的是什么，哪些结论并没有被证明。\u003c/p\u003e\n\u003cp\u003eEnglish (US) 和保留标准抗指纹配置，可以朝减少与常见用户差异的方向走，但并不是单独的匿名保证。真实身份登录、外部程序打开文件、浏览器漏洞、恶意软件和流量关联，仍然需要另外考虑。\u003c/p\u003e\n\u003cp\u003e所以这篇不是教人通过“多套几层”获得隐身能力。它更像给以后排错的自己留的一张路线图：这里接通了；这里断开后确实停了；这里还卡着，别把它忘掉。\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e资料、方法与这次修订\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003e时间\u003c/strong\u003e：配置与浏览器验收发生于 2026-11-14，文章初次发布于 2026-11-15，2026-11-17 按个人技术手记的方式重新组织叙事。此次修订没有重跑 Tor 测试，不把旧记录说成今天的网络状态。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e范围\u003c/strong\u003e：只验证公开首页，不登录、不提交匿名文件、不创建粘贴、不下载论文或书籍。加载耗时是单次验收记录，缓存复测另记。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eAI 与图像\u003c/strong\u003e：本文为 AI 辅助学习记录。封面、会合场景和门的意象由 \u003ccode\u003egpt-image-2.6\u003c/code\u003e 原创生成，不是拓扑或实验凭证；线路与数据图为独立制作的 SVG，不展示个人 IP、本机端口和代理节点信息。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e真实截图\u003c/strong\u003e：五站拼图来自当时的浏览器页面，不含账号、书签、地址栏和个人网络信息。各站页面内容、标志与设计归相应权利人，仅作有限技术说明。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e测试收尾\u003c/strong\u003e：当时测试结束后关闭临时控制服务、恢复临时推荐设置，保留正常窗口与原有抗指纹、本地 DNS 禁用、WebRTC 禁用和不回退直连设置。这不是完整安全审计。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e协议与使用边界的依据仍然来自 Tor 官方资料，而不是其他博客的个人经验：\u003c/p\u003e\n\u003cul\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor Browser 如何工作\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：洋葱服务\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor 与 VPN 的常见问题\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/features/plugins/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：关于安装浏览器扩展\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://riseup.net/en/security/network-security/tor\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eRiseup：Tor 与网络安全\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://metrics.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Metrics\u003c/a\u003e、\u003ca href=\"https://ahmia.fi/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eAhmia\u003c/a\u003e、\u003ca href=\"https://www.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project\u003c/a\u003e、\u003ca href=\"https://securedrop.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eSecureDrop\u003c/a\u003e\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e写作时还读了 \u003ca href=\"https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans 的 A debugging manifesto\u003c/a\u003e。它讨论先观察问题、再修复的排错习惯；这里把它列为延伸阅读，不把作者的经历当作本次实测的证据。\u003c/p\u003e\n\u003cp\u003e这是 \u003ccode\u003ezengzimo.cn\u003c/code\u003e 的第一篇正式文章。修改的是讲述方式，原先的成功、超时和未解决问题都留在这里。\u003c/p\u003e"
    },
    "toc": {
      "zh": [
        {
          "id": "post-heading-1",
          "title": "先确定要去哪里，再讨论怎样过去",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "网页打开了，究竟是谁看见了请求？",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "洋葱服务没有那个普通出口",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "Clash 要接在 Tor 前面，不是替换浏览器代理",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "我更想知道的是：断掉以后会怎样？",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "五个站点都打开了，但等待不能混着算",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "“为什么还是 DuckDuckGo？”这个反馈没有错",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "配置记录的价值，不是一句“绝对匿名”",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "资料、方法与这次修订",
          "level": 2
        }
      ],
      "en": [
        {
          "id": "post-heading-1",
          "title": "先确定要去哪里，再讨论怎样过去",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "网页打开了，究竟是谁看见了请求？",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "洋葱服务没有那个普通出口",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "Clash 要接在 Tor 前面，不是替换浏览器代理",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "我更想知道的是：断掉以后会怎样？",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "五个站点都打开了，但等待不能混着算",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "“为什么还是 DuckDuckGo？”这个反馈没有错",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "配置记录的价值，不是一句“绝对匿名”",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "资料、方法与这次修订",
          "level": 2
        }
      ]
    }
  }
];
