/* Local-only little remarks. No model calls, tracking requests, or private context. */
(() => {
  const site = window.Zimo;
  if (!site) return;
  const lines = {
    general: [
      ["我带了点小零食来，不过网页里好像递不过去……那先陪你坐一会儿！", "I brought a few snacks, but I can’t quite pass them through the page… I can keep you company, though!"],
      ["今天也想做一只靠谱的小狐狸。先从不挡住你读字开始！", "Trying to be a useful little fox today. Step one: don’t sit on the words!"],
      ["欸，你慢慢看。我把想说的话攒成一小包，一会儿再打开～", "Take your time. I’ll keep the next little remark tucked away for a bit～"],
      ["页面翻到哪里都没关系，小狐狸认得回来的路。", "Wherever the page takes us, this little fox knows the way back."],
      ["有些问题放一会儿，再回来，突然就想通了。也可能只是先想起午饭……", "Sometimes a break makes an answer appear. Sometimes it only makes lunch appear in your thoughts…"],
      ["我刚刚准备说一句很厉害的话，结果忘了。那就：你好呀！", "I had a very impressive thought ready, then forgot it. So: hello!"],
      ["不用一下把所有页面都看完。留一点，下次还有借口来呀。", "No need to read every page at once. Leave a little reason to visit again."],
      ["想换个位置看风景的话，拖着我挪一挪就好，不用给小狐狸搬家费。", "Drag me to a new view if you like. This little fox doesn’t charge moving fees."],
      ["我努力少说两句。嗯……这句说完就少说。", "I’m trying to say a little less. Right after this little sentence."],
      ["代码有时候像打结的红线。先找到线头，别一下子全扯乱啦。", "Code can look like tangled thread. Find one end before pulling the whole knot apart."],
      ["这里没有催你交作业的人。可以慢一点，真的。", "Nobody here is waiting to collect your homework. You can go slowly. Really."],
      ["小狐狸的今日计划：看看网页，接住几片花瓣，再偷一点懒。", "Today’s little fox plan: browse, catch a petal, sneak in a tiny break."],
      ["对了，点我可以找入口，点“聊天”才是坐下来聊一会儿。", "Tap me for directions; choose Chat if you want to sit and talk a little."],
      ["我也不是每件事都懂，不过不懂的地方可以先记个小问号。", "I don’t understand everything either. A little question mark is a fine place to start."],
      ["这阵花瓣飘得挺认真，我就不和它比谁更忙了。", "These petals seem very busy drifting. I won’t compete with them."],
      ["有时候做出一个小东西，比看完一长串收藏更开心。", "Sometimes finishing one small thing feels better than saving another long list of links."]
    ],
    writing: [
      ["文章还没写好的时候，也可以先留一张空白纸。不拿套话填满就好。", "A blank page is fine while a post is still unwritten. It doesn’t need filler."],
      ["写笔记不用装得很厉害，把当时卡住的那一步写清楚就很有用了。", "A note doesn’t need to sound impressive. Explaining the step that got stuck is useful enough."],
      ["我喜欢能看见修改痕迹的笔记，像有人真的在这里想过。", "I like notes with a few visible revisions. They feel like somebody actually thought here."],
      ["如果以后这里长满文章，小狐狸要负责把目录认熟。", "If this place fills with articles one day, I’ll learn the shelves by heart."],
      ["今天还没有新文章也没关系，不催更，先把东西写明白。", "No new post today is fine. Better clear than hurried."]
    ],
    projects: [
      ["这些卡片不是奖状啦，点进去才是东西本身。", "These cards aren’t trophies. Open one to see the thing itself."],
      ["能用的小工具，我会比看起来很厉害的大标题更喜欢一点。", "I’m a little fonder of useful small tools than impressive big headings."],
      ["按钮能点、刷新不丢东西，看着普通，其实都是一点点补出来的。", "Working buttons and saved state look ordinary, but somebody had to make them work."],
      ["这里的代码可以慢慢翻。小狐狸只负责带路，不假装都会写。", "Take your time with the code. I know the paths, not every line."],
      ["做完再改，改完再用。小东西也会慢慢长大的呀。", "Build it, change it, use it. Small things grow too."]
    ],
    research: [
      ["还没想清楚的东西，不必急着讲成一个很大的故事。", "Something unfinished doesn’t need to become a grand story yet."],
      ["这一栏先写正在关注什么。没公开的东西，小狐狸也不会偷偷讲。", "This shelf says what’s interesting lately. I don’t tell unpublished stories."],
      ["看见一个奇怪结果的时候，可以先记下来，别急着给它起个漂亮名字。", "A strange result can be written down before it gets a fancy name."],
      ["有些问题读着读着才变得具体。问号也需要一点时间长大。", "Some questions only become clear while reading. Question marks need time too."]
    ],
    winter: [
      ["寒假想做什么？先挑一个小方向，别把任务表写得比寒假还长。", "What shall we build over the break? Let’s not make the task list longer than the holiday."],
      ["勾选只记在你自己的设备上，不是打卡。少完成两格也不会有人扣分。", "Checks stay on your device. This isn’t attendance, and an empty box costs no points."],
      ["先让第一个小程序跑起来，小狐狸再帮你庆祝一下。", "Get the first tiny program running, then this little fox can celebrate."],
      ["要是模型、前端都想学，就先选最想动手的那个，不用一次选一生。", "If both models and frontend look fun, pick today’s favorite. It isn’t a lifetime decision."],
      ["参考文档在每章后面。绕远路了就回来看看，不算丢人。", "The docs are at the end of each chapter. Coming back for directions is allowed."],
      ["玩也要留时间呀，寒假可不是换个地方继续赶作业。", "Leave a little time for fun. A holiday isn’t just homework in another room."]
    ],
    archive: [
      ["归档像一个还在慢慢收拾的书架。目前空一点，也挺好找。", "The archive is a shelf that’s still being arranged. A little empty space makes things easier to find."],
      ["可以试着搜一个技术名字。搜不到的话，小狐狸不会现场编一篇出来。", "Try a tool’s name. If there’s no result, I won’t invent a post on the spot."],
      ["找文章和找项目可以分开，不用把每一张卡片都翻完。", "Filter articles and projects separately; no need to open every card."]
    ],
    morning: [
      ["早呀，脑袋还没完全醒的话，先看一小段就好。", "Morning! If your brain’s still waking up, one small paragraph will do."],
      ["早上的小狐狸正在收拾今天的精神。你吃过早饭了吗？", "This morning’s little fox is gathering her energy. Was there breakfast in your plan?"]
    ],
    afternoon: [
      ["下午适合慢慢做一点东西，困了也可以先歇一会儿。", "An afternoon is enough for a small thing. A break can be part of it."],
      ["太阳还在外面，别把整个下午都关进屏幕里啦。", "There’s still daylight out there. The screen doesn’t need the whole afternoon."]
    ],
    night: [
      ["已经很晚的话，就把做到哪儿记下来。明天回来不用重新找线头。", "If it’s late, note where you stopped. Tomorrow won’t have to untangle the beginning again."],
      ["夜里安静归安静，小狐狸还是赞成先睡饱。", "Night is quiet, but this little fox still votes for enough sleep."],
      ["没做完的事可以留个记号，不用把今天拉得无限长。", "Leave a marker in unfinished work. Today doesn’t have to stretch forever."]
    ],
    theme: [
      ["亮一点，还是暗一点？小狐狸都陪着你。", "Light or dark? This little fox can keep you company in either."],
      ["嗯，这个颜色看久一点眼睛舒服吗？不舒服就换回来呀。", "Does this shade feel comfortable? It’s fine to switch back."]
    ],
    courses: [
      ["这些是子墨上课时写过的代码。想翻哪一门，小狐狸给你找找～", "These are bits of code from Zimo’s courses. Which shelf shall we open?"],
      ["这里放的是自己的练习，不是把老师的资料一股脑搬上来啦。", "These are personal exercises, not a bundle of the teachers’ handouts."],
      ["以前写得笨一点的代码也留着呀，回头看还挺有意思的。", "Some early code is a little clumsy. It can still be fun to look back at."]
    ],
    resume: [
      ["想带走一份简历吗？中文和英文都准备了 PDF。", "Want a copy of the résumé? There’s a PDF in both Chinese and English."],
      ["不用截图啦，下载按钮就在简历上面。小狐狸指路成功！", "No screenshots needed—the download buttons are above the résumé. Directions delivered!"]
    ],
    contact: [
      ["想给子墨留句话？小信封就是邮箱入口呀。", "Want to leave Zimo a note? The little envelope opens his email."],
      ["写信的话，简单说说来意就好，不用准备一篇小作文。", "A short email with a little context is enough. No essay required."],
      ["点旁边的小方框，就能把邮箱抄走啦。", "The little copy button will take the email address with you."]
    ],
    poetry: [
      ["这里的小诗可以慢慢读。作者和出处都在旁边，我就不抢着解释啦。", "Take your time with the poem. Its author and source are beside it; I won’t talk over it."],
      ["先歇一小会儿吧。看两行诗，再回去和代码较劲。", "A tiny break? Two lines of poetry, then back to the code."]
    ],
    language: [
      ["想换成英文看看吗？小狐狸还在原来的位置。", "Want to switch languages? This little fox stays right here."],
      ["中英文的入口在一起，找不到的话就叫我呀。", "Both language buttons live together. Give me a nudge if you lose them."]
    ],
    about: [
      ["关于页写的是人，不用写成一张奖状墙。", "An About page is about a person, not a wall of certificates."],
      ["代码之外还有读书和散步。小狐狸也想去窗外看看。", "There are books and walks outside the code. I’d like a look out the window too."]
    ]
  };
  const recent = [];
  let lastContext = "", lastAt = 0;
  function pick(context = "") {
    const hour = new Date().getHours();
    const period = hour < 7 || hour >= 23 ? "night" : hour < 12 ? "morning" : "afternoon";
    const pool = [...(lines[context] || []), ...lines.general, ...(lines[period] || [])];
    const specific = (lines[context] || []).filter(pair => !recent.includes(pair[0]));
    const available = pool.filter(pair => !recent.includes(pair[0]));
    const choices = specific.length ? specific : available.length ? available : pool;
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    recent.push(chosen[0]); if (recent.length > 16) recent.shift();
    return chosen[site.language === "en" ? 1 : 0];
  }
  site.companionLines = { pick, count: Object.values(lines).reduce((n, group) => n + group.length, 0) };
  // One remark per intentional entry, not on every mousemove or child-element crossing.
  const hoverSelector = '#susu-stage,#susu-launch,.sidebar-nav a,.project-card,.compact-project,.note-card,.archive-entry,.winter-preview,.winter-task,.poetry-card,.rail-social a,.rail-social button,.contact-icons a,.contact-icons button,.resume-downloads a,[data-print-resume],.language-switch button,#theme-toggle';
  const typingSelector = 'textarea,[contenteditable]:not([contenteditable="false"]),input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"])';
  let hoverTimer;
  function cancelHover() { clearTimeout(hoverTimer); }
  function contextFor(target) {
    const nav = target.dataset.navSection;
    if (nav) return nav === "home" ? "general" : nav;
    if (target.matches('.project-card,.compact-project')) return "projects";
    if (target.matches('.note-card')) return "writing";
    if (target.matches('.archive-entry')) return "archive";
    if (target.matches('.winter-preview,.winter-task')) return "winter";
    if (target.matches('.poetry-card')) return "poetry";
    if (target.matches('.rail-social a,.rail-social button,.contact-icons a,.contact-icons button')) return "contact";
    if (target.matches('.resume-downloads a,[data-print-resume]')) return "resume";
    if (target.id === "theme-toggle") return "theme";
    if (target.matches('[data-language]')) return "language";
    return site.page === "home" ? document.querySelector('[data-nav-section][aria-current="location"]')?.dataset.navSection || "general" : site.page;
  }
  function requestRemark(target) {
    cancelHover();
    hoverTimer = setTimeout(() => {
      if (!target.isConnected || document.hidden || site.chat?.active || site.chat?.busy || site.mascot?.dragging || site.effects?.transitioning || document.activeElement?.matches(typingSelector)) return;
      if (!site.mascot?.expanded && target.id !== "susu-launch") return;
      if (site.mascot.comment(pick(contextFor(target)), { preview: target.id === "susu-launch" })) lastAt = performance.now();
    }, 120);
  }
  document.addEventListener("pointerover", event => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const target = event.target.closest?.(hoverSelector);
    if (target && (!event.relatedTarget || !target.contains(event.relatedTarget))) requestRemark(target);
  }, { passive: true });
  document.addEventListener("pointerout", event => {
    const target = event.target.closest?.(hoverSelector);
    if (target && (!event.relatedTarget || !target.contains(event.relatedTarget))) cancelHover();
  }, { passive: true });
  document.addEventListener("focusin", event => {
    const target = event.target.closest?.(hoverSelector);
    if (target?.matches(":focus-visible")) requestRemark(target);
  });
  document.addEventListener("focusout", cancelHover);
  document.addEventListener("pointerdown", cancelHover, { passive: true });
  document.addEventListener("zimo:navigationstart", cancelHover);
  document.addEventListener("visibilitychange", cancelHover);
  document.addEventListener("zimo:themechange", () => {
    if (!site.mascot?.expanded || site.chat?.active || site.chat?.busy || performance.now() - lastAt < 18000) return;
    lastAt = performance.now(); site.mascot.comment(pick("theme"));
  });
  document.addEventListener("zimo:navigationend", () => {
    if (site.chat?.active || site.chat?.busy || !site.mascot?.expanded || performance.now() - lastAt < 18000) return;
    const context = site.page;
    if (context === lastContext) return;
    lastContext = context; lastAt = performance.now();
    const scheduledAt = lastAt;
    setTimeout(() => { if (lastAt === scheduledAt && site.page === context && !site.chat?.active && !site.chat?.busy) site.mascot.comment(pick(context)); }, 900);
  });
})();
