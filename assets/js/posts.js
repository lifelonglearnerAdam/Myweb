/* Generated from owner-published posts/*.md. Drafts are never included. */
window.PORTFOLIO.notes = [
  {
    "id": "windows-to-linux-terminal-workflow",
    "languages": [
      "zh"
    ],
    "minutes": 3,
    "date": "2026-11-17",
    "layout": "article",
    "cover": "assets/images/posts/linux/linux-cover-art.webp",
    "title": {
      "zh": "从 Windows 搬到 Linux",
      "en": "从 Windows 搬到 Linux"
    },
    "summary": {
      "zh": "LibreOffice 交文档，Neovim 写代码，pi 放在旁边。主力环境换成了 Ubuntu，事情还是那些事情。",
      "en": "LibreOffice 交文档，Neovim 写代码，pi 放在旁边。主力环境换成了 Ubuntu，事情还是那些事情。"
    },
    "category": {
      "zh": "Linux · 工作台",
      "en": "Linux · 工作台"
    },
    "html": {
      "zh": "\u003cp\u003e现在日常用 Ubuntu。代码、Git、编译和调试基本都在终端里；文档和图片，该开窗口就开窗口。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e文档还得交\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/office-art.webp\" alt=\"内容阅读和页面排版是两条不同的路径：Neovim 读正文，LibreOffice 检查版式并导出 PDF。Image2.6 示意图，不是软件截图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eLibreOffice 接住 DOCX 和 PPTX，Neovim 里的 DOCX 插件用来快速读正文。一个看内容，一个看排版，别混用。\u003c/p\u003e\n\u003cp\u003e上次一份 PPTX 死活打不开，其他文件却正常。最后查到内部索引的兼容问题，规范后，副本的 26 页都能读了。原件没动。\u003c/p\u003e\n\u003cp\u003e能打开，不代表分页、字体和动画都一样。要交的文件，还是打开看一遍。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e一个目录，几个窗格\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/workflow-art.webp\" alt=\"查找、编辑、构建、测试、检查差异的工作流：rg 和 fd、Neovim、CMake、CTest、git diff，pi 在旁辅助。Image2.6 示意图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eNeovim 写，另一个窗格编译，pi 放旁边。tmux 管会话，Yazi 找文件，lazygit 看改动。没必要把每件事都塞成编辑器插件。\u003c/p\u003e\n\u003cp\u003eCMake 项目里，编辑完就回到这几步：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ecmake -S . -B build -G Ninja \\\n  -DCMAKE_EXPORT_COMPILE_COMMANDS=ON\ncmake --build build\nctest --test-dir build --output-on-failure\ngit diff\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这是已有 CMake 项目的用法，依赖和测试要先配好。补全再聪明，最后也得让编译器和测试说话。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003epi 就坐在旁边\u003c/h2\u003e\n\u003cp\u003e在项目目录运行 \u003ccode\u003epi\u003c/code\u003e。读报错、查代码、看差异，省掉来回复制粘贴。\u003c/p\u003e\n\u003cp\u003e学新东西时，我会让它先解释，别急着改。改完看 diff，再跑测试。接的是模型服务，别把密钥和私有材料顺手喂进去。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e看图这件小事\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/preview-art.webp\" alt=\"同一张图片在两种终端里的处理方式：Kitty 内嵌显示，Ptyxis 从编辑器调用外部图片查看器。Image2.6 示意图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eKitty 能内嵌图片，Ptyxis 这套环境不行。后来让 Neovim 直接叫起系统图片查看器，问题就结束了。\u003c/p\u003e\n\u003cp\u003e我想要的是顺手，不是为了“全终端”三个字跟一张 PNG 较劲。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e记在这里\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003etmux 能接回会话，不替你保存文件，也不保证重启后任务还在。\u003c/li\u003e\u003cli\u003eNeovim 不在保存时自动格式化；需要时手动来。\u003c/li\u003e\u003cli\u003e\u003ccode\u003ework\u003c/code\u003e、\u003ccode\u003ev\u003c/code\u003e、\u003ccode\u003ey\u003c/code\u003e 是我自己的脚本、别名或函数，不是 Linux 自带命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e配置还会改。这篇先记现在能用的部分。\u003c/p\u003e\n\u003chr\u003e\n\u003cp\u003eAI 辅助整理。插图：CCSWITCH / Image2.6，均为示意，不是真实终端截图。更细的验证范围见\u003ca href=\"https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/LINUX-WORKFLOW-POST.md\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e内容记录\u003c/a\u003e。\u003c/p\u003e\n\u003cp\u003e读过的好文章：\u003ca href=\"https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans 的终端配置\u003c/a\u003e、\u003ca href=\"https://drewdevault.com/blog/My-weird-branchless-git-workflow/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eDrew DeVault 的 Git 工作流\u003c/a\u003e、\u003ca href=\"https://karthinks.com/software/more-less-emacs/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eKarthinks 的阅读模式\u003c/a\u003e。\u003c/p\u003e",
      "en": "\u003cp\u003e现在日常用 Ubuntu。代码、Git、编译和调试基本都在终端里；文档和图片，该开窗口就开窗口。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e文档还得交\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/office-art.webp\" alt=\"内容阅读和页面排版是两条不同的路径：Neovim 读正文，LibreOffice 检查版式并导出 PDF。Image2.6 示意图，不是软件截图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eLibreOffice 接住 DOCX 和 PPTX，Neovim 里的 DOCX 插件用来快速读正文。一个看内容，一个看排版，别混用。\u003c/p\u003e\n\u003cp\u003e上次一份 PPTX 死活打不开，其他文件却正常。最后查到内部索引的兼容问题，规范后，副本的 26 页都能读了。原件没动。\u003c/p\u003e\n\u003cp\u003e能打开，不代表分页、字体和动画都一样。要交的文件，还是打开看一遍。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e一个目录，几个窗格\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/workflow-art.webp\" alt=\"查找、编辑、构建、测试、检查差异的工作流：rg 和 fd、Neovim、CMake、CTest、git diff，pi 在旁辅助。Image2.6 示意图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eNeovim 写，另一个窗格编译，pi 放旁边。tmux 管会话，Yazi 找文件，lazygit 看改动。没必要把每件事都塞成编辑器插件。\u003c/p\u003e\n\u003cp\u003eCMake 项目里，编辑完就回到这几步：\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003ecmake -S . -B build -G Ninja \\\n  -DCMAKE_EXPORT_COMPILE_COMMANDS=ON\ncmake --build build\nctest --test-dir build --output-on-failure\ngit diff\u003c/code\u003e\u003c/pre\u003e\n\u003cp\u003e这是已有 CMake 项目的用法，依赖和测试要先配好。补全再聪明，最后也得让编译器和测试说话。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003epi 就坐在旁边\u003c/h2\u003e\n\u003cp\u003e在项目目录运行 \u003ccode\u003epi\u003c/code\u003e。读报错、查代码、看差异，省掉来回复制粘贴。\u003c/p\u003e\n\u003cp\u003e学新东西时，我会让它先解释，别急着改。改完看 diff，再跑测试。接的是模型服务，别把密钥和私有材料顺手喂进去。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e看图这件小事\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/linux/preview-art.webp\" alt=\"同一张图片在两种终端里的处理方式：Kitty 内嵌显示，Ptyxis 从编辑器调用外部图片查看器。Image2.6 示意图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eKitty 能内嵌图片，Ptyxis 这套环境不行。后来让 Neovim 直接叫起系统图片查看器，问题就结束了。\u003c/p\u003e\n\u003cp\u003e我想要的是顺手，不是为了“全终端”三个字跟一张 PNG 较劲。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e记在这里\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003etmux 能接回会话，不替你保存文件，也不保证重启后任务还在。\u003c/li\u003e\u003cli\u003eNeovim 不在保存时自动格式化；需要时手动来。\u003c/li\u003e\u003cli\u003e\u003ccode\u003ework\u003c/code\u003e、\u003ccode\u003ev\u003c/code\u003e、\u003ccode\u003ey\u003c/code\u003e 是我自己的脚本、别名或函数，不是 Linux 自带命令。\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e配置还会改。这篇先记现在能用的部分。\u003c/p\u003e\n\u003chr\u003e\n\u003cp\u003eAI 辅助整理。插图：CCSWITCH / Image2.6，均为示意，不是真实终端截图。更细的验证范围见\u003ca href=\"https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/LINUX-WORKFLOW-POST.md\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e内容记录\u003c/a\u003e。\u003c/p\u003e\n\u003cp\u003e读过的好文章：\u003ca href=\"https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eJulia Evans 的终端配置\u003c/a\u003e、\u003ca href=\"https://drewdevault.com/blog/My-weird-branchless-git-workflow/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eDrew DeVault 的 Git 工作流\u003c/a\u003e、\u003ca href=\"https://karthinks.com/software/more-less-emacs/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eKarthinks 的阅读模式\u003c/a\u003e。\u003c/p\u003e"
    },
    "toc": {
      "zh": [
        {
          "id": "post-heading-1",
          "title": "文档还得交",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "一个目录，几个窗格",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "pi 就坐在旁边",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "看图这件小事",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "记在这里",
          "level": 2
        }
      ],
      "en": [
        {
          "id": "post-heading-1",
          "title": "文档还得交",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "一个目录，几个窗格",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "pi 就坐在旁边",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "看图这件小事",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "记在这里",
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
    "minutes": 3,
    "date": "2026-11-15",
    "layout": "visual-story",
    "cover": "assets/images/posts/tor/route-cover-art.webp",
    "title": {
      "zh": "Tor 配好以后",
      "en": "Tor 配好以后"
    },
    "summary": {
      "zh": "网页能打开，只算第一步。我还查了它走哪条路、断线会怎样，以及那个一直不对劲的搜索框。",
      "en": "网页能打开，只算第一步。我还查了它走哪条路、断线会怎样，以及那个一直不对劲的搜索框。"
    },
    "category": {
      "zh": "网络 · 实测",
      "en": "网络 · 实测"
    },
    "html": {
      "zh": "\u003cp\u003e网页打开了。然后呢？这次主要查三件事：有没有绕过 Tor，断线会不会直连，搜索到底能不能用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e路线别接反\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次连接顺序：浏览器连接本地 Tor，Tor 通过受限转发连接 Clash 专用代理通道，再进入 Tor 网络。不是把浏览器代理直接改成 Clash。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eClash 接在 Tor 前面，不是拿来替换浏览器的 Tor 代理。否则网页照样可能打开，Tor 却被整个绕过去了。\u003c/p\u003e\n\u003cp\u003e专用通道里也没有 \u003ccode\u003eDIRECT\u003c/code\u003e。入口看到的来源可以变成代理节点，但代理服务方仍可能知道我的来源。多一跳，不等于多一份匿名保证。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e断线就停\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"Image2.6 概念插画：指定通路上的门关闭后，请求停止，没有打开旁边的另一扇门。这不是实验截图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这套启动方式把浏览器和 Tor 放进没有外网路由的网络命名空间，只留通往专用代理的受限转发。\u003c/p\u003e\n\u003cp\u003e当时直接 IPv4、IPv6、DNS/UDP 探测被拒绝；模拟代理失效，也没有回退直连。只覆盖这套启动路径，不替其他程序兜底。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e五个首页\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"2026 年 11 月 14 日实际浏览器截图：Riseup、Tor Metrics、Ahmia、Tor Project 和 SecureDrop 的洋葱服务首页。不是生成图片。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"首次验收与缓存复测不能混算：Riseup 约13秒、Tor Metrics 约17秒、Ahmia 首页约28秒；另外两站首次超过45秒，后来复测通过。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e五站都看到了正常正文和 HTTP 200。地址从各自官网或 \u003ccode\u003eOnion-Location\u003c/code\u003e 核对，不猜镜像。\u003c/p\u003e\n\u003cp\u003eTor Project 和 SecureDrop 首次超过 \u003cstrong\u003e45 秒\u003c/strong\u003e，后来的 \u003cstrong\u003e0.37 秒、3.52 秒\u003c/strong\u003e是热缓存复测，不能拿来宣传提速。这不是统计基准。\u003c/p\u003e\n\u003cp\u003eZeroBin 公布的洋葱地址返回“服务描述符未找到”。Sci-Hub 只开过公网首页，没检索、没下载，也不算洋葱站点通过。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e改了引擎，为什么还是 DuckDuckGo？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"地址栏与 Tor 内置欢迎页是两个搜索入口：前者已经设为 Ahmia，后者仍独立使用 DuckDuckGo。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e因为改的是地址栏，眼前用的却是欢迎页自己的搜索框。只看配置文件，根本发现不了。\u003c/p\u003e\n\u003cp\u003e后来把主页换成 Ahmia，新标签页留白。引擎设置是对了，但查询还是回到首页，没有正常结果。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003e搜索功能未完全验收。\u003c/strong\u003e 原因还没查清。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e别把配置当隐身衣\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"本次检查的边界：指定启动方式内失败就停止；真实身份登录、外部程序、漏洞和流量关联仍然是另外的问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e普通网站经过 Tor 出口，洋葱服务通过介绍点与会合点建立连接，没有那个普通出口。两条路径别混着想。\u003c/p\u003e\n\u003cp\u003eHTTPS、身份登录、外部阅读器、浏览器漏洞，都不会因为“套了代理”就自动处理好。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e时间和来源\u003c/h2\u003e\n\u003cp\u003e实测：\u003cstrong\u003e2026-11-14\u003c/strong\u003e。初次发布：2026-11-15。文字与插图修订：2026-11-17；这次没重跑网络测试。\u003c/p\u003e\n\u003cp\u003eAI 辅助整理。封面与门的插画由 CCSWITCH / Image2.6 生成；线路图是示意，五站拼图才是真实截图。只测公开首页。\u003c/p\u003e\n\u003cp\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 原理\u003c/a\u003e · \u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e洋葱服务\u003c/a\u003e · \u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 与 VPN\u003c/a\u003e · \u003ca href=\"https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/TOR-VISUAL-ESSAY.md\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e本次记录的详细范围\u003c/a\u003e\u003c/p\u003e",
      "en": "\u003cp\u003e网页打开了。然后呢？这次主要查三件事：有没有绕过 Tor，断线会不会直连，搜索到底能不能用。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e路线别接反\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次连接顺序：浏览器连接本地 Tor，Tor 通过受限转发连接 Clash 专用代理通道，再进入 Tor 网络。不是把浏览器代理直接改成 Clash。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003eClash 接在 Tor 前面，不是拿来替换浏览器的 Tor 代理。否则网页照样可能打开，Tor 却被整个绕过去了。\u003c/p\u003e\n\u003cp\u003e专用通道里也没有 \u003ccode\u003eDIRECT\u003c/code\u003e。入口看到的来源可以变成代理节点，但代理服务方仍可能知道我的来源。多一跳，不等于多一份匿名保证。\u003c/p\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e断线就停\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"Image2.6 概念插画：指定通路上的门关闭后，请求停止，没有打开旁边的另一扇门。这不是实验截图。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这套启动方式把浏览器和 Tor 放进没有外网路由的网络命名空间，只留通往专用代理的受限转发。\u003c/p\u003e\n\u003cp\u003e当时直接 IPv4、IPv6、DNS/UDP 探测被拒绝；模拟代理失效，也没有回退直连。只覆盖这套启动路径，不替其他程序兜底。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e五个首页\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"2026 年 11 月 14 日实际浏览器截图：Riseup、Tor Metrics、Ahmia、Tor Project 和 SecureDrop 的洋葱服务首页。不是生成图片。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"首次验收与缓存复测不能混算：Riseup 约13秒、Tor Metrics 约17秒、Ahmia 首页约28秒；另外两站首次超过45秒，后来复测通过。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e五站都看到了正常正文和 HTTP 200。地址从各自官网或 \u003ccode\u003eOnion-Location\u003c/code\u003e 核对，不猜镜像。\u003c/p\u003e\n\u003cp\u003eTor Project 和 SecureDrop 首次超过 \u003cstrong\u003e45 秒\u003c/strong\u003e，后来的 \u003cstrong\u003e0.37 秒、3.52 秒\u003c/strong\u003e是热缓存复测，不能拿来宣传提速。这不是统计基准。\u003c/p\u003e\n\u003cp\u003eZeroBin 公布的洋葱地址返回“服务描述符未找到”。Sci-Hub 只开过公网首页，没检索、没下载，也不算洋葱站点通过。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e改了引擎，为什么还是 DuckDuckGo？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"地址栏与 Tor 内置欢迎页是两个搜索入口：前者已经设为 Ahmia，后者仍独立使用 DuckDuckGo。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e因为改的是地址栏，眼前用的却是欢迎页自己的搜索框。只看配置文件，根本发现不了。\u003c/p\u003e\n\u003cp\u003e后来把主页换成 Ahmia，新标签页留白。引擎设置是对了，但查询还是回到首页，没有正常结果。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003e搜索功能未完全验收。\u003c/strong\u003e 原因还没查清。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e别把配置当隐身衣\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"本次检查的边界：指定启动方式内失败就停止；真实身份登录、外部程序、漏洞和流量关联仍然是另外的问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e普通网站经过 Tor 出口，洋葱服务通过介绍点与会合点建立连接，没有那个普通出口。两条路径别混着想。\u003c/p\u003e\n\u003cp\u003eHTTPS、身份登录、外部阅读器、浏览器漏洞，都不会因为“套了代理”就自动处理好。\u003c/p\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e时间和来源\u003c/h2\u003e\n\u003cp\u003e实测：\u003cstrong\u003e2026-11-14\u003c/strong\u003e。初次发布：2026-11-15。文字与插图修订：2026-11-17；这次没重跑网络测试。\u003c/p\u003e\n\u003cp\u003eAI 辅助整理。封面与门的插画由 CCSWITCH / Image2.6 生成；线路图是示意，五站拼图才是真实截图。只测公开首页。\u003c/p\u003e\n\u003cp\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 原理\u003c/a\u003e · \u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e洋葱服务\u003c/a\u003e · \u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor 与 VPN\u003c/a\u003e · \u003ca href=\"https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/TOR-VISUAL-ESSAY.md\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e本次记录的详细范围\u003c/a\u003e\u003c/p\u003e"
    },
    "toc": {
      "zh": [
        {
          "id": "post-heading-1",
          "title": "路线别接反",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "断线就停",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "五个首页",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "改了引擎，为什么还是 DuckDuckGo？",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "别把配置当隐身衣",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "时间和来源",
          "level": 2
        }
      ],
      "en": [
        {
          "id": "post-heading-1",
          "title": "路线别接反",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "断线就停",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "五个首页",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "改了引擎，为什么还是 DuckDuckGo？",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "别把配置当隐身衣",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "时间和来源",
          "level": 2
        }
      ]
    }
  }
];
