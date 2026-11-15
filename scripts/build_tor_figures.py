#!/usr/bin/env python3
"""Reproduce the Tor essay's explanatory figures. No network, credentials or private data.
Optional Pillow inputs are supplied explicitly; never copy an evidence directory wholesale.
"""
from pathlib import Path
import argparse
import html

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/images/posts/tor"
INK, SOFT, LINE, WHITE, MUTED, PURPLE, MINT, AMBER = "#11131f", "#1b1e2e", "#39354b", "#f6f1fd", "#c2b9d1", "#c4a7ee", "#a9dec8", "#e4bd86"


def text(x, y, value, size=28, color=WHITE, anchor="start", weight="400"):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}">{html.escape(value)}</text>'


def lines(x, y, values, size=26, color=MUTED, step=43, anchor="start"):
    return "".join(text(x, y + i * step, value, size, color, anchor) for i, value in enumerate(values))


def box(x, y, w, h, fill=SOFT, stroke=LINE, radius=20):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>'


def arrow(x1, y1, x2, y2, color=PURPLE, dashed=False):
    return f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="4" {"stroke-dasharray=\"10 10\"" if dashed else ""} marker-end="url(#arrow)"/>'


def node(x, y, label, color=PURPLE, sub=""):
    return (f'<circle cx="{x}" cy="{y}" r="44" fill="{SOFT}" stroke="{color}" stroke-width="3"/>'
            f'<circle cx="{x}" cy="{y}" r="10" fill="{color}"/>' + text(x, y + 88, label, 27, WHITE, "middle")
            + (text(x, y + 125, sub, 20, MUTED, "middle") if sub else ""))


def figure(name, title, subtitle, body, description):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="960" viewBox="0 0 1440 960" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(title)}</title><desc id="desc">{html.escape(description)}</desc>
<defs><radialGradient id="glow"><stop stop-color="#30273f"/><stop offset="1" stop-color="{INK}"/></radialGradient><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{PURPLE}"/></marker></defs>
<rect width="1440" height="960" rx="0" fill="url(#glow)"/>
<g font-family="Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif">
{text(64, 64, 'ZIMO / TOR FIELD NOTES', 18, PURPLE)}{text(1376,64,'EXPLANATORY FIGURE',16,MUTED,'end')}
{text(64,139,title,46,WHITE,weight='600')}{text(64,190,subtitle,24,MUTED)}
{body}
<path d="M64 892 H1376" stroke="{LINE}"/>{text(64,929,'概念与观察分开记录 · 示意图不代表真实物理距离或规模',18,MUTED)}{text(1376,929,'zengzimo.cn',18,PURPLE,'end')}
</g></svg>'''
    (OUT / name).write_text(svg, encoding="utf-8")


def build_diagrams():
    OUT.mkdir(parents=True, exist_ok=True)
    body = box(64,250,1312,183,"#242335") + text(102,302,"SURFACE WEB / 可索引的公开内容",27,PURPLE)
    body += text(102,363,"新闻、博客、公开文档",38) + text(1300,363,"普通浏览器即可访问",25,MUTED,"end")
    body += box(64,461,1312,375) + text(102,518,"DEEP WEB / 未被公开索引的内容",27,PURPLE)
    body += lines(102,596,["私人邮箱、登录后的网盘", "数据库、付费或内部系统", "未索引 ≠ 非法，也不必然使用 Tor"],29)
    body += box(775,550,551,235,"#302940","#8f76ae") + text(810,603,"DARK WEB / 特殊网络中的一部分",25,MINT)
    body += lines(810,663,["例如 Tor 的 .onion 服务", "不是 deep web 的同义词", "Tor 也能访问普通公开网站"],25)
    figure("web-layers.svg","先把三个词分开","这不是按比例绘制的冰山图，也不估算所谓“暗网占比”。",body,"可公开索引内容与深网不同，暗网只是需要特定网络或软件访问的部分；Tor 也可访问公开网站。")

    body = ""
    points=[(135,"浏览器","构造整条电路"),(425,"入口守卫","Guard"),(715,"中继","Middle"),(1005,"出口","Exit"),(1295,"HTTPS 站点","Public website")]
    for left,right in zip(points,points[1:]): body += arrow(left[0]+50,354,right[0]-52,354)
    for x,label,sub in points: body += node(x,354,label,MINT if x in [135,1295] else PURPLE,sub)
    body += box(64,540,1312,103,"#182c2c","#416658") + text(100,582,"HTTPS / TLS：从浏览器一直到目标网站的应用层加密",29,MINT)
    body += text(100,620,"出口之外仍需 HTTPS；Tor 不替代目标站点的传输加密。",23,MUTED)
    captions=[("入口守卫",["知道直接连接它的来源", "不知道最终目标站点"]),("中继",["看到前后相邻节点", "不掌握完整通信两端"]),("出口",["知道访问的目标", "非 HTTPS 内容可能被读取"])]
    for i,(title,rows) in enumerate(captions):
        x=64+i*447; body+=box(x,679,418,155)+text(x+24,722,title,27,PURPLE)+lines(x+24,765,rows,22,step=34)
    figure("onion-routing.svg","不是一条“超级加密隧道”","典型的公开网站访问：客户端 → 入口守卫 → 中继 → 出口 → 网站。",body,"普通网站的典型三跳 Tor 电路。入口、中继、出口分别知道不同信息；HTTPS 在应用层端到端加密。这里只表示常规流量模型，并非抗所有观察者的证明。")

    body = box(64,240,1312,105) + text(100,281,"建立阶段：查询服务描述符，再通过介绍点传递会合信息。",29,PURPLE)
    body += text(100,321,"介绍点帮助建立连接；不是后续数据会合点。此图省略密钥握手细节。",23,MUTED)
    for y,endpoint in [(458,"访问者"),(690,"洋葱服务")]:
        for x1,x2 in [(150,408),(408,666)]: body+=arrow(x1+49,y,x2-51,y)
        body+=node(150,y,endpoint,MINT)+node(408,y,"入口守卫")+node(666,y,"中继")
        body+=arrow(715,y,1058,572)
    body+=node(1105,572,"会合点",MINT,"Rendezvous point")
    body+=text(1100,807,"不需要普通出口节点",30,MINT,"middle")
    figure("onion-rendezvous.svg",".onion：两边在网络里会面","访问者和服务端各自建立电路，在会合点连接，而不是“出口再找一台隐藏服务器”。",body,"洋葱服务通信的简化图。客户端和服务端通过介绍协议约定会合点，通常分别使用三跳电路，不经过普通网站使用的出口中继。")

    body=box(64,243,440,261,"#192627","#4c7668")+text(91,290,"本次隔离启动的边界",25,MINT)
    body+=node(165,365,"浏览器",MINT)+node(398,365,"本地 Tor",MINT)+arrow(216,365,346,365)
    body+=arrow(448,365,631,365)+node(680,365,"本机 Clash")+arrow(729,365,1088,365)+node(1137,365,"远端代理节点")
    body+=text(532,329,"受限转发",19,MUTED,"middle")+text(907,314,"加密代理连接",23,PURPLE,"middle")
    body+=arrow(1137,418,1137,615)+arrow(1088,668,903,668)+arrow(803,668,621,668)+arrow(521,668,336,668)
    for x,label in [(1137,"Tor 入口"),(853,"中继"),(571,"出口"),(285,"HTTPS 网站")]: body+=node(x,668,label,MINT if x==285 else PURPLE)
    body+=text(64,829,"网站看到 Tor 出口；代理服务方仍可能知道连接来源。访问 .onion 时不走此处的普通出口。",23,MUTED)
    figure("clash-chain.svg","先经过代理，再进入 Tor","这是本次实验的 Tor-over-proxy 路径，不是“入口和出口都变成同一个 VPN”。",body,"浏览器到本地 Tor，然后通过受限转发到 Clash、加密代理节点及 Tor 网络。图不公开本机端口或节点信息；不意味着其它应用同时获得隔离。")

    body=""
    entries=[("Riseup",13.00,"约 13 秒",MINT),("Tor Metrics",17.04,"约 17 秒",MINT),("Ahmia 首页",27.94,"约 28 秒",MINT),("Tor Project",45,"首次超过 45 秒；后续通过",AMBER),("SecureDrop",45,"首次超过 45 秒；后续通过",AMBER)]
    for i,(label,value,result,color) in enumerate(entries):
        y=286+i*89
        body+=text(70,y+28,label,27)+box(330,y,720,40,"#232332",stroke="none",radius=8)
        body+=box(330,y,int(720*min(value,45)/45),40,color,stroke="none",radius=8)
        if i>2:body+=f'<path d="M1050 {y}V{y+40}" stroke="{INK}" stroke-width="8" stroke-dasharray="5 5"/>'
        body+=text(1080,y+27,result,21,color)
    body+=box(64,785,1312,72)+text(90,831,"热缓存复测的 0.37 秒 / 3.52 秒，不能冒充首次加载速度。",28,AMBER)
    figure("observed-times.svg","能打开，不等于打开得快","2026-11-14 · 本次首次页面验收耗时（含检查，约值）· 单次记录，不是性能基准。",body,"五站单次验收记录：Riseup 13秒、Tor Metrics17秒、Ahmia28秒；Tor Project和SecureDrop首次超过45秒后续通过。复测缓存时间不能与首次加载作公平比较。")

    body=box(64,248,631,345)+box(727,248,649,345)
    body+=text(96,300,"地址栏 / 浏览器搜索引擎",27,MINT)+box(96,336,567,75,"#202f2e","#608875",12)
    body+=text(119,384,"Ahmia  ·  搜索词",29,MINT)+lines(96,476,["普通模式：Ahmia", "隐私模式：Ahmia", "设置与实际查询是两件事"],26,step=39)
    body+=text(760,300,"Tor 内置欢迎页搜索框",27,AMBER)+box(760,336,583,75,"#302b2b","#866e51",12)
    body+=text(785,384,"DuckDuckGo",29,AMBER)+lines(760,476,["此版本主页的独立实现", "不跟随地址栏默认引擎", "本次改为 Ahmia 主页 + 空白新标签"],24,step=39)
    body+=box(64,628,1312,211,"#292334","#6d527b")+text(100,679,"另一个没解决的问题",29,PURPLE)
    body+=lines(100,731,["Ahmia 首页打开了，但测试查询与正常表单提交都回到了首页。", "因此不能写“搜索已经完全正常”，更不能用首页截图代替结果页证据。"],27,step=51)
    figure("two-search-boxes.svg","“还是 DuckDuckGo”并不是看错了","两个看起来相似的搜索框，可以由完全不同的代码控制。",body,"实测已设Ahmia为普通和隐私搜索引擎，但Tor内置欢迎页单独使用DuckDuckGo。主页已替换，Ahmia查询仍返回首页，搜索功能未验证通过。")

    body=""
    entries=[("01","停止，比悄悄回退更重要",["专用通道失效 → 连接失败", "不把直连当作“自动修复”"],MINT),("02","隔离有范围，不是全机护盾",["覆盖这个启动方式中的浏览器与 Tor", "外部阅读器、其它应用不在此证明内"],PURPLE),("03","匿名也有无法忽略的对手",["登录身份、漏洞、恶意软件、流量关联", "代理服务方与多点观察者仍需考虑"],AMBER)]
    for i,(number,title,rows,color) in enumerate(entries):
        y=252+i*200; body+=box(64,y,1312,175)+text(99,y+62,number,37,color)+text(187,y+58,title,31,WHITE)
        body+=lines(187,y+107,rows,25,step=39)
    figure("privacy-boundaries.svg","隐私是一组边界，不是一句保证","保留官方抗指纹设计、HTTPS 和更新；不要把新增代理层当作“绝对匿名”。",body,"本次设置减少意外直连风险，但不覆盖外部程序，也不防御所有漏洞、身份关联、恶意软件或大范围流量观察。不能许诺绝对不泄漏。")


def prepare_art(directory):
    from PIL import Image
    for source,target in [("cover.png","cover.webp"),("rendezvous.png","rendezvous-art.webp"),("gate.png","gate-art.webp")]:
        with Image.open(directory/source) as image:
            image.convert("RGB").save(OUT/target,"WEBP",quality=84,method=6)


def prepare_evidence(directory):
    from PIL import Image, ImageDraw, ImageFont, ImageOps
    font_path="/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
    font=lambda size:ImageFont.truetype(font_path,size,index=2)
    canvas=Image.new("RGB",(1440,960),INK)
    draw=ImageDraw.Draw(canvas)
    draw.text((48,34),"OBSERVATION / 2026-11-14",font=font(20),fill=PURPLE)
    draw.text((48,78),"五个站点，五份实际页面证据",font=font(42),fill=WHITE)
    draw.text((48,145),"浏览器正文 + HTTP 200 + 页面截图；不是代理握手截图。",font=font(23),fill=MUTED)
    captures=[("Riseup","Riseup.png"),("Tor Metrics","Tor-Metrics.png"),("Ahmia","Ahmia.png"),("Tor Project","Tor-Project-retry.png"),("SecureDrop","SecureDrop-retry.png")]
    for i,(label,filename) in enumerate(captures):
        if i<3:x,y,w=48+i*453,217,435
        else:x,y,w=48+(i-3)*680,548,662
        h=245
        draw.rounded_rectangle((x,y,x+w,y+h+57),radius=12,fill=SOFT,outline=LINE,width=2)
        with Image.open(directory/filename) as original:
            # Only site viewport images; no address bar, profile, bookmarks, cookie or IP data.
            thumb=ImageOps.fit(original.convert("RGB"),(w-4,h),method=Image.Resampling.LANCZOS,centering=(.5,0))
            canvas.paste(thumb,(x+2,y+2))
        draw.text((x+15,y+h+13),label,font=font(23),fill=WHITE)
        draw.text((x+w-127,y+h+16),"HTTP 200",font=font(19),fill=MINT)
    draw.text((48,896),"本次观察 ≠ 持续在线承诺。截图内各站点标志与内容权利归原权利人。",font=font(21),fill=MUTED)
    canvas.save(OUT/"five-sites-evidence.webp","WEBP",quality=86,method=6)


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--art-dir",type=Path)
    parser.add_argument("--evidence-dir",type=Path)
    args=parser.parse_args()
    build_diagrams()
    if args.art_dir:prepare_art(args.art_dir)
    if args.evidence_dir:prepare_evidence(args.evidence_dir)
    print("Built public, explanatory Tor essay figures in",OUT.relative_to(ROOT))
