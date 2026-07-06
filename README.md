# 曾子墨的个人主页

> 华中科技大学 · 计算机科学与技术 2507 班 · 我的第一个个人网站 🚀

## 项目简介

这是我大一上学期用纯 HTML、CSS 和 JavaScript 构建的个人主页，用于记录大学生活、展示兴趣爱好、练习前端技能。从最初的粗糙排版到现在的现代化设计，见证了我网页开发的学习历程。

## 在线访问

🔗 **https://lifelonglearnerAdam.github.io/Myweb/**

> 如果还无法访问，请在仓库 Settings → Pages 中将 Source 设为 `master` 分支，目录选 `/ (root)`，然后点击 Save。

## 页面导航

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `index.html` | 个人名片 + Hero 区域 + 快速导航卡片 |
| 关于我 | `web/about.html` | 基本信息网格 + 自我介绍 |
| 我的爱好 | `web/hobby.html` | 六宫格卡片展示编程 / 阅读 / 旅行 / 美食 / 电影 / 摄影 |
| 我的相册 | `web/photo.html` | 自适应网格 + 悬停缩放 + 点击灯箱大图预览 |
| 我的随笔 | `web/myessay.html` | 时间线布局，记录校园日常与编程学习心得 |
| 联系我 | `web/contact.html` | 邮箱 / 电话 / 微信，带图标分组的联系方式卡片 |

## 项目结构

```
MyWeb/
├── index.html              # 首页入口
├── css/
│   └── style.css           # 全局样式（CSS 变量、响应式、动画）
├── js/
│   └── main.js             # 导航交互、移动端菜单、页面高亮
├── image/                  # 图片资源目录
│   ├── avatar.jpg          # 头像
│   └── ...                 # 相册图片
├── web/
│   ├── about.html          # 关于我
│   ├── hobby.html          # 我的爱好
│   ├── myessay.html        # 我的随笔
│   ├── photo.html          # 我的相册（含灯箱效果）
│   └── contact.html        # 联系我
├── .gitignore
└── README.md
```

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 语义化标签，页面结构 |
| CSS3 Variables | 全局主题色、统一设计语言 |
| CSS Grid / Flexbox | 响应式布局 |
| CSS Animations | 入场动画、悬停效果、心跳动画 |
| JavaScript (Vanilla) | 移动端汉堡菜单、灯箱预览、导航高亮 |

## 设计亮点

- **CSS 变量主题系统** — 修改 `:root` 中的变量即可换肤
- **毛玻璃导航栏** — `backdrop-filter: blur()` 实现 iOS 风格导航
- **渐变标题** — 首页名字使用 CSS 渐变文字效果
- **时间线随笔** — 伪元素实现的纵向时间线，按日期排列
- **图片灯箱** — 点击图片弹出全屏预览，支持 ESC 关闭
- **懒加载** — 相册图片使用 `loading="lazy"` 优化性能
- **全站响应式** — 768px 断点适配手机和平板
- **入场动画** — `fadeInUp` 动画配合 `animation-delay` 实现依次出现

## 本地运行

无需任何构建工具或 Node.js，三种方式任选：

```bash
# 方式一：直接用浏览器打开
start index.html

# 方式二：用 Python 起本地服务器
python -m http.server 8080

# 方式三：用 VS Code Live Server 插件
# 右键 index.html → Open with Live Server
```

## Git 操作速查

```bash
# 克隆仓库
git clone https://github.com/lifelonglearnerAdam/Myweb.git

# 修改后提交
git add -A
git commit -m "描述你的修改"
git push
```

## 更新日志

| 时间 | 版本 | 说明 |
|------|------|------|
| 2025-11 | v0.1 | 初版，完成基本页面结构与内容 |
| 2025-12 | v1.0 | 全面重构：统一设计语言、响应式布局、交互动效、README |

## 待完善

- [ ] 添加更多随笔内容
- [ ] 暗色模式切换
- [ ] 相册分类标签

## 作者

**曾子墨** — 华中科技大学 CS 2507

📧 2319597720@qq.com

---

好好学习，天天向上 💪
