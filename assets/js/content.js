/* Public portfolio content. Keep credentials, private research and personal data out of this file. */
window.PORTFOLIO = {
  profile: {
    name: { zh: "曾子墨", en: "Zimo Zeng" },
    alias: "Adam",
    motto: "stay young, stay simple, stay hungry, stay foolish",
    github: "https://github.com/lifelonglearnerAdam",
    courseRepo: "https://github.com/lifelonglearnerAdam/hust-course-notes",
    email: "zimozeng961@gmail.com",
    secondaryEmail: "2319597720@qq.com",
    university: { zh: "华中科技大学", en: "Huazhong University of Science and Technology" },
    major: { zh: "计算机科学与技术 · 本科在读", en: "Undergraduate · Computer Science & Technology" },
    education: "2025 — Present"
  },
  ui: {
    zh: {
      pageTitle: "子墨的博客 · Zimo Zeng",
      pageDescription: "曾子墨（Adam），华中科技大学计算机科学与技术本科生。关注文档智能、可解释 AI 与软件工程，分享研究探索、开源项目与技术笔记。",
      courses: "课程记录", winter: "冬日共学", allNotes: "全部文章", noNotesTitle: "文章还没写好，先留个位置。", noNotesText: "以后会慢慢放学习笔记和日常记录。现在可以看看项目，或者一起做点寒假小练习。", winterPreviewTitle: "寒假一起做点小东西", winterPreviewText: "前端、后端、模型和表达，选一条路线，从能运行的小东西开始。", winterRead: "打开共学手册", winterCommon: "开始之前", winterTracks: "选一个方向", winterProgress: "完成进度", winterResources: "参考文档", winterExtra: "有余力再试", winterReset: "清除勾选", winterLocal: "勾选只保存在这台设备，不是报名或打卡记录。", copyPrimaryEmail: "复制 Gmail", rss: "订阅 RSS", originalLanguage: "显示原文", sidebarTitle: "博客导航",
      skip: "跳至主要内容", home: "首页", projects: "项目", research: "研究", writing: "文章", archive: "归档", about: "关于", contact: "联系",
      navigation: "主导航", menuOpen: "打开导航菜单", menuClose: "关闭导航菜单", light: "切换到浅色模式", dark: "切换到深色模式",
      language: "选择语言", heroEyebrow: "曾子墨 / ZIMO ZENG / ADAM", heroLine1: "子墨的博客", heroLine2: "写点代码，也记点别的。",
      heroDescription: "学习笔记、做过的小东西，还有没想明白的问题。慢慢写，慢慢补。",
      heroAction: "看看最近写的", heroSecondary: "关于我", heroFootnote: "LEARN DEEPLY. BUILD THOUGHTFULLY.",
      profileRole: "文档智能 / AI 应用 / 软件工程", profileSchool: "华中科技大学", profileMajor: "计算机科学与技术 · 本科在读",
      profileLocation: "中国 · 武汉", profileStatus: "开放研究交流与项目合作", profileProjects: "项目档案", profileNotes: "技术手记", profileDirections: "关注方向",
      viewResume: "查看简历", profileNote: "stay young, stay simple,\nstay hungry, stay foolish", sidebarLabel: "个人资料与页面导航", elsewhere: "在别处找到我",
      introEyebrow: "A LITTLE INTRODUCTION", introTitle: "你好，我是子墨，也叫 Adam。", introP1: "在华科读计算机，平时写点代码，最近对文档识别比较感兴趣。",
      introP2: "博客刚开始整理。先放一些项目和学习路线，文章以后慢慢写。",
      introTag1: "Document Intelligence", introTag2: "Applied AI", introTag3: "Software Engineering",
      projectsEyebrow: "01 / SELECTED WORK", projectsTitle: "做过的东西", projectsDescription: "有演示，也有源码。感兴趣的话可以点开看看。",
      filterLabel: "按项目类别筛选", filterAll: "全部作品", filterAI: "AI 应用", filterEngineering: "工程产品", resultCount: "个项目", details: "项目档案", source: "源代码", demo: "在线体验", readReport: "查看报告", moreProjects: "也在认真打磨这些", allGithub: "更多作品在 GitHub",
      researchEyebrow: "02 / RESEARCH EXPLORATIONS", researchTitle: "最近在看什么", researchDescription: "关注文档智能、多模态理解与模型可靠性，在阅读、实践和交流中持续探索。", researchWorkspace: "一些持续探索的问题", researchWorkspaceNote: "关于理解、表达，以及模型与真实世界之间的距离。", researchReading: "阅读与思考", researchReadingText: "在文档理解、机器学习与计算机系统之间，保持阅读，也保持自己的问题。", backupEmail: "备用邮箱",
      researchKicker: "文档智能 · 研究实践", researchName: "手写文档解析与结构化误差分析", researchSummary: "基于 MonkeyOCRv2 与 OmniDocBench，聚焦手写笔记中的表格结构恢复和公式识别。将原图、标注与预测逐项对齐，让抽象分数落到可定位、可解释的失败样本。",
      researchScope1: "表格诊断样本", researchScope2: "公式诊断样本", researchScope3: "三方对照", researchScope3Value: "Image / GT / Pred.", researchContribution: "我的工作", researchContributionText: "负责表格与公式专项的样本初审、缺陷归因与可视化对照报告，区分结构错误、内容错误与不可用输出。",
      researchStatus: "基线诊断与公开报告", researchBoundary: "诊断样本仅用于测试分析，与训练数据隔离。", researchMethodTitle: "研究里的几个坚持", method1Title: "先建立可信基线", method1Text: "固定版本、输入与评测口径，再讨论方法有没有进步。", method2Title: "让每个判断有证据", method2Text: "把指标、原始输出和典型失败样本放在一起看。", method3Title: "区分探索与结论", method3Text: "把已完成的工作、实验边界和待验证的假设写清楚。", researchOngoing: "持续关注", researchOngoingText: "阅读顺序建模、文档解析可靠性，以及面向真实场景的模型评测。",
      writingEyebrow: "03 / FIELD NOTES", writingTitle: "最近写的", writingDescription: "学习笔记和随记，写好了就放在这里。", readNote: "阅读手记", minutes: "分钟阅读", archiveEyebrow: "THE INDEX / WORK & WORDS", archiveTitle: "文章和项目", archiveDescription: "按关键词找一找，或者只看文章、只看项目。", archiveSearch: "搜索项目、技术栈或手记", archivePlaceholder: "试试 OCR、Flutter、可解释、SAT…", archiveAll: "全部内容", archiveProjects: "项目档案", archiveNotes: "技术手记", archiveCount: "项内容", archiveEmpty: "还没有找到这一条线索。", archiveEmptyText: "试试换一个关键词，或者看看全部内容。", clearSearch: "清除搜索与筛选", viewArchive: "浏览完整归档", noteToc: "本文目录", copyLink: "复制文章链接", linkCopied: "文章链接已复制",
      aboutEyebrow: "04 / BEHIND THE WORK", aboutTitle: "关于我", aboutP1: "曾子墨，华中科技大学计算机科学与技术本科在读。GitHub 上用 lifelonglearnerAdam 这个名字。",
      aboutP2: "代码之外，喜欢阅读、摄影和散步。",
      educationTitle: "教育背景", educationSchool: "华中科技大学", educationMajor: "计算机科学与技术 · 本科", educationTime: "2025 — 至今", educationDescription: "围绕数据结构、计算机系统、程序设计与数字逻辑持续打基础，同时开展文档智能研究实践与独立软件开发。",
      toolkit: "实践中的技术栈", toolkitNote: "工具服务于问题，而不是反过来。", skillLanguages: "语言与算法", skillAI: "AI 与实验", skillProduct: "产品与工程", skillWorkflow: "开发工作流",
      contactEyebrow: "05 / LET’S CONNECT", contactTitle: "在这里找我", contactDescription: "邮件里简单写一下来意就好。", emailAction: "给我写信", copyEmail: "复制邮箱", emailCopied: "邮箱已复制", copyFailed: "复制未成功，请手动选中复制。", githubAction: "逛逛 GitHub", contactNote: "一封写明来意的邮件，会是很好的开始。",
      footerText: "个人博客", effectsOn: "关闭樱花动效", effectsOff: "开启樱花动效", musicPlayer: "背景钢琴音乐", musicTitle: "卡农 · 钢琴", musicPlaying: "轻声陪伴 · 循环中", musicPaused: "已暂停", musicReady: "点击开启 · 自动循环", musicLoading: "正在载入琴声…", musicUnavailable: "轻点重试", musicPlay: "播放卡农钢琴曲", musicPause: "暂停背景音乐", musicVolume: "背景音乐音量", transitionWords: "花开有时，探索无涯。", credits: "设计与素材致谢", backTop: "回到顶部", updated: "持续构建中", noScript: "此页面的项目筛选与中英文切换需要 JavaScript。你仍可通过邮箱和 GitHub 与我联系。",
      backHome: "返回主页", backProjects: "返回项目", projectOverview: "做了什么", projectHighlights: "几处实现", projectBoundary: "补充说明", projectStack: "用到的工具", projectScope: "说明", projectLinks: "代码与证据", relatedProjects: "继续探索", notFoundTitle: "这份档案还不在这里。", notFoundText: "链接可能不完整，回到主页看看其他作品吧。", noteContext: "基于项目实践整理的技术手记", noteRelated: "相关项目", printResume: "打印 / 保存 PDF", resumeTitle: "曾子墨 / Zimo Zeng", resumeRole: "文档智能 · AI 应用 · 软件工程", resumeSummaryTitle: "个人概述", resumeSummary: "华中科技大学计算机科学与技术本科生，关注文档智能与可解释 AI，具备从问题分析、实验验证到前后端及跨平台产品实现的项目实践。重视证据追溯、数据边界与可复现工作流。", resumeProjects: "精选项目", resumeResearch: "研究实践", resumeSkills: "技术与基础", resumeFootnote: "公开项目履历 · 详细实现与证据请访问个人主页和项目仓库。", resumeViewProject: "项目链接", guideMode: "指引", chatMode: "聊天", chatBackGuide: "← 返回指引", mascotModes: "苏苏的指引与聊天", chatOpen: "和苏苏聊一会儿 ✧", chatCollapse: "收起对话", chatWelcome: "你来啦，今天有什么小心事想讲给苏苏听呀～", chatYou: "你", chatSusu: "苏苏", chatConversation: "你和苏苏的对话", chatMemory: "记着最近 16 轮对话 · 刷新后清空", chatClear: "重新聊", chatRetry: "再试一次", chatCanceled: "这句还没说完，可以点重试呀～", chatDailyLimit: "今天的聊天额度用完啦，明天再见呀～", chatSending: "发送中", chatPlaceholder: "想对苏苏说什么呀？", chatSend: "发送", chatPrivacy: "AI 回复；仅发送当前聊天，请勿输入隐私。", chatThinking: "苏苏轻轻想一想～", chatUnavailable: "刚才没连上，点「再试一次」我再听听～", chatRateLimited: "慢一点点呀，等一会儿再聊～", chatEmpty: "先写一句想说的话吧～", chatLabel: "和苏苏聊一会儿", chatAi: "AI 同人陪伴 · 轻甜日常", mascotName: "苏苏向导", mascotOpen: "请出苏苏向导", mascotClose: "收起苏苏向导", mascotTalk: "点击聊天，拖动移动；方向键微调位置", mascotReset: "让苏苏回到角落", mascotDragged: "搬家成功～这里看风景也不错呀。", mascotHint: "拖动我，换个位置",  mascotGreeting: "你好呀，我是苏苏！想先看看 Adam 的作品，还是研究方向？", mascotProject: "看作品", mascotResearch: "聊研究", mascotContact: "联系 Adam", mascotReply1: "认真写的代码和小小的好奇心，都藏在这些作品里啦。", mascotReply2: "遇到看不懂的结果，就回到样本里找线索吧。", mascotReply3: "喜欢一个想法，就把它慢慢做出来呀。", mascotReply4: "轻轻的卡农，慢慢飘的花瓣。我陪你看一会儿吧～", mascotIdle: "我先安静陪你看一会儿。需要带路，再点点我就好！", mascotCredit: "同人动画素材与致谢", mascotAmbient1: "我在这里安静陪你呀。看到感兴趣的作品，点开档案就能看细节～", mascotAmbient2: "今天也要给好奇心留一点时间呀。", mascotAmbient3: "别着急，每一个看起来完整的作品，都是一点点做出来的。", mascotAmbient4: "如果有想一起研究的问题，给 Adam 写封邮件吧。", mascotAtProjects: "这些作品都有自己的项目档案。想看实现思路、源码或演示，我带你去～", mascotAtResearch: "这里是 Adam 的研究角落。比起只看分数，他更喜欢把问题追到具体样本里。", mascotAtWriting: "写下来的想法，会成为下一次动手的起点呀。", mascotAtAbout: "基础课和小实验，也在慢慢长成有用的能力。", mascotAtContact: "遇到有意思的问题，就从一句“你好”开始吧～", mascotNight: "夜深也要记得休息呀，好想法明天还会在的。"
    },
    en: {
      pageTitle: "Zimo’s blog · 曾子墨",
      pageDescription: "Zimo Zeng (Adam), a Computer Science undergraduate at HUST. Exploring document intelligence, explainable AI and software engineering through research, open-source projects and field notes.",
      courses: "Course notes", winter: "Winter notes", allNotes: "All articles", noNotesTitle: "The first post is still on its way.", noNotesText: "Study notes and everyday things will arrive here in time. For now, there are projects and a few winter study routes to explore.", winterPreviewTitle: "Build something over the break", winterPreviewText: "Frontend, backend, models, or communication. Pick a route and start with one small working thing.", winterRead: "Open the study guide", winterCommon: "Before starting", winterTracks: "Choose a direction", winterProgress: "Progress", winterResources: "Useful docs", winterExtra: "If you want to continue", winterReset: "Clear progress", winterLocal: "Checks stay on this device. This is not registration or attendance tracking.", copyPrimaryEmail: "Copy Gmail", rss: "RSS feed", originalLanguage: "Original text", sidebarTitle: "Blog navigation",
      skip: "Skip to main content", home: "Home", projects: "Projects", research: "Research", writing: "Posts", archive: "Archive", about: "About", contact: "Contact",
      navigation: "Main navigation", menuOpen: "Open navigation", menuClose: "Close navigation", light: "Switch to light mode", dark: "Switch to dark mode", language: "Choose language",
      heroEyebrow: "ZIMO ZENG / ADAM / 曾子墨", heroLine1: "Zimo’s blog.", heroLine2: "Code, notes & a few other things.", heroDescription: "A place for things I learn, small projects, and questions I’m still working on.", heroAction: "Read the notes", heroSecondary: "About me", heroFootnote: "LEARN DEEPLY. BUILD THOUGHTFULLY.",
      profileRole: "Document intelligence / Applied AI / Engineering", profileSchool: "Huazhong University of Science and Technology", profileMajor: "Computer Science · Undergraduate", profileLocation: "Wuhan, China", profileStatus: "Open to research & collaboration", profileProjects: "Projects", profileNotes: "Field notes", profileDirections: "Focus areas", viewResume: "View résumé", profileNote: "stay young, stay simple,\nstay hungry, stay foolish", sidebarLabel: "Profile and section navigation", elsewhere: "ELSEWHERE",
      introEyebrow: "A LITTLE INTRODUCTION", introTitle: "Hi, I’m Zimo. Adam works too.", introP1: "I study Computer Science at HUST, write some code, and have been spending time on document recognition.", introP2: "This blog is still getting started. Projects and study routes are here first; the articles will follow.", introTag1: "Document Intelligence", introTag2: "Applied AI", introTag3: "Software Engineering",
      projectsEyebrow: "01 / SELECTED WORK", projectsTitle: "Things I’ve built", projectsDescription: "A few projects, with demos and code where available.", filterLabel: "Filter projects by category", filterAll: "All work", filterAI: "Applied AI", filterEngineering: "Engineering", resultCount: "projects", details: "Case study", source: "Source code", demo: "Live demo", readReport: "Read report", moreProjects: "More things I’m building", allGithub: "More on GitHub",
      researchEyebrow: "02 / RESEARCH EXPLORATIONS", researchTitle: "What I’m looking into", researchDescription: "An ongoing curiosity about document intelligence, multimodal understanding, and reliable models—shaped by reading, building, and conversations.", researchWorkspace: "Questions I keep coming back to", researchWorkspaceNote: "Understanding, representation, and the distance between models and the world.", researchReading: "READING & REFLECTION", researchReadingText: "Reading across document understanding, machine learning, and computer systems—and keeping a few questions of my own.", backupEmail: "Alternative email", researchKicker: "DOCUMENT INTELLIGENCE · RESEARCH PRACTICE", researchName: "Handwritten document parsing & structured error analysis", researchSummary: "Using MonkeyOCRv2 and OmniDocBench to examine table structure recovery and formula recognition in handwritten notes. Aligning images, ground truth, and predictions to turn aggregate scores into interpretable failure cases.", researchScope1: "Table crops reviewed", researchScope2: "Formula crops reviewed", researchScope3: "Side-by-side evidence", researchScope3Value: "Image / GT / Pred.", researchContribution: "My contribution", researchContributionText: "Initial review of table and formula samples, defect categorization, and a visual comparison report that distinguishes structural damage, content errors, and unusable output.", researchStatus: "Baseline diagnostics & public report", researchBoundary: "Diagnostic samples are evaluation-only and kept separate from training data.", researchMethodTitle: "How I approach research", method1Title: "Start with a trustworthy baseline", method1Text: "Freeze versions, inputs, and evaluation rules before discussing improvements.", method2Title: "Keep evidence close to claims", method2Text: "Inspect metrics alongside raw output and representative failures.", method3Title: "Separate exploration from conclusions", method3Text: "Make completed work, experimental limits, and open hypotheses explicit.", researchOngoing: "QUESTIONS I KEEP EXPLORING", researchOngoingText: "Reading order, document parsing reliability, and model evaluation grounded in real-world use.",
      writingEyebrow: "03 / FIELD NOTES", writingTitle: "Recent notes", writingDescription: "Study notes and the occasional other thing.", readNote: "Read note", minutes: "min read", archiveEyebrow: "THE INDEX / WORK & WORDS", archiveTitle: "Archive", archiveDescription: "Search by a keyword, or filter articles and projects.", archiveSearch: "Search projects, tools, and notes", archivePlaceholder: "Try OCR, Flutter, explainability, SAT…", archiveAll: "Everything", archiveProjects: "Projects", archiveNotes: "Field notes", archiveCount: "entries", archiveEmpty: "This trail is still unwritten.", archiveEmptyText: "Try another keyword, or explore the complete collection.", clearSearch: "Clear search & filters", viewArchive: "Explore the full archive", noteToc: "ON THIS PAGE", copyLink: "Copy article link", linkCopied: "Article link copied",
      aboutEyebrow: "04 / BEHIND THE WORK", aboutTitle: "About me", aboutP1: "I’m Zimo Zeng, a Computer Science undergraduate at HUST. On GitHub I go by lifelonglearnerAdam.", aboutP2: "Away from the keyboard, I like reading, photography, and walking.", educationTitle: "Education", educationSchool: "Huazhong University of Science and Technology", educationMajor: "B.Eng. studies · Computer Science & Technology", educationTime: "2025 — Present", educationDescription: "Building foundations in data structures, computer systems, programming, and digital logic, alongside document-intelligence research practice and independent software development.", toolkit: "A working toolkit", toolkitNote: "Choose tools to fit the question—not the other way around.", skillLanguages: "Languages & algorithms", skillAI: "AI & experimentation", skillProduct: "Product & engineering", skillWorkflow: "Development workflow",
      contactEyebrow: "05 / LET’S CONNECT", contactTitle: "Find me here", contactDescription: "A short email with a little context is welcome.", emailAction: "Say hello", copyEmail: "Copy email", emailCopied: "Email copied", copyFailed: "Couldn’t copy automatically. Please select and copy the text manually.", githubAction: "Visit my GitHub", contactNote: "A short email with a little context is a great start.", footerText: "Personal blog", effectsOn: "Pause sakura effects", effectsOff: "Enable sakura effects", musicPlayer: "Background piano music", musicTitle: "Canon · Piano", musicPlaying: "A quiet loop", musicPaused: "Paused", musicReady: "Tap once · loops automatically", musicLoading: "Loading piano…", musicUnavailable: "Tap to retry", musicPlay: "Play Canon in D", musicPause: "Pause background music", musicVolume: "Background music volume", transitionWords: "Petals in bloom. Curiosity without end.", credits: "Design & asset credits", backTop: "Back to top", updated: "A work in progress", noScript: "Project filters and language switching require JavaScript. You can still reach me by email or GitHub.",
      backHome: "Back to home", backProjects: "Back to projects", projectOverview: "The question & approach", projectHighlights: "Implementation highlights", projectBoundary: "Status & scope", projectStack: "Stack", projectScope: "Project context", projectLinks: "Code & evidence", relatedProjects: "Keep exploring", notFoundTitle: "This story isn’t here yet.", notFoundText: "The link may be incomplete. Head home to explore the other projects.", noteContext: "A technical reflection grounded in project practice", noteRelated: "Related project", printResume: "Print / Save as PDF", resumeTitle: "Zimo Zeng / 曾子墨", resumeRole: "Document Intelligence · Applied AI · Software Engineering", resumeSummaryTitle: "Profile", resumeSummary: "Computer Science undergraduate at HUST, interested in document intelligence and explainable AI. Project experience spans problem formulation, experimental validation, full-stack applications, and cross-platform software. Values traceable evidence, clear data boundaries, and reproducible workflows.", resumeProjects: "Selected projects", resumeResearch: "Research practice", resumeSkills: "Technical foundations", resumeFootnote: "Public project profile · Visit the portfolio and repositories for implementation details and evidence.", resumeViewProject: "Project link", guideMode: "Guide", chatMode: "Chat", chatBackGuide: "← Back to guide", mascotModes: "Susu guide and chat modes", chatOpen: "A little chat with Susu ✧", chatCollapse: "Hide conversation", chatWelcome: "There you are! What little story shall we share today?", chatYou: "You", chatSusu: "Susu", chatConversation: "Your conversation with Susu", chatMemory: "Remembers 16 recent turns · clears on refresh", chatClear: "Start fresh", chatRetry: "Try again", chatCanceled: "That reply was interrupted; you can try again～", chatDailyLimit: "Today’s chat allowance is used up; see you tomorrow～", chatSending: "Sending", chatPlaceholder: "What’s on your mind?", chatSend: "Send", chatPrivacy: "AI replies; only this chat is sent. Please avoid private details.", chatThinking: "Let me think for a tiny moment～", chatUnavailable: "I couldn’t connect just now; tap Try again～", chatRateLimited: "A little breather, then we can chat again～", chatEmpty: "Write a tiny hello first～", chatLabel: "A little time with Susu", chatAi: "AI fan companion · sweet everyday chats", mascotName: "Susu, your guide", mascotOpen: "Invite Susu over", mascotClose: "Minimize Susu", mascotTalk: "Click to chat, drag to move; arrow keys adjust position", mascotReset: "Return Susu to her corner", mascotDragged: "A new little spot! The view is lovely from here too.", mascotHint: "Drag me to a new spot",  mascotGreeting: "Hi, I’m Susu! Shall we explore Adam’s projects or his research first?", mascotProject: "Projects", mascotResearch: "Research", mascotContact: "Say hello", mascotReply1: "A little curiosity and a lot of care go into these projects.", mascotReply2: "When a result is puzzling, the samples are a good place to look.", mascotReply3: "Found an idea you love? Give it time, and build it step by step.", mascotReply4: "A little piano, a few drifting petals. I’ll keep you company while you explore.", mascotIdle: "I’ll keep you company quietly. Tap me whenever you need a guide!", mascotCredit: "Fan-art animation credits", mascotAmbient1: "I’m here quietly keeping you company. A project caught your eye? Open its case study for the details!", mascotAmbient2: "Leave a little room for curiosity today.", mascotAmbient3: "Take your time. Every finished project was built one small step at a time.", mascotAmbient4: "Have a question worth exploring together? Send Adam a little hello.", mascotAtProjects: "Each project has a case study. Let’s look at the ideas, implementation, code, and demos!", mascotAtResearch: "This is Adam’s research corner. He likes tracing a result back to the samples behind the score.", mascotAtWriting: "Writing an idea down gives the next project a place to begin.", mascotAtAbout: "Foundations and small experiments grow into useful abilities, little by little.", mascotAtContact: "A worthwhile collaboration can start with one simple hello.", mascotNight: "It’s getting late. Rest a little—the good questions will still be here tomorrow."
    }
  },
  projects: [
    {
      id: "docsift", category: "ai", featured: true, cover: "assets/images/docsift.webp", accent: "sky", stack: ["JavaScript", "PDF.js", "OpenAI-compatible API"],
      name: { zh: "析文 DocSift", en: "DocSift" },
      label: { zh: "文档智能 / 可追溯分析", en: "DOCUMENT INTELLIGENCE / TRACEABLE ANALYSIS" },
      summary: { zh: "在浏览器里读文档，整理摘要，点一条结果就能回到对应原文。", en: "A browser document reader with structured summaries and links back to the source text." },
      scope: { zh: "独立应用项目 · 浏览器端文档分析", en: "Independent application · Browser-based document analysis" },
      status: { zh: "可在线体验", en: "Live application" },
      overview: { zh: "合同、会议记录、简历和财报的难点，不只是“总结得快”，而是结论能否被核对。DocSift 将文档解析、类型识别、结构化抽取与原文定位串成一条工作流，用“结论 + 原文证据”降低阅读与核验成本。", en: "For contracts, meeting notes, résumés, and financial reports, a fast summary is not enough: findings need to be checkable. DocSift connects parsing, document classification, structured extraction, and source navigation into one workflow, making each finding easier to inspect." },
      highlights: {
        zh: ["支持 PDF 文字层、TXT、Markdown 与 DOCX；解析在浏览器本地进行。", "设计离线规则引擎与 OpenAI 兼容模型接口两条分析路径，兼顾可用性与语义能力。", "通过分句索引及引文匹配建立报告到原文的定位，点击发现即可回链高亮。", "使用原生 DecompressionStream 实现轻量 DOCX ZIP 解包，保持静态部署与低依赖。"],
        en: ["Parses text-layer PDFs, TXT, Markdown, and DOCX locally in the browser.", "Provides an offline rules engine and an OpenAI-compatible model path for different analysis needs.", "Connects findings to source sentences through sentence indices and quote matching, with click-to-highlight navigation.", "Uses native DecompressionStream for lightweight DOCX ZIP extraction, keeping deployment static and dependencies small."]
      },
      boundary: { zh: "本地规则引擎可离线运行；启用模型引擎时，待分析文本会发送至用户配置的 API 服务。回链提供核验入口，不意味着模型输出天然正确。", en: "The rules engine can run offline. When the model engine is enabled, analysis text is sent to the API endpoint configured by the user. Source links enable verification; they do not guarantee that a model’s findings are correct." },
      links: [ { kind: "demo", url: "https://lifelonglearneradam.github.io/docsift/" }, { kind: "source", url: "https://github.com/lifelonglearnerAdam/docsift" } ],
      resume: { zh: "实现浏览器端多格式解析、规则 / LLM 双引擎分析与结论回链高亮；原生 JavaScript 静态部署，关注可核验性与数据边界。", en: "Built browser-side multi-format parsing, rule/LLM analysis paths, and source-linked findings using a lightweight static JavaScript architecture." }
    },
    {
      id: "miniso", category: "ai", featured: true, cover: "assets/images/miniso.webp", accent: "lilac", stack: ["Python", "Multi-agent", "Conformal Prediction"],
      name: { zh: "AI 新品决策引擎", en: "AI Product Decision Engine" },
      label: { zh: "团队竞赛 / 可解释决策", en: "TEAM COMPETITION / EXPLAINABLE DECISIONS" },
      summary: { zh: "三人团队的竞赛项目，做了一个从趋势分析到创意筛选的工作台。", en: "A three-person competition project with a workspace for trends, product ideas, and review." },
      scope: { zh: "三人学生团队 · 独立竞赛验证项目", en: "Three-student team · Independent competition prototype" },
      status: { zh: "竞赛验证版", en: "Competition prototype" },
      overview: { zh: "面向消费零售的高频上新场景，团队将一次性 AI 创意生成扩展为一套决策支持工作流：趋势信号提供证据，多 Agent 形成结构化概念，多目标搜索与可制造性约束筛选候选，再通过校准区间表达不确定性，最终由人审批。", en: "For fast-moving consumer retail, the team expanded one-shot AI ideation into a decision-support workflow: evidence-backed trends, structured multi-agent concepts, multi-objective search with manufacturability constraints, calibrated uncertainty, and final human approval." },
      highlights: {
        zh: ["用训练窗、隔离窗与预测窗组织滚动回测，显式剔除决策时点不可得的结果字段。", "以分割保形校准表达候选的不确定性，不将单个分数包装成确定结论。", "结合多目标搜索、真正的非支配前沿和 DFM 规则，为创意筛选保留多种权衡。", "提供可复现实验入口、单元测试、持续集成与可视化评审工作台。"],
        en: ["Uses rolling backtests with training, embargo, and prediction windows, explicitly removing outcome fields unavailable at decision time.", "Expresses uncertainty through split conformal calibration rather than presenting a score as certainty.", "Combines multi-objective search, a non-dominated frontier, and DFM rules to preserve useful trade-offs.", "Includes reproducible experiment entry points, unit tests, CI, and a visual review workspace."]
      },
      boundary: { zh: "由三人学生团队独立完成的竞赛验证项目。当前使用合成数据验证算法路径与防泄漏控制；面向企业真实业务的效果验证与生产接入，属于后续试点范围。", en: "An independent competition prototype delivered by a three-student team. Current backtests validate algorithms and leakage controls on synthetic data; real-business evaluation and production integration remain part of a future pilot." },
      links: [ { kind: "demo", url: "https://lifelonglearneradam.github.io/miniso-ai-decision-engine/" }, { kind: "source", url: "https://github.com/lifelonglearnerAdam/miniso-ai-decision-engine" } ],
      resume: { zh: "三人团队竞赛项目：构建趋势证据、多 Agent 创意、校准验证与人工审批工作流，配套防泄漏滚动回测、测试与 CI；当前为合成数据验证版。", en: "Three-person competition project connecting trend evidence, multi-agent concepts, calibrated validation, and human review, with leakage-aware backtests, tests, and CI; validated on synthetic data." }
    },
    {
      id: "quantpilot", category: "ai", featured: true, cover: "assets/images/quantpilot.svg", accent: "violet", stack: ["TypeScript", "NestJS", "PostgreSQL"],
      name: { zh: "QuantPilot AI", en: "QuantPilot AI" },
      label: { zh: "全栈系统 / 研究与风险控制", en: "FULL-STACK SYSTEM / RESEARCH & RISK" },
      summary: { zh: "一个投资研究工作区，重点做了多端同步、权限和风险提示。", en: "An investment-research workspace focused on sync, permissions, and risk explanations." },
      scope: { zh: "全栈应用项目 · 研究辅助与安全沙盒", en: "Full-stack application · Research assistance & safe sandbox" },
      status: { zh: "持续迭代 · 登录访问", en: "In development · Login required" },
      overview: { zh: "QuantPilot 关注的不是让 AI 自动下单，而是让研究过程更清晰、跨设备协作更可靠、风险边界更明确。应用围绕个人工作区、研究笔记、策略对照与教学沙盒展开，将证据、版本和审计纳入产品基础设施。", en: "QuantPilot is not about letting AI place trades. It is about clearer research, reliable multi-device work, and explicit risk boundaries. Personal workspaces, research notes, strategy comparisons, and an educational sandbox are supported by evidence, versioning, and audit infrastructure." },
      highlights: {
        zh: ["实现用户工作区隔离与 owner / editor / viewer 权限模型，由后端校验成员关系。", "用增量同步、断网队列与乐观锁处理多设备状态，避免并发修改静默覆盖。", "将策略解释、反方理由、基准对照与金额化风险表达纳入研究交互。", "默认虚拟资金沙盒，保留限额、紧急暂停和审计记录，不直接把模型结论转为真实订单。"],
        en: ["Implements isolated workspaces and owner/editor/viewer roles with server-side membership checks.", "Uses incremental sync, offline queues, and optimistic locking to prevent silent concurrent overwrites.", "Brings strategy explanations, counterarguments, benchmark comparisons, and monetary risk framing into the interface.", "Defaults to virtual funds, limits, emergency pause, and audit logs rather than turning model output into live orders."]
      },
      boundary: { zh: "在线应用需要飞书登录。当前重点为同步安全底座、研究辅助与教学沙盒；不提供收益承诺，未验证策略不具备实盘资格。封面为界面示意图，不展示私人研究数据。", en: "The live application requires Feishu login. The current focus is secure synchronization, research assistance, and educational simulation. No return guarantees are made, and unvalidated strategies are not authorized for live trading. The cover is a schematic, not private research data." },
      links: [ { kind: "demo", url: "https://ocnqg3jyaqky.feishuapp.com/app/app_17a9rhvbek7" }, { kind: "source", url: "https://github.com/lifelonglearnerAdam/quantpilot-ai" } ],
      resume: { zh: "围绕 NestJS、PostgreSQL 与 TypeScript 构建研究工作区，实践多租户权限、乐观锁、增量同步与安全沙盒，强调审计与风险控制。", en: "Developed a TypeScript/NestJS/PostgreSQL research workspace with access control, optimistic locking, incremental sync, and a risk-aware sandbox." }
    },
    {
      id: "ledger", category: "engineering", featured: true, cover: "assets/images/ledger.svg", accent: "rose", stack: ["Flutter", "Riverpod", "SQLite"],
      name: { zh: "子墨记账", en: "Zimo Ledger" },
      label: { zh: "跨平台应用 / 本地优先", en: "CROSS-PLATFORM APP / LOCAL-FIRST" },
      summary: { zh: "用 Flutter 写的本地记账应用，支持账单导入、统计和备份。", en: "A local Flutter ledger with statement import, spending summaries, and backups." },
      scope: { zh: "独立应用项目 · Flutter 跨平台记账", en: "Independent application · Cross-platform Flutter finance app" },
      status: { zh: "v2.2 · 本地优先", en: "v2.2 · Local-first" },
      overview: { zh: "个人财务工具的价值不只在图表，还在日常录入是否顺手、导入恢复是否可靠、数据是否可控。子墨记账围绕本地账本组织收支、预算、资产负债与消费分析，并提供财商内容阅读和内容包更新。", en: "A personal finance tool needs more than charts: everyday entry should be easy, import and recovery should be reliable, and data should remain controllable. Zimo Ledger organizes transactions, budgets, assets, liabilities, and spending analysis around a local ledger, with financial-literacy reading and content-pack updates." },
      highlights: {
        zh: ["采用 Flutter、Riverpod 与 SQLite，主力支持 Windows，并适配多端。", "支持微信、支付宝与通用 CSV 导入，提供编辑、筛选、撤销和备份合并恢复。", "金额以最小货币单位整数存储，避免二进制浮点带来的累计误差。", "将账本与教育内容更新分离：远程更新只拉取内容包，不上传个人账目。"],
        en: ["Built with Flutter, Riverpod, and SQLite, with Windows as the primary platform and support for additional targets.", "Supports WeChat, Alipay, and generic CSV imports, with editing, filters, undo, and merge-based backup recovery.", "Stores amounts as integer minor units to avoid accumulated binary floating-point errors.", "Separates ledger data from educational updates: remote requests fetch content packs, not personal transactions."]
      },
      boundary: { zh: "账目保存在本地，不上传服务器。各平台构建与功能状态以仓库说明为准；封面使用示意数据，不包含个人收支。", en: "Ledger data stays local and is not uploaded to a server. Refer to the repository for platform-specific build and feature status. The cover uses illustrative data, not personal finances." },
      links: [ { kind: "source", url: "https://github.com/lifelonglearnerAdam/zimo-jizhang" } ],
      resume: { zh: "基于 Flutter / Riverpod / SQLite 实现本地优先记账，支持账单导入、分析、预算与备份合并恢复；以整数货币单位保证金额表示稳定。", en: "Built a local-first Flutter/Riverpod/SQLite ledger with statement import, analytics, budgets, and merge-based recovery; represented monetary values as integer minor units." }
    },
    {
      id: "sat", category: "engineering", featured: false, icon: "terminal", stack: ["C99", "DPLL / CDCL", "Python"],
      name: { zh: "SAT 求解器与星形数独", en: "SAT Solver & Asterisk Sudoku" },
      label: { zh: "算法与系统 / 课程设计", en: "ALGORITHMS & SYSTEMS / COURSE PROJECT" },
      summary: { zh: "从布尔可满足性到数独约束，走完解析、求解、验证的完整链路。", en: "From Boolean satisfiability to Sudoku constraints: parsing, solving, and verification." },
      scope: { zh: "程序设计综合课程设计 · 本地项目", en: "Programming course project · Local implementation" },
      status: { zh: "已实现与本地验证", en: "Implemented & locally validated" },
      overview: { zh: "使用 C99 实现可独立运行的基本 DPLL 与 CDCL 扩展，将星形数独规则编码为 CNF，并围绕求解器建立输入解析、交互提示、限时处理和结果验证。项目把抽象算法落到可运行、可检查的程序。", en: "Implemented a standalone DPLL baseline and CDCL extension in C99, encoded Asterisk Sudoku rules into CNF, and built parsing, interactive hints, time limits, and result verification around the solver. The project turns an abstract algorithm into an executable, inspectable system." },
      highlights: {
        zh: ["实现观察文字、二元传播、冲突分析与重启等搜索机制。", "保留基本求解器作为对照，使用相同输入与限时进行重复实验。", "对 SAT 模型逐子句核验，明确区分 SAT、UNSAT 与限时 UNKNOWN。", "数独提示根据当前棋盘重新求解一致补全，不强行套用固定答案。"],
        en: ["Implements watched literals, binary propagation, conflict analysis, and restart mechanisms.", "Keeps a basic solver as a baseline for repeated runs with identical inputs and time limits.", "Verifies SAT assignments clause by clause and distinguishes SAT, UNSAT, and timeout/UNKNOWN.", "Generates hints by solving the current board consistently rather than imposing a cached solution."]
      },
      boundary: { zh: "源码已整理到课程记录仓库，不包含教师原始算例、第三方题库或提交报告。", en: "The source is in the course-notes repository. Original teacher cases, third-party puzzle banks, and submission reports are not included." },
      links: [{ kind: "source", url: "https://github.com/lifelonglearnerAdam/hust-course-notes/tree/main/IIA/SAT-Solver" }],
      resume: { zh: "C99 实现 DPLL / CDCL 求解与星形数独 CNF 编码，配套超时语义、模型逐句校验和重复基线实验。", en: "Implemented DPLL/CDCL solving and Sudoku-to-CNF encoding in C99, with explicit timeout semantics, assignment verification, and repeated baseline experiments." }
    },
    {
      id: "decibel", category: "engineering", featured: false, icon: "waveform", stack: ["Kotlin", "Android"],
      name: { zh: "DecibelMeter 分贝仪", en: "DecibelMeter" },
      label: { zh: "原生移动开发 / 环境感知", en: "NATIVE MOBILE / ENVIRONMENTAL SENSING" },
      summary: { zh: "让环境声音变成可感知的实时读数，探索原生 Android 工具开发。", en: "Making ambient sound visible through a native Android utility." },
      scope: { zh: "Android 工具项目 · Kotlin", en: "Android utility project · Kotlin" },
      status: { zh: "公开源码", en: "Public source" },
      overview: { zh: "使用 Kotlin 开发 Android 环境噪声读数工具，将麦克风采样与实时界面连接起来，探索原生移动端传感、权限与反馈交互。", en: "An Android ambient-noise utility built in Kotlin, connecting microphone input to a real-time interface and exploring native sensing, permissions, and feedback." },
      highlights: { zh: ["围绕环境声音提供实时噪声读数。", "使用 Kotlin 实践原生 Android 工具开发。", "以轻量、直接的交互呈现连续变化的声音信号。"], en: ["Provides real-time readings for ambient noise.", "Uses Kotlin for native Android utility development.", "Presents changing sound signals through a lightweight, direct interface."] },
      boundary: { zh: "手机麦克风与设备校准会影响读数；不将其作为专业声学测量仪器的替代品。", en: "Microphone characteristics and device calibration affect readings. The app is not a replacement for a calibrated acoustic measurement instrument." },
      links: [ { kind: "source", url: "https://github.com/lifelonglearnerAdam/DecibelMeter" } ],
      resume: { zh: "Kotlin 原生 Android 环境噪声读数工具，探索移动端采样与实时反馈。", en: "A native Kotlin Android utility exploring ambient-noise readings and real-time feedback." }
    },
    {
      id: "monkeyocr", category: "research", featured: false, cover: "assets/images/research.svg", accent: "lilac", stack: ["MonkeyOCRv2", "OmniDocBench", "Error Analysis"],
      name: { zh: "手写文档表格与公式缺陷分析", en: "Handwritten Table & Formula Error Analysis" },
      label: { zh: "文档智能 / 研究实践", en: "DOCUMENT INTELLIGENCE / RESEARCH PRACTICE" },
      summary: { zh: "把总体指标拆解成可定位的失败样本，理解模型到底错在哪里。", en: "Turning aggregate metrics into localized failure cases to understand what went wrong." },
      scope: { zh: "研究实践 · 表格 / 公式专项诊断", en: "Research practice · Table and formula diagnostics" },
      status: { zh: "公开诊断报告", en: "Public diagnostic report" },
      overview: { zh: "在 MonkeyOCRv2 × OmniDocBench Note 文档专项中，承担表格与公式诊断工作。通过原图裁剪、GT 标注与模型预测三方对照，逐项审查 37 个表格与 25 个公式样本，把指标背后的结构错误和内容错误转化为可追踪的案例。", en: "Contributed table and formula diagnostics to the MonkeyOCRv2 × OmniDocBench Note study. Compared image crops, ground truth, and model predictions across 37 table and 25 formula samples, turning structural and content errors behind aggregate metrics into traceable cases." },
      highlights: {
        zh: ["针对表格与公式专项进行单人初审，建立可视化三栏对照。", "区分严重不可用、结构受损与局部内容错误，辅助确定后续处理优先级。", "将原图、标注、预测和错误说明放在同一报告中，支持逐项复核。", "严格标记 test_only：诊断样本与训练集隔离，不将测试集分析包装成训练提升。"],
        en: ["Performed an initial individual review of table and formula samples with visual side-by-side comparisons.", "Distinguished unusable outputs, structural damage, and localized content errors to help prioritize follow-up work.", "Combined images, annotations, predictions, and defect descriptions in one inspectable report.", "Marked diagnostics as test_only and kept them separate from training, without presenting test-set inspection as a training gain."]
      },
      boundary: { zh: "基于现有 MonkeyOCRv2 模型开展的专项研究实践，当前交付为测试诊断与可视化初审报告。样本归因可进一步复核；后续训练与方法验证需使用独立数据和固定评测协议。", en: "Focused research practice using the existing MonkeyOCRv2 model, with evaluation diagnostics and an initial visual report as current deliverables. Error attribution remains open to review; subsequent training and method validation require independent data and a fixed evaluation protocol." },
      links: [ { kind: "readReport", url: "https://lifelonglearneradam.github.io/monkeyocr-note-defects/" }, { kind: "source", url: "https://github.com/lifelonglearnerAdam/monkeyocr-note-defects" } ],
      resume: { zh: "负责 MonkeyOCRv2 × OmniDocBench Note 专项的表格与公式初审；对 37 个表格、25 个公式进行原图 / GT / 预测对照，整理缺陷类别与可视化报告，保持测试与训练隔离。", en: "Reviewed 37 table and 25 formula crops in a MonkeyOCRv2 × OmniDocBench Note study, comparing images, GT, and predictions and producing a categorized visual report with evaluation/training separation." }
    }
  ],
  researchInterests: [
    {
      id: "document-reliability", category: "research", overviewOnly: true, featured: false,
      stack: ["Document Intelligence", "Model Reliability"],
      name: { zh: "文档智能与可靠性", en: "Document Intelligence & Reliability" },
      label: { zh: "研究兴趣 / 文档理解", en: "RESEARCH INTEREST / DOCUMENT UNDERSTANDING" },
      summary: { zh: "关注复杂文档的理解，以及模型在真实场景中的可靠表现。", en: "Interested in understanding complex documents and making models more dependable in the real world." },
      scope: { zh: "研究探索", en: "Research exploration" }, status: { zh: "持续探索", en: "Ongoing exploration" },
      links: [],
      resume: { zh: "关注文档智能与模型可靠性。", en: "Interested in document intelligence and model reliability." }
    },
    {
      id: "ocr-evaluation", category: "research", overviewOnly: true, featured: false,
      stack: ["Multilingual OCR", "Model Evaluation"],
      name: { zh: "多语言文档研究", en: "Multilingual Document Research" },
      label: { zh: "研究兴趣 / 多语言理解", en: "RESEARCH INTEREST / MULTILINGUAL UNDERSTANDING" },
      summary: { zh: "探索不同语言、版式与拍摄条件下的文档理解。", en: "Exploring document understanding across languages, layouts, and capture conditions." },
      scope: { zh: "研究探索", en: "Research exploration" }, status: { zh: "持续探索", en: "Ongoing exploration" },
      links: [],
      resume: { zh: "关注多语言文档理解与模型评测。", en: "Interested in multilingual document understanding and evaluation." }
    },
    {
      id: "ppt-parsing", category: "research", overviewOnly: true, featured: false,
      stack: ["Document Understanding", "Multimodal Learning"],
      name: { zh: "演示文稿与多模态理解", en: "Presentation & Multimodal Understanding" },
      label: { zh: "研究兴趣 / 结构与语义", en: "RESEARCH INTEREST / STRUCTURE & SEMANTICS" },
      summary: { zh: "关注演示文稿中图文、版式与结构信息的理解。", en: "Interested in the interplay of text, visuals, layout, and structure in presentations." },
      scope: { zh: "研究探索", en: "Research exploration" }, status: { zh: "持续探索", en: "Ongoing exploration" },
      links: [],
      resume: { zh: "关注演示文稿与多模态文档理解。", en: "Interested in presentations and multimodal document understanding." }
    }
  ],
  poems: [
    {
      before: "projects", theme: "CHOICES / THE OPEN ROAD", author: "Robert Frost", work: "The Road Not Taken",
      lines: "Two roads diverged in a wood, and I—\nI took the one less traveled by,",
      source: "https://www.poetryfoundation.org/poems/44272/the-road-not-taken",
      image: "assets/images/poem-road.webp", imageAuthor: "Stiller Beobachter", imageLicense: "CC BY 2.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:Autumn_path_%5E2_-_Flickr_-_Stiller_Beobachter.jpg"
    },
    {
      before: "research", theme: "PERSPECTIVE / ANOTHER LIGHT", author: "Rabindranath Tagore", work: "Stray Birds · 6",
      lines: "If you shed tears when you miss the sun,\nyou also miss the stars.",
      source: "https://www.gutenberg.org/ebooks/6524",
      image: "assets/images/poem-stars.webp", imageAuthor: "Giles Laurent", imageLicense: "CC BY-SA 4.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:036_Milky_Way_during_Perseids_seen_from_Oeschinensee_with_water_reflections_Photo_by_Giles_Laurent.jpg"
    },
    {
      before: "writing", theme: "ATTENTION / SMALL WORLDS", author: "William Blake", work: "Auguries of Innocence",
      lines: "To see a World in a Grain of Sand\nAnd a Heaven in a Wild Flower,",
      source: "https://www.poetryfoundation.org/poems/43650/auguries-of-innocence",
      image: "assets/images/poem-flower.webp", imageAuthor: "NPS Photo", imageLicense: "Public domain",
      imageSource: "https://commons.wikimedia.org/wiki/File:Castilleja_parviflora_(8dc220e9-26dd-4244-b7f8-e9790a1427e6).jpg"
    },
    {
      before: "about", theme: "HOPE / A QUIET SONG", author: "Emily Dickinson", work: "“Hope” is the thing with feathers",
      lines: "“Hope” is the thing with feathers —\nThat perches in the soul —",
      source: "https://www.poetryfoundation.org/poems/42889/hope-is-the-thing-with-feathers-314",
      image: "assets/images/poem-sea.webp", imageAuthor: "Leonhard Lenz", imageLicense: "CC BY-SA 4.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:Sunrise_in_Kristianopel_at_Baltic_sea_04.jpg"
    },
    {
      before: "contact", theme: "LEARNING / BEYOND THE DESK", author: "William Wordsworth", work: "The Tables Turned",
      lines: "Come forth into the light of things,\nLet Nature be your teacher.",
      source: "https://www.poetryfoundation.org/poems/45557/the-tables-turned",
      image: "assets/images/poem-mountain.webp", imageAuthor: "Basile Morin", imageLicense: "CC BY-SA 4.0",
      imageSource: "https://commons.wikimedia.org/wiki/File:Karst_mountains_colorful_clouds_and_mist_at_sunrise_from_the_top_of_Mount_Nam_Xay_Vang_Vieng_Laos.jpg"
    }
  ],
  notes: []
};
