---
title: Tor 配好以后
slug: tor-onion-field-notes
lang: zh
category: 网络 · 实测
date: 2026-11-15
draft: false
layout: visual-story
cover: assets/images/posts/tor/route-cover-art.webp
summary: 网页能打开，只算第一步。我还查了它走哪条路、断线会怎样，以及那个一直不对劲的搜索框。
---

网页打开了。然后呢？这次主要查三件事：有没有绕过 Tor，断线会不会直连，搜索到底能不能用。

# 路线别接反

![本次连接顺序：浏览器连接本地 Tor，Tor 通过受限转发连接 Clash 专用代理通道，再进入 Tor 网络。不是把浏览器代理直接改成 Clash。](assets/images/posts/tor/clash-chain.svg)

Clash 接在 Tor 前面，不是拿来替换浏览器的 Tor 代理。否则网页照样可能打开，Tor 却被整个绕过去了。

专用通道里也没有 `DIRECT`。入口看到的来源可以变成代理节点，但代理服务方仍可能知道我的来源。多一跳，不等于多一份匿名保证。

# 断线就停

![Image2.6 概念插画：指定通路上的门关闭后，请求停止，没有打开旁边的另一扇门。这不是实验截图。](assets/images/posts/tor/gate-art.webp)

这套启动方式把浏览器和 Tor 放进没有外网路由的网络命名空间，只留通往专用代理的受限转发。

当时直接 IPv4、IPv6、DNS/UDP 探测被拒绝；模拟代理失效，也没有回退直连。只覆盖这套启动路径，不替其他程序兜底。

# 五个首页

![2026 年 11 月 14 日实际浏览器截图：Riseup、Tor Metrics、Ahmia、Tor Project 和 SecureDrop 的洋葱服务首页。不是生成图片。](assets/images/posts/tor/five-sites-evidence.webp)

![首次验收与缓存复测不能混算：Riseup 约13秒、Tor Metrics 约17秒、Ahmia 首页约28秒；另外两站首次超过45秒，后来复测通过。](assets/images/posts/tor/observed-times.svg)

五站都看到了正常正文和 HTTP 200。地址从各自官网或 `Onion-Location` 核对，不猜镜像。

Tor Project 和 SecureDrop 首次超过 **45 秒**，后来的 **0.37 秒、3.52 秒**是热缓存复测，不能拿来宣传提速。这不是统计基准。

ZeroBin 公布的洋葱地址返回“服务描述符未找到”。Sci-Hub 只开过公网首页，没检索、没下载，也不算洋葱站点通过。

# 改了引擎，为什么还是 DuckDuckGo？

![地址栏与 Tor 内置欢迎页是两个搜索入口：前者已经设为 Ahmia，后者仍独立使用 DuckDuckGo。](assets/images/posts/tor/two-search-boxes.svg)

因为改的是地址栏，眼前用的却是欢迎页自己的搜索框。只看配置文件，根本发现不了。

后来把主页换成 Ahmia，新标签页留白。引擎设置是对了，但查询还是回到首页，没有正常结果。

**搜索功能未完全验收。** 原因还没查清。

# 别把配置当隐身衣

![本次检查的边界：指定启动方式内失败就停止；真实身份登录、外部程序、漏洞和流量关联仍然是另外的问题。](assets/images/posts/tor/privacy-boundaries.svg)

普通网站经过 Tor 出口，洋葱服务通过介绍点与会合点建立连接，没有那个普通出口。两条路径别混着想。

HTTPS、身份登录、外部阅读器、浏览器漏洞，都不会因为“套了代理”就自动处理好。

# 时间和来源

实测：**2026-11-14**。初次发布：2026-11-15。文字与插图修订：2026-11-17；这次没重跑网络测试。

AI 辅助整理。封面与门的插画由 CCSWITCH / Image2.6 生成；线路图是示意，五站拼图才是真实截图。只测公开首页。

[Tor 原理](https://support.torproject.org/about-tor/) · [洋葱服务](https://community.torproject.org/onion-services/overview/) · [Tor 与 VPN](https://support.torproject.org/tor-browser/general/vpn-with-tor/) · [本次记录的详细范围](https://github.com/lifelonglearnerAdam/Myweb/blob/main/docs/TOR-VISUAL-ESSAY.md)
