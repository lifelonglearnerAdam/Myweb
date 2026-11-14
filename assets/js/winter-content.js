/* A rewritten, self-paced personal learning guide. No internal handouts or affiliations are published. */
window.WINTER_GUIDE = {
  title: { zh: "冬日共学", en: "Winter study notes" },
  intro: { zh: "寒假可以拿来做一个小东西。不用一下学完一整套课程，选个喜欢的方向，边查文档边动手。这里放的是我整理的路线，也欢迎一起讨论。", en: "A winter break can be enough to build one small thing. Pick a direction, read the docs, and try it. These are study routes I put together; questions and conversations are welcome." },
  note: { zh: "这是一份自学与交流计划，不是已经开营的活动。暂时不设统一日期、报名或验收。", en: "This is a self-study and discussion plan, not a scheduled event. There are no fixed dates, registration, or assessment." },
  common: [
    { id: "setup", title: { zh: "先把环境跑起来", en: "Get a working setup" }, text: { zh: "选一个顺手的编辑器。用终端运行一个小程序，遇到报错时先把完整信息记下来。没必要一开始就折腾双系统或买服务器。", en: "Use an editor you like. Run a small program from a terminal and keep the full error message when it fails. A new operating system or paid server is not a prerequisite." } },
    { id: "git", title: { zh: "留下一点记录", en: "Keep a record" }, text: { zh: "建一个自己的仓库，练习提交、看差异和回退。每天写几行笔记：今天做了什么，卡在哪里，下一步想试什么。", en: "Create a repository and practice commits, diffs, and reverting. A few lines a day are enough: what worked, what did not, and what to try next." } },
    { id: "understand", title: { zh: "AI 可以帮忙，代码要自己看懂", en: "Use AI, but understand the code" }, text: { zh: "可以用 AI 查问题、解释代码或起草测试。拿到答案后实际运行，改一个输入试试，再用自己的话说明它为什么这样做。", en: "AI can help explain code, debug, or draft tests. Run the result, change an input, and explain the behavior in your own words." } }
  ],
  tracks: [
    {
      id: "web", number: "01", label: "WEB", name: { zh: "前端：做一个网页", en: "Frontend: make a web page" },
      summary: { zh: "从 HTML、CSS 和 JavaScript 开始，最后做出能在手机和电脑上用的小页面。", en: "Start with HTML, CSS, and JavaScript, then make a small page that works on a phone and a computer." },
      steps: [
        { id: "web-layout", title: { zh: "排一个读得舒服的页面", en: "Build a readable layout" }, text: { zh: "写一个介绍页或读书卡片。试试 Flex 和 Grid，调整文字宽度、图片比例、留白和手机布局。", en: "Build an introduction page or a reading card. Try Flex and Grid, then adjust line length, images, spacing, and the phone layout." } },
        { id: "web-events", title: { zh: "让按钮真的有用", en: "Make the controls work" }, text: { zh: "用 JavaScript 做添加、修改、删除和筛选。待办清单就很好，不需要先追求复杂效果。", en: "Use JavaScript to add, edit, delete, and filter items. A to-do list is enough; elaborate animation can wait." } },
        { id: "web-storage", title: { zh: "刷新后还在", en: "Keep data after refresh" }, text: { zh: "保存页面状态，处理空内容、重复输入和误操作。用键盘试一遍，再找一部手机试试。", en: "Save state and handle empty or repeated input. Test with a keyboard, then on a real phone." } },
        { id: "web-finish", title: { zh: "把它放到网上", en: "Publish it" }, text: { zh: "写一份简短 README，说明怎么运行。如果还有兴趣，再用 React 或 Vue 重做一遍，比较两种写法。", en: "Write a short README with run instructions. If you want to continue, rebuild it in React or Vue and compare the two versions." } }
      ],
      extra: { zh: "可以继续试：请求一个公开 API、做一个多页小站，或给页面补上无障碍支持。", en: "Next ideas: use a public API, make a small multi-page site, or improve accessibility." },
      links: [ { label: "MDN", url: "https://developer.mozilla.org/zh-CN/docs/Learn_web_development" }, { label: "JavaScript.info", url: "https://javascript.info/" }, { label: "React", url: "https://react.dev/learn" }, { label: "Vue", url: "https://cn.vuejs.org/guide/introduction.html" } ]
    },
    {
      id: "backend", number: "02", label: "SERVER", name: { zh: "后端：让数据来回走", en: "Backend: move some data" },
      summary: { zh: "弄明白请求、接口和数据库，再把一个小服务完整跑起来。", en: "Learn requests, APIs, and databases, then run a small service end to end." },
      steps: [
        { id: "backend-http", title: { zh: "看看浏览器发了什么", en: "Look at a request" }, text: { zh: "打开开发者工具，看一次请求的方法、状态码和响应。用自己熟悉的语言起一个服务，返回一段 JSON。", en: "Inspect a method, status code, and response in browser tools. Start a service in a language you know and return some JSON." } },
        { id: "backend-api", title: { zh: "做几条小接口", en: "Write a few endpoints" }, text: { zh: "给笔记或清单做增删改查。检查输入，分清“没有数据”和“服务出错”，用测试或接口工具跑一遍。", en: "Add CRUD endpoints for notes or a list. Validate input and distinguish an empty result from a server failure. Exercise the endpoints with tests or an API client." } },
        { id: "backend-db", title: { zh: "把数据存好", en: "Store the data" }, text: { zh: "先选 SQLite 或 PostgreSQL。设计简单表结构，试着分页、搜索和处理重复记录。先不用同时装很多种数据库。", en: "Choose SQLite or PostgreSQL first. Design a small schema, then try pagination, search, and duplicate handling. One database is enough to begin." } },
        { id: "backend-deploy", title: { zh: "换个环境也能运行", en: "Run it somewhere else" }, text: { zh: "写清环境变量和启动命令。进阶可以加 Docker Compose，理解应用与数据库怎样连接，密码不要提交进仓库。", en: "Document environment variables and startup commands. Optionally add Docker Compose and understand how the app reaches its database. Keep passwords out of Git." } }
      ],
      extra: { zh: "可以继续试：登录与权限、限频、缓存，或者让前端页面用上你的接口。", en: "Next ideas: authentication, permissions, rate limits, caching, or connecting a frontend." },
      links: [ { label: "HTTP / MDN", url: "https://developer.mozilla.org/zh-CN/docs/Web/HTTP" }, { label: "FastAPI", url: "https://fastapi.tiangolo.com/zh/" }, { label: "PostgreSQL", url: "https://www.postgresql.org/docs/" }, { label: "Docker Compose", url: "https://docs.docker.com/compose/" } ]
    },
    {
      id: "models", number: "03", label: "MODELS", name: { zh: "模型：从一个小实验开始", en: "Models: start with a small experiment" },
      summary: { zh: "先把张量、数据和训练循环弄明白，不急着追大模型。", en: "Understand tensors, data, and a training loop before chasing bigger models." },
      steps: [
        { id: "models-python", title: { zh: "Python 和张量", en: "Python and tensors" }, text: { zh: "练习读文件、处理数组和画图。创建张量，检查形状，做一次矩阵运算，知道每个维度代表什么。", en: "Practice reading files, working with arrays, and plotting. Create tensors and check shapes before and after matrix operations." } },
        { id: "models-regression", title: { zh: "拟合一条线", en: "Fit a line" }, text: { zh: "用小数据做线性回归，画出预测和损失。改一改学习率，看看训练会发生什么。", en: "Fit linear regression to a tiny dataset. Plot predictions and loss, then change the learning rate and observe the behavior." } },
        { id: "models-classify", title: { zh: "做一次分类", en: "Train a classifier" }, text: { zh: "从一个小网络开始，划分训练与验证数据。除了准确率，也挑几张分错的样本看看。", en: "Start with a small network and separate training from validation. Alongside accuracy, inspect a few mistakes." } },
        { id: "models-record", title: { zh: "让实验能重跑", en: "Make the experiment repeatable" }, text: { zh: "记下环境、随机种子和参数。保存模型，再写一段推理代码；一次只改一个东西，留下对照。", en: "Record the environment, seed, and settings. Save the model and write inference code. Change one thing at a time and keep the comparison." } }
      ],
      extra: { zh: "可以继续试：CNN、一个小的图像任务，或读一篇与当前实验有关的论文。", en: "Next ideas: a CNN, a small image task, or a paper related to the experiment." },
      links: [ { label: "Python", url: "https://docs.python.org/zh-cn/3/tutorial/" }, { label: "PyTorch", url: "https://pytorch.org/tutorials/beginner/basics/intro.html" }, { label: "D2L", url: "https://zh.d2l.ai/" } ]
    },
    {
      id: "design", number: "04", label: "DESIGN", name: { zh: "表达：把一件事讲明白", en: "Communication: explain one thing clearly" },
      summary: { zh: "给自己的项目做几页说明。少一点装饰，多想想读者需要先知道什么。", en: "Make a few pages about your own project. Think about what the reader needs first, before decorating it." },
      steps: [
        { id: "design-story", title: { zh: "先写三句话", en: "Start with three sentences" }, text: { zh: "这是什么？解决什么问题？读者能在哪里试用？写不清时先缩小题目，不急着挑模板。", en: "What is it? What problem does it solve? Where can someone try it? Narrow the subject if these are hard to answer." } },
        { id: "design-layout", title: { zh: "排好层次", en: "Set a clear hierarchy" }, text: { zh: "选两种以内的字体，统一对齐和间距。一页尽量只说一件事，标题能让人直接知道结论。", en: "Use no more than two typefaces and consistent alignment and spacing. Keep each page focused on one point." } },
        { id: "design-figure", title: { zh: "画一张图", en: "Make one useful figure" }, text: { zh: "把数据整理成简单图表，或者画一张流程图。标清单位、来源和条件，不用装饰性数字凑版面。", en: "Make a simple chart or process diagram. Label units, sources, and conditions; do not add numbers just to fill space." } },
        { id: "design-share", title: { zh: "讲给别人听", en: "Explain it to someone" }, text: { zh: "试着三分钟讲完，让朋友指出哪一页没听懂。把反馈记下来，改一遍，再保留前后版本。", en: "Try a three-minute explanation and ask a friend which part was unclear. Revise it and keep both versions." } }
      ],
      extra: { zh: "可以继续试：给前面三个方向的项目写一份 README，或者做一个简短演示。", en: "Next ideas: a README or short demo for one of the other tracks." },
      links: [ { label: "Markdown Guide", url: "https://www.markdownguide.org/basic-syntax/" }, { label: "Mermaid", url: "https://mermaid.js.org/intro/" } ]
    }
  ]
};
