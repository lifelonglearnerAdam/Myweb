/* Generated from owner-published posts/*.md. Drafts are never included. */
window.PORTFOLIO.notes = [
  {
    "id": "tor-onion-field-notes",
    "languages": [
      "zh"
    ],
    "minutes": 8,
    "date": "2026-11-15",
    "layout": "visual-story",
    "cover": "assets/images/posts/tor/cover.webp",
    "title": {
      "zh": "穿过洋葱：一次 Tor 网络的可视化实测",
      "en": "穿过洋葱：一次 Tor 网络的可视化实测"
    },
    "summary": {
      "zh": "从一条请求的旅程，到五个洋葱站点的实际页面。用图解、分镜和失败记录，拆开 Tor、代理、速度与匿名之间的关系。",
      "en": "从一条请求的旅程，到五个洋葱站点的实际页面。用图解、分镜和失败记录，拆开 Tor、代理、速度与匿名之间的关系。"
    },
    "category": {
      "zh": "网络 · 可视化实测",
      "en": "网络 · 可视化实测"
    },
    "html": {
      "zh": "\u003cp\u003e这篇文章整理自 2026 年 11 月 14 日的一次 AI 辅助配置与自动化浏览器验收。它是一份可复核的工程学习记录，不是新的匿名协议研究，也不是“绝对匿名”指南。原创概念插画由 IMAGE2.6 生成；线路、数字与真实页面证据分别标明。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先把地图展开：深网不是“另一个互联网”\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/web-layers.svg\" alt=\"深网、暗网与公开网页的概念图：深网包含私人邮箱和登录系统；暗网只是特殊网络中的部分内容；示意不按规模比例绘制。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e搜索引擎能索引的公开页面，只是我们习惯看到的入口。私人邮箱、登录后的云盘和内部数据库没有因此变得神秘，它们也属于通常所说的 \u003cstrong\u003edeep web\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003edark web\u003c/strong\u003e 则强调借助特定软件或网络访问的服务。Tor 的 \u003ccode\u003e.onion\u003c/code\u003e 是一种例子，不是所有深网的统称。Tor Browser 同样可以访问普通 HTTPS 网站；一个 \u003ccode\u003e.onion\u003c/code\u003e 地址本身，也不能说明站点内容是否合法、可信或在线。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e先理解“怎么到达”，再判断“到达了什么”。不要把网络工具等同于网络内容。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e一条请求，要经过几双眼睛？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-routing.svg\" alt=\"普通 HTTPS 网站的典型 Tor 电路：浏览器经入口守卫、中继和出口到达网站。各节点掌握的信息不同，HTTPS 另在应用层保护传输内容。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e访问普通网站时，典型 Tor 电路包含入口守卫、中继和出口。客户端构造电路，把不同层的保护交给不同跳处理；通常单个中继不会同时掌握通信的真实来源与最终目标。\u003c/p\u003e\n\u003cp\u003e这不等于“没有人看见任何信息”。\u003cstrong\u003e直接连接入口时，入口知道连接来源；出口知道访问目标。\u003c/strong\u003e 如果目标网站没有 HTTPS，出口到网站之间的内容可能暴露。TLS 是浏览器与网站之间的另一层保护，不能由“用了 Tor”替代。\u003c/p\u003e\n\u003cp\u003e图里展示的是常规路径和局部可见性，不是对多点观察、时序关联或浏览器漏洞的安全证明。Tor 的目标是降低关联两端的能力，不是让通信从物理世界消失。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e洋葱服务：不是把网站藏在出口后面\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/rendezvous-art.webp\" alt=\"概念插画：访问者与服务端各自穿过柔和的玻璃环，在中央会合。此图只表达会合的意象，不表示协议节点数量。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-rendezvous.svg\" alt=\"洋葱服务简化协议图：先通过服务描述符和介绍点建立联系，访问者与服务端各自建立电路，在会合点交换数据，不经过普通出口节点。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003ccode\u003e.onion\u003c/code\u003e 服务走的是另一条逻辑。客户端读取服务描述符，经介绍点传递会合信息；客户端和服务端再分别建立电路，在 \u003cstrong\u003erendezvous point（会合点）\u003c/strong\u003e 连接起来。\u003c/p\u003e\n\u003cp\u003e介绍点与会合点不是同一个角色。会合点也不是普通出口：通信不需要先从 Tor 出口回到公网，再去寻找一台“隐藏服务器”。上图省略了密钥协商等细节，保留这两个阶段的区别。\u003c/p\u003e\n\u003cp\u003e所以，“让 Tor 出口也经过本机 VPN”不适合用来描述洋葱服务。这里根本没有普通网站访问中的那个出口。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e把 Clash 放进去，到底改了哪一段？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次实验的连接链：浏览器保留本地 Tor 代理，本地 Tor 经受限转发连接 Clash，再经过加密代理节点进入 Tor；网站仍看到 Tor 出口。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次实验选择的顺序是：\u003cstrong\u003e浏览器 → 本地 Tor → Clash 的专用代理通道 → 远端代理节点 → Tor 网络\u003c/strong\u003e。对于普通网站，后面才接 Tor 出口与网站；对于洋葱服务，则进入前一镜的会合流程。\u003c/p\u003e\n\u003cp\u003eClash 是代理和规则处理工具，本身不是一种 VPN 协议。仅仅把一个本机代理端口填进设置，不代表它一定选择了远端代理：规则模式里仍可能存在 \u003ccode\u003eDIRECT\u003c/code\u003e。本次为 Tor 单独建立不含直连选项的通道，不将浏览器的网页代理直接改成 Clash，避免绕过 Tor。\u003c/p\u003e\n\u003cp\u003e代价与信任也会移动：入口看到的连接来源可以变成代理节点，但代理服务方仍可能知道用户的连接来源。多加一层不自动等于更匿名，也不自动更快；这不是 Tor 官方面向所有人的通用推荐方案。\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e官方关于 Tor 与 VPN 的说明\u003c/a\u003e也强调，需要先理解自己的威胁模型。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e真正要紧的，是断线之后发生什么\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"概念插画：一条细光线穿过玻璃桥上的门，旁边的门保持关闭。表达代理失效就停止，而不是寻找不安全捷径。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e“连通时用了代理”和“失效时不会直连”，是两个不同问题。前者关注正常路径，后者关注 \u003cstrong\u003efail closed：失败就停止\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e本次把这个启动方式下的浏览器和 Tor 放进仅有回环接口、没有外网路由的网络命名空间，只保留通往专用 Clash 通道的受限转发。直接 IPv4、IPv6 和 DNS/UDP 探测被拒绝，代理失效模拟没有回退直连。它是降低误配置风险的措施，不是抗入侵安全沙箱的完整证明。\u003c/p\u003e\n\u003cp\u003e边界也必须写清：其它应用、外部文档阅读器、不经这个启动方式打开的程序，不在这次隔离的覆盖范围内。配置变更与软件更新后也需要复查。不能从几项通过的探测，推导出“所有情形都绝不泄漏”。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e如果安全要求是“不走这条路，就不要出发”，错误处理不能偷偷变成另一条路。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e五个站点，五份证据，也有五种等待\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"本次实际 Tor Browser 页面截图拼图：Riseup、Tor Metrics、Ahmia、Tor Project 与 SecureDrop 均显示正常正文并返回 HTTP 200。截图不是生成插画。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"五站首次验收耗时图：Riseup约13秒，Tor Metrics约17秒，Ahmia首页约28秒；Tor Project和SecureDrop首次超过45秒后续复测通过。复测缓存时间不能当作首次速度。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e验收不是看见 SOCKS 握手就算成功。这五个不同的洋葱服务都在安装的 Tor Browser 中实际打开，核对了 \u003cstrong\u003e正文、页面状态、HTTP 200 与截图\u003c/strong\u003e。地址来自相应公开官网的页面或 \u003ccode\u003eOnion-Location\u003c/code\u003e，没有靠猜测同名镜像凑数。\u003c/p\u003e\n\u003cp\u003e记录中的首次验收约为：Riseup \u003cstrong\u003e13 秒\u003c/strong\u003e、Tor Metrics \u003cstrong\u003e17 秒\u003c/strong\u003e、Ahmia 首页 \u003cstrong\u003e28 秒\u003c/strong\u003e。Tor Project 与 SecureDrop 首次 45 秒超时，之后才显示正常页面。后两者热缓存复测的 \u003cstrong\u003e0.37 秒和 3.52 秒\u003c/strong\u003e，不能拿来与前面的首次打开做公平比较。\u003c/p\u003e\n\u003cp\u003e这只是一次环境中的单次观察，包含页面检查的时间，不是对 Tor 性能的统计基准，也不是站点持续在线承诺。代理测速的毫秒数、Tor 建路时间、网页完整渲染时间，更不是同一项指标。\u003c/p\u003e\n\u003cp\u003e还有失败：ZeroBin 公网首页能经 Tor 打开，但它自己公布的 v3 onion 地址返回 \u003cstrong\u003e服务描述符未找到\u003c/strong\u003e。Sci-Hub 仅验证了公网首页，没有检索或下载资料，不算洋葱站点通过。其它未能确认当前地址的名称，也没有被写成“已测试正常”。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e两个搜索框，和一个不该被掩盖的问题\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"两个搜索框的区别：地址栏默认引擎已经是Ahmia，但该版本Tor内置主页仍单独使用DuckDuckGo；另有Ahmia查询返回首页的未解决问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e“默认引擎已经改了，怎么还是 DuckDuckGo？”这个反馈是对的。该版本 Tor 内置欢迎页的搜索框有独立实现，不跟随地址栏的默认引擎。只检查配置文件，会漏掉实际看到的页面。\u003c/p\u003e\n\u003cp\u003e本次从运行中的浏览器内部确认：普通与隐私搜索引擎均为 \u003cstrong\u003eAhmia\u003c/strong\u003e，主页改为 Ahmia，新标签页改为空白，避免继续出现那个独立的搜索框。界面与网页语言偏好统一为 \u003cstrong\u003eEnglish (US)\u003c/strong\u003e，保留官方抗指纹设计，不把“自行堆很多扩展”误认为加强隐私。\u003c/p\u003e\n\u003cp\u003e但还剩一个真实问题：Ahmia 的测试查询与正常表单提交都回到了首页，未验证到正常的搜索结果。因此结论只能是 \u003cstrong\u003e引擎设置已生效，搜索功能未完全验收\u003c/strong\u003e。这个观察也不足以断定问题一定在本地配置或站点端。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e能打开首页，不等于能用它搜索。失败记录也是研究结果的一部分。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e片尾之前：匿名不是隐身\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"隐私边界图：代理失效应该停止；隔离仅覆盖指定启动方式；真实身份登录、漏洞、恶意软件与流量关联仍需考虑，不能许诺绝对匿名。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次最有价值的收获，不是一串“成功打开”的站名，而是把问题拆开：\u003cstrong\u003e谁看见哪一段、哪个程序受到约束、失败时有没有绕路、证据究竟支持到哪里\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003eEnglish (US) 与保留标准抗指纹配置，是减少与常见 Tor 用户差异的方向，不是单独的匿名保证。登录真实身份账号、混用浏览器、在外部程序打开下载文件、安装额外扩展，都可能改变暴露面。HTTPS、官方更新和清楚的使用边界，比“我已经套了很多层”更重要。\u003c/p\u003e\n\u003cp\u003e洋葱网络并不承诺即时抵达，也不承诺绝对不可识别。一个好的工程记录应当能同时写下两句话：\u003cstrong\u003e这里确实通过了；这里还没有证明。\u003c/strong\u003e\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e资料、方法与图像来源\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003e实验与发表时间\u003c/strong\u003e：浏览器验收为 2026-11-14；本文整理发布于 2026-11-15。本文是 AI 辅助的学习与工程记录，不宣称学术首创或大样本评测。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e测试范围\u003c/strong\u003e：只验证公开首页，不登录、不提交匿名文件、不创建粘贴、不下载论文或书籍。加载耗时是单次验收记录；后续缓存复测另记，不用来制造提速结论。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e概念插画\u003c/strong\u003e：封面、会合场景与门的意象由 \u003ccode\u003egpt-image-2.6\u003c/code\u003e 原创生成，属于视觉比喻，不是网络拓扑、真实站点或实验凭证。线路与数据图为独立制作的 SVG，图中不公开个人 IP、本机端口或代理节点信息。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e截图\u003c/strong\u003e：五站拼图来自本次实际浏览器页面，不含浏览器账号、书签、地址栏与个人网络信息。各站点的标志、页面内容及设计权利归相应权利人；这里只作研究说明和有限展示，不将其署为本站原创。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e自动化边界\u003c/strong\u003e：测试结束后关闭临时控制服务、恢复临时推荐设置；保留正常窗口与原有抗指纹、本地 DNS 禁用、WebRTC 禁用和不回退直连的设置。通过几项验证不等于完整安全审计。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor Browser 如何工作\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：洋葱服务\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor 与 VPN 的常见问题\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/features/plugins/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：关于安装浏览器扩展\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://riseup.net/en/security/network-security/tor\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eRiseup：Tor 与网络安全\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://metrics.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Metrics\u003c/a\u003e、\u003ca href=\"https://ahmia.fi/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eAhmia\u003c/a\u003e、\u003ca href=\"https://www.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project\u003c/a\u003e、\u003ca href=\"https://securedrop.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eSecureDrop\u003c/a\u003e\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e这是 \u003ccode\u003ezengzimo.cn\u003c/code\u003e 的第一篇正式文章。画面负责让路径可见，文字负责承认证据的边界。\u003c/p\u003e",
      "en": "\u003cp\u003e这篇文章整理自 2026 年 11 月 14 日的一次 AI 辅助配置与自动化浏览器验收。它是一份可复核的工程学习记录，不是新的匿名协议研究，也不是“绝对匿名”指南。原创概念插画由 IMAGE2.6 生成；线路、数字与真实页面证据分别标明。\u003c/p\u003e\n\u003ch2 id=\"post-heading-1\" tabindex=\"-1\"\u003e先把地图展开：深网不是“另一个互联网”\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/web-layers.svg\" alt=\"深网、暗网与公开网页的概念图：深网包含私人邮箱和登录系统；暗网只是特殊网络中的部分内容；示意不按规模比例绘制。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e搜索引擎能索引的公开页面，只是我们习惯看到的入口。私人邮箱、登录后的云盘和内部数据库没有因此变得神秘，它们也属于通常所说的 \u003cstrong\u003edeep web\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e\u003cstrong\u003edark web\u003c/strong\u003e 则强调借助特定软件或网络访问的服务。Tor 的 \u003ccode\u003e.onion\u003c/code\u003e 是一种例子，不是所有深网的统称。Tor Browser 同样可以访问普通 HTTPS 网站；一个 \u003ccode\u003e.onion\u003c/code\u003e 地址本身，也不能说明站点内容是否合法、可信或在线。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e先理解“怎么到达”，再判断“到达了什么”。不要把网络工具等同于网络内容。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-2\" tabindex=\"-1\"\u003e一条请求，要经过几双眼睛？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-routing.svg\" alt=\"普通 HTTPS 网站的典型 Tor 电路：浏览器经入口守卫、中继和出口到达网站。各节点掌握的信息不同，HTTPS 另在应用层保护传输内容。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e访问普通网站时，典型 Tor 电路包含入口守卫、中继和出口。客户端构造电路，把不同层的保护交给不同跳处理；通常单个中继不会同时掌握通信的真实来源与最终目标。\u003c/p\u003e\n\u003cp\u003e这不等于“没有人看见任何信息”。\u003cstrong\u003e直接连接入口时，入口知道连接来源；出口知道访问目标。\u003c/strong\u003e 如果目标网站没有 HTTPS，出口到网站之间的内容可能暴露。TLS 是浏览器与网站之间的另一层保护，不能由“用了 Tor”替代。\u003c/p\u003e\n\u003cp\u003e图里展示的是常规路径和局部可见性，不是对多点观察、时序关联或浏览器漏洞的安全证明。Tor 的目标是降低关联两端的能力，不是让通信从物理世界消失。\u003c/p\u003e\n\u003ch2 id=\"post-heading-3\" tabindex=\"-1\"\u003e洋葱服务：不是把网站藏在出口后面\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/rendezvous-art.webp\" alt=\"概念插画：访问者与服务端各自穿过柔和的玻璃环，在中央会合。此图只表达会合的意象，不表示协议节点数量。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/onion-rendezvous.svg\" alt=\"洋葱服务简化协议图：先通过服务描述符和介绍点建立联系，访问者与服务端各自建立电路，在会合点交换数据，不经过普通出口节点。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003ccode\u003e.onion\u003c/code\u003e 服务走的是另一条逻辑。客户端读取服务描述符，经介绍点传递会合信息；客户端和服务端再分别建立电路，在 \u003cstrong\u003erendezvous point（会合点）\u003c/strong\u003e 连接起来。\u003c/p\u003e\n\u003cp\u003e介绍点与会合点不是同一个角色。会合点也不是普通出口：通信不需要先从 Tor 出口回到公网，再去寻找一台“隐藏服务器”。上图省略了密钥协商等细节，保留这两个阶段的区别。\u003c/p\u003e\n\u003cp\u003e所以，“让 Tor 出口也经过本机 VPN”不适合用来描述洋葱服务。这里根本没有普通网站访问中的那个出口。\u003c/p\u003e\n\u003ch2 id=\"post-heading-4\" tabindex=\"-1\"\u003e把 Clash 放进去，到底改了哪一段？\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/clash-chain.svg\" alt=\"本次实验的连接链：浏览器保留本地 Tor 代理，本地 Tor 经受限转发连接 Clash，再经过加密代理节点进入 Tor；网站仍看到 Tor 出口。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次实验选择的顺序是：\u003cstrong\u003e浏览器 → 本地 Tor → Clash 的专用代理通道 → 远端代理节点 → Tor 网络\u003c/strong\u003e。对于普通网站，后面才接 Tor 出口与网站；对于洋葱服务，则进入前一镜的会合流程。\u003c/p\u003e\n\u003cp\u003eClash 是代理和规则处理工具，本身不是一种 VPN 协议。仅仅把一个本机代理端口填进设置，不代表它一定选择了远端代理：规则模式里仍可能存在 \u003ccode\u003eDIRECT\u003c/code\u003e。本次为 Tor 单独建立不含直连选项的通道，不将浏览器的网页代理直接改成 Clash，避免绕过 Tor。\u003c/p\u003e\n\u003cp\u003e代价与信任也会移动：入口看到的连接来源可以变成代理节点，但代理服务方仍可能知道用户的连接来源。多加一层不自动等于更匿名，也不自动更快；这不是 Tor 官方面向所有人的通用推荐方案。\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003e官方关于 Tor 与 VPN 的说明\u003c/a\u003e也强调，需要先理解自己的威胁模型。\u003c/p\u003e\n\u003ch2 id=\"post-heading-5\" tabindex=\"-1\"\u003e真正要紧的，是断线之后发生什么\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/gate-art.webp\" alt=\"概念插画：一条细光线穿过玻璃桥上的门，旁边的门保持关闭。表达代理失效就停止，而不是寻找不安全捷径。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e“连通时用了代理”和“失效时不会直连”，是两个不同问题。前者关注正常路径，后者关注 \u003cstrong\u003efail closed：失败就停止\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003e本次把这个启动方式下的浏览器和 Tor 放进仅有回环接口、没有外网路由的网络命名空间，只保留通往专用 Clash 通道的受限转发。直接 IPv4、IPv6 和 DNS/UDP 探测被拒绝，代理失效模拟没有回退直连。它是降低误配置风险的措施，不是抗入侵安全沙箱的完整证明。\u003c/p\u003e\n\u003cp\u003e边界也必须写清：其它应用、外部文档阅读器、不经这个启动方式打开的程序，不在这次隔离的覆盖范围内。配置变更与软件更新后也需要复查。不能从几项通过的探测，推导出“所有情形都绝不泄漏”。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e如果安全要求是“不走这条路，就不要出发”，错误处理不能偷偷变成另一条路。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-6\" tabindex=\"-1\"\u003e五个站点，五份证据，也有五种等待\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/five-sites-evidence.webp\" alt=\"本次实际 Tor Browser 页面截图拼图：Riseup、Tor Metrics、Ahmia、Tor Project 与 SecureDrop 均显示正常正文并返回 HTTP 200。截图不是生成插画。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/observed-times.svg\" alt=\"五站首次验收耗时图：Riseup约13秒，Tor Metrics约17秒，Ahmia首页约28秒；Tor Project和SecureDrop首次超过45秒后续复测通过。复测缓存时间不能当作首次速度。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e验收不是看见 SOCKS 握手就算成功。这五个不同的洋葱服务都在安装的 Tor Browser 中实际打开，核对了 \u003cstrong\u003e正文、页面状态、HTTP 200 与截图\u003c/strong\u003e。地址来自相应公开官网的页面或 \u003ccode\u003eOnion-Location\u003c/code\u003e，没有靠猜测同名镜像凑数。\u003c/p\u003e\n\u003cp\u003e记录中的首次验收约为：Riseup \u003cstrong\u003e13 秒\u003c/strong\u003e、Tor Metrics \u003cstrong\u003e17 秒\u003c/strong\u003e、Ahmia 首页 \u003cstrong\u003e28 秒\u003c/strong\u003e。Tor Project 与 SecureDrop 首次 45 秒超时，之后才显示正常页面。后两者热缓存复测的 \u003cstrong\u003e0.37 秒和 3.52 秒\u003c/strong\u003e，不能拿来与前面的首次打开做公平比较。\u003c/p\u003e\n\u003cp\u003e这只是一次环境中的单次观察，包含页面检查的时间，不是对 Tor 性能的统计基准，也不是站点持续在线承诺。代理测速的毫秒数、Tor 建路时间、网页完整渲染时间，更不是同一项指标。\u003c/p\u003e\n\u003cp\u003e还有失败：ZeroBin 公网首页能经 Tor 打开，但它自己公布的 v3 onion 地址返回 \u003cstrong\u003e服务描述符未找到\u003c/strong\u003e。Sci-Hub 仅验证了公网首页，没有检索或下载资料，不算洋葱站点通过。其它未能确认当前地址的名称，也没有被写成“已测试正常”。\u003c/p\u003e\n\u003ch2 id=\"post-heading-7\" tabindex=\"-1\"\u003e两个搜索框，和一个不该被掩盖的问题\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/two-search-boxes.svg\" alt=\"两个搜索框的区别：地址栏默认引擎已经是Ahmia，但该版本Tor内置主页仍单独使用DuckDuckGo；另有Ahmia查询返回首页的未解决问题。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e“默认引擎已经改了，怎么还是 DuckDuckGo？”这个反馈是对的。该版本 Tor 内置欢迎页的搜索框有独立实现，不跟随地址栏的默认引擎。只检查配置文件，会漏掉实际看到的页面。\u003c/p\u003e\n\u003cp\u003e本次从运行中的浏览器内部确认：普通与隐私搜索引擎均为 \u003cstrong\u003eAhmia\u003c/strong\u003e，主页改为 Ahmia，新标签页改为空白，避免继续出现那个独立的搜索框。界面与网页语言偏好统一为 \u003cstrong\u003eEnglish (US)\u003c/strong\u003e，保留官方抗指纹设计，不把“自行堆很多扩展”误认为加强隐私。\u003c/p\u003e\n\u003cp\u003e但还剩一个真实问题：Ahmia 的测试查询与正常表单提交都回到了首页，未验证到正常的搜索结果。因此结论只能是 \u003cstrong\u003e引擎设置已生效，搜索功能未完全验收\u003c/strong\u003e。这个观察也不足以断定问题一定在本地配置或站点端。\u003c/p\u003e\n\u003cblockquote\u003e\u003cp\u003e能打开首页，不等于能用它搜索。失败记录也是研究结果的一部分。\u003c/p\u003e\u003c/blockquote\u003e\n\u003ch2 id=\"post-heading-8\" tabindex=\"-1\"\u003e片尾之前：匿名不是隐身\u003c/h2\u003e\n\u003cp\u003e\u003cimg src=\"assets/images/posts/tor/privacy-boundaries.svg\" alt=\"隐私边界图：代理失效应该停止；隔离仅覆盖指定启动方式；真实身份登录、漏洞、恶意软件与流量关联仍需考虑，不能许诺绝对匿名。\" loading=\"lazy\"\u003e\u003c/p\u003e\n\u003cp\u003e这次最有价值的收获，不是一串“成功打开”的站名，而是把问题拆开：\u003cstrong\u003e谁看见哪一段、哪个程序受到约束、失败时有没有绕路、证据究竟支持到哪里\u003c/strong\u003e。\u003c/p\u003e\n\u003cp\u003eEnglish (US) 与保留标准抗指纹配置，是减少与常见 Tor 用户差异的方向，不是单独的匿名保证。登录真实身份账号、混用浏览器、在外部程序打开下载文件、安装额外扩展，都可能改变暴露面。HTTPS、官方更新和清楚的使用边界，比“我已经套了很多层”更重要。\u003c/p\u003e\n\u003cp\u003e洋葱网络并不承诺即时抵达，也不承诺绝对不可识别。一个好的工程记录应当能同时写下两句话：\u003cstrong\u003e这里确实通过了；这里还没有证明。\u003c/strong\u003e\u003c/p\u003e\n\u003ch2 id=\"post-heading-9\" tabindex=\"-1\"\u003e资料、方法与图像来源\u003c/h2\u003e\n\u003cul\u003e\u003cli\u003e\u003cstrong\u003e实验与发表时间\u003c/strong\u003e：浏览器验收为 2026-11-14；本文整理发布于 2026-11-15。本文是 AI 辅助的学习与工程记录，不宣称学术首创或大样本评测。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e测试范围\u003c/strong\u003e：只验证公开首页，不登录、不提交匿名文件、不创建粘贴、不下载论文或书籍。加载耗时是单次验收记录；后续缓存复测另记，不用来制造提速结论。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e概念插画\u003c/strong\u003e：封面、会合场景与门的意象由 \u003ccode\u003egpt-image-2.6\u003c/code\u003e 原创生成，属于视觉比喻，不是网络拓扑、真实站点或实验凭证。线路与数据图为独立制作的 SVG，图中不公开个人 IP、本机端口或代理节点信息。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e截图\u003c/strong\u003e：五站拼图来自本次实际浏览器页面，不含浏览器账号、书签、地址栏与个人网络信息。各站点的标志、页面内容及设计权利归相应权利人；这里只作研究说明和有限展示，不将其署为本站原创。\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e自动化边界\u003c/strong\u003e：测试结束后关闭临时控制服务、恢复临时推荐设置；保留正常窗口与原有抗指纹、本地 DNS 禁用、WebRTC 禁用和不回退直连的设置。通过几项验证不等于完整安全审计。\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/about-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor Browser 如何工作\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://community.torproject.org/onion-services/overview/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：洋葱服务\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/general/vpn-with-tor/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：Tor 与 VPN 的常见问题\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://support.torproject.org/tor-browser/features/plugins/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project：关于安装浏览器扩展\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://riseup.net/en/security/network-security/tor\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eRiseup：Tor 与网络安全\u003c/a\u003e\u003c/li\u003e\u003cli\u003e\u003ca href=\"https://metrics.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Metrics\u003c/a\u003e、\u003ca href=\"https://ahmia.fi/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eAhmia\u003c/a\u003e、\u003ca href=\"https://www.torproject.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eTor Project\u003c/a\u003e、\u003ca href=\"https://securedrop.org/\" target=\"_blank\" rel=\"noopener noreferrer\"\u003eSecureDrop\u003c/a\u003e\u003c/li\u003e\u003c/ul\u003e\n\u003cp\u003e这是 \u003ccode\u003ezengzimo.cn\u003c/code\u003e 的第一篇正式文章。画面负责让路径可见，文字负责承认证据的边界。\u003c/p\u003e"
    },
    "toc": {
      "zh": [
        {
          "id": "post-heading-1",
          "title": "先把地图展开：深网不是“另一个互联网”",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "一条请求，要经过几双眼睛？",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "洋葱服务：不是把网站藏在出口后面",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "把 Clash 放进去，到底改了哪一段？",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "真正要紧的，是断线之后发生什么",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "五个站点，五份证据，也有五种等待",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "两个搜索框，和一个不该被掩盖的问题",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "片尾之前：匿名不是隐身",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "资料、方法与图像来源",
          "level": 2
        }
      ],
      "en": [
        {
          "id": "post-heading-1",
          "title": "先把地图展开：深网不是“另一个互联网”",
          "level": 2
        },
        {
          "id": "post-heading-2",
          "title": "一条请求，要经过几双眼睛？",
          "level": 2
        },
        {
          "id": "post-heading-3",
          "title": "洋葱服务：不是把网站藏在出口后面",
          "level": 2
        },
        {
          "id": "post-heading-4",
          "title": "把 Clash 放进去，到底改了哪一段？",
          "level": 2
        },
        {
          "id": "post-heading-5",
          "title": "真正要紧的，是断线之后发生什么",
          "level": 2
        },
        {
          "id": "post-heading-6",
          "title": "五个站点，五份证据，也有五种等待",
          "level": 2
        },
        {
          "id": "post-heading-7",
          "title": "两个搜索框，和一个不该被掩盖的问题",
          "level": 2
        },
        {
          "id": "post-heading-8",
          "title": "片尾之前：匿名不是隐身",
          "level": 2
        },
        {
          "id": "post-heading-9",
          "title": "资料、方法与图像来源",
          "level": 2
        }
      ]
    }
  }
];
