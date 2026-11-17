const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "assets/js/content.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const data = context.window.PORTFOLIO;
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith(".html")).map(file => path.join(root, file));
htmlFiles.push(...fs.readdirSync(path.join(root, "web")).filter(file => file.endsWith(".html")).map(file => path.join(root, "web", file)));

function bilingual(value, location) {
  assert.ok(value && typeof value === "object", `${location} must be bilingual`);
  for (const lang of ["zh", "en"]) {
    assert.equal(typeof value[lang], "string", `${location}.${lang}`);
    assert.ok(value[lang].trim().length > 0, `${location}.${lang} cannot be empty`);
  }
}

test("every script has valid JavaScript syntax", () => {
  for (const file of fs.readdirSync(path.join(root, "assets/js"))) {
    if (!file.endsWith(".js")) continue;
    const script = fs.readFileSync(path.join(root, "assets/js", file), "utf8");
    if (/^export\s/m.test(script)) {
      const { execFileSync } = require("node:child_process");
      assert.doesNotThrow(() => execFileSync(process.execPath, ["--input-type=module", "--check"], { input: script }), file);
    } else assert.doesNotThrow(() => new vm.Script(script), file);
  }
});

test("Chinese and English contain exactly the same UI keys", () => {
  assert.deepEqual(Object.keys(data.ui.zh).sort(), Object.keys(data.ui.en).sort());
  for (const [language, dictionary] of Object.entries(data.ui)) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.equal(typeof value, "string", `${language}.${key}`);
      assert.ok(value.trim(), `${language}.${key} cannot be empty`);
    }
  }
});

test("every static translation and profile binding exists", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
      assert.ok(match[1] in data.ui.zh && match[1] in data.ui.en, `${file}: missing ${match[1]}`);
    }
    for (const match of html.matchAll(/data-profile="([^"]+)"/g)) {
      assert.ok(match[1] in data.profile, `${file}: missing profile field ${match[1]}`);
    }
  }
});

test("résumé coursework contains only reviewed numeric results at least 85, with no transcript data", () => {
  assert.ok(data.profile.resumeCourses.length > 0);
  for (const course of data.profile.resumeCourses) {
    assert.deepEqual(Object.keys(course).sort(), ["name", "score"]);
    bilingual(course.name, "résumé course");
    assert.ok(Number.isFinite(course.score) && course.score >= 85 && course.score <= 100);
    assert.doesNotMatch(JSON.stringify(course), /学号|U\d{8,}|cjd\.hust\.edu\.cn|学生编号/);
  }
  const html = fs.readFileSync(path.join(root, "resume.html"), "utf8");
  for (const lang of ["zh", "en"]) {
    assert.ok(html.includes(`assets/resume/Zimo-Zeng-Resume-${lang}.pdf`));
    assert.ok(html.includes(`download="Zimo-Zeng-Resume-${lang}.pdf"`));
  }
});

test("project IDs are unique, safe, and complete in both languages", () => {
  const ids = data.projects.map(project => project.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(data.projects.length, 7);
  assert.equal(data.projects.filter(project => project.featured).length, 4);
  for (const project of data.projects) {
    assert.match(project.id, /^[a-z][a-z0-9-]*$/);
    assert.ok(["ai", "engineering", "research"].includes(project.category));
    for (const field of ["name", "label", "summary", "scope", "status", "overview", "boundary", "resume"]) bilingual(project[field], `${project.id}.${field}`);
    assert.ok(project.stack.length >= 2, project.id);
    for (const lang of ["zh", "en"]) {
      assert.ok(project.highlights[lang].length >= 2, `${project.id} highlights.${lang}`);
      for (const highlight of project.highlights[lang]) assert.ok(typeof highlight === "string" && highlight.trim());
    }
    if (project.featured) assert.ok(project.cover, `${project.id} needs a cover`);
    if (project.cover) assert.ok(fs.existsSync(path.join(root, project.cover)), project.cover);
  }
});

test("public project links are HTTPS without credentials or local endpoints", () => {
  for (const project of data.projects) {
    for (const link of project.links) {
      const url = new URL(link.url);
      assert.equal(url.protocol, "https:");
      assert.equal(url.username, "");
      assert.equal(url.password, "");
      assert.ok(!/localhost|127\.0\.0\.1|192\.168\./.test(url.hostname));
      assert.ok(link.kind in data.ui.zh && link.kind in data.ui.en, link.kind);
    }
  }
  assert.equal(data.projects.find(project => project.id === "sat").links[0].url, "https://github.com/lifelonglearnerAdam/hust-course-notes/tree/main/IIA/SAT-Solver", "The course source link points to the newly published repository");
});

test("the blog does not pass generated placeholder essays off as the owner's posts", () => {
  vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/posts.js"), "utf8"), context);
  assert.ok(Array.isArray(data.notes));
  assert.ok(data.notes.every(note => note.languages && note.html && !["beyond-the-score", "evidence-before-answers", "local-first"].includes(note.id)), "Only built owner-published Markdown belongs in the article list");
  assert.ok(!source.includes('id: "beyond-the-score"'));
  assert.ok(fs.existsSync(path.join(root, "posts/README.md")));
  assert.ok(fs.existsSync(path.join(root, "posts/_drafts/template.md")));
});

test("the first visual essay separates generated artwork, real evidence and unresolved behavior", () => {
  vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/posts.js"), "utf8"), context);
  const note = data.notes.find(note => note.id === "tor-onion-field-notes");
  assert.ok(note, "The original Tor essay remains published as newer articles are added");
  assert.equal(note.layout, "visual-story");
  assert.equal(note.date, "2026-11-15");
  assert.equal(note.languages.join(","), "zh", "Missing translations remain labelled as original text");
  const source = fs.readFileSync(path.join(root, "posts/tor-onion-field-notes.md"), "utf8");
  for (const term of ["AI 辅助", "2026-11-14", "2026-11-17", "此次修订没有重跑 Tor 测试", "45 秒", "未完全验收", "服务描述符", "统计基准", "gpt-image-2.6", "https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/"]) assert.ok(source.includes(term), term);
  assert.doesNotMatch(source, /\/home\/|127\.0\.0\.1|192\.168\.|7897|17997|Mieru|AnyTLS/);
  const assets = [];
  for (const match of source.matchAll(/!\[[^\]]+\]\(([^)]+)\)/g)) {
    assert.match(match[1], /^assets\/images\/posts\/tor\//);
    assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
    assets.push(match[1]);
  }
  assert.ok(assets.length >= 10);
  assets.push(note.cover);
  assert.ok(assets.reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, 0) < 800000, "The visual essay keeps a small image payload");
  for (const file of assets.filter(file => file.endsWith(".svg"))) {
    const svg = fs.readFileSync(path.join(root, file), "utf8");
    assert.match(svg, /<title/); assert.match(svg, /<desc/);
    assert.doesNotMatch(svg, /<script|<foreignObject|https?:\/\/(?!www\.w3\.org\/2000\/svg)/);
  }
});

test("the Windows-to-Linux article preserves workflow boundaries, sources and original language", () => {
  vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/posts.js"), "utf8"), context);
  const note = data.notes.find(note => note.id === "windows-to-linux-terminal-workflow");
  assert.ok(note, "The commissioned migration article is published");
  assert.equal(note.date, "2026-11-17");
  assert.equal(note.layout, "article");
  assert.equal(note.languages.join(","), "zh");
  assert.equal(note.title.zh, note.title.en, "The English UI does not invent a translated article");
  assert.match(note.title.zh, /从 Windows 到 Linux/);
  assert.ok(note.toc.zh.length >= 8, "The workflow article builds a navigable directory");
  assert.match(note.html.zh, /<pre><code class="language-bash">/);
  const source = fs.readFileSync(path.join(root, "posts/windows-to-linux-terminal-workflow.md"), "utf8");
  for (const term of ["LibreOffice", "Neovim", "pi", "tmux", "Ptyxis", "26 页", "修复副本", "不是装上 Linux", "AI 辅助", "没有做重启验收", "不是模型"]) assert.ok(source.includes(term), term);
  for (const url of ["https://jvns.ca/blog/2025/01/11/getting-a-modern-terminal-setup/", "https://drewdevault.com/blog/How-new-Linux-users-succeed/", "https://karthinks.com/software/more-less-emacs/"]) assert.ok(source.includes(url), url);
  assert.doesNotMatch(source, /\/home\/|\/run\/media\/|U\d{8,}|sk-[a-zA-Z0-9_-]{16,}|原始会话下载/);
});

test("winter study guide is complete, bilingual, and separate from original internal handouts", () => {
  vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/winter-content.js"), "utf8"), context);
  const guide = context.window.WINTER_GUIDE;
  bilingual(guide.title, "winter.title");
  assert.equal(guide.tracks.length, 4);
  assert.equal(guide.common.length + guide.tracks.reduce((sum, track) => sum + track.steps.length, 0), 19);
  const ids = guide.common.map(item => item.id);
  for (const track of guide.tracks) {
    bilingual(track.name, track.id);
    bilingual(track.summary, track.id);
    for (const step of track.steps) { ids.push(step.id); bilingual(step.title, step.id); bilingual(step.text, step.id); }
    for (const link of track.links) assert.ok(link.url.startsWith("https://"));
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!/qq群|组长|报名截止|已开营|qm\\.qq|1059431605|1023906518/.test(JSON.stringify(guide)));
});

test("research counts, provenance, and team context remain explicit", () => {
  const research = data.projects.find(project => project.id === "monkeyocr");
  assert.match(research.overview.zh, /37/);
  assert.match(research.overview.zh, /25/);
  assert.match(research.highlights.zh.join(" "), /test_only/);
  const team = data.projects.find(project => project.id === "miniso");
  assert.match(team.scope.zh, /三人/);
  assert.match(team.boundary.zh, /合成数据/);
  assert.match(data.projects.find(project => project.id === "quantpilot").boundary.en, /login/i);
});

test("all site JavaScript and CSS are local: no third-party runtime or font CDN", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) assert.ok(!/^(?:https?:)?\/\//.test(match[1]), `${file}: ${match[1]}`);
    for (const match of html.matchAll(/<link[^>]+href="([^"]+)"[^>]*>/g)) {
      if (/rel="stylesheet"/.test(match[0])) assert.ok(!/^(?:https?:)?\/\//.test(match[1]), `${file}: ${match[1]}`);
    }
  }
  assert.ok(!/\@import/.test(fs.readFileSync(path.join(root, "assets/css/site.css"), "utf8")));
});

test("mascot attribution and reasonable asset budgets are present", () => {
  const attribution = fs.readFileSync(path.join(root, "assets/images/ATTRIBUTION.md"), "utf8");
  assert.match(attribution, /legeling/);
  assert.match(attribution, /CC BY-NC 4\.0/);
  assert.match(attribution, /not an official/i);
  assert.ok(fs.statSync(path.join(root, "assets/images/susu-spritesheet.webp")).size < 1_100_000);
  assert.ok(fs.statSync(path.join(root, "assets/images/susu-idle.webp")).size < 30_000);
  for (const file of ["docsift.webp", "miniso.webp", "avatar.webp"]) assert.ok(fs.statSync(path.join(root, "assets/images", file)).size < 100_000, file);
});

test("generated artwork stays lightweight and does not expose the personal photo", () => {
  assert.ok(fs.statSync(path.join(root, "assets/images/wishing-tree-scene.webp")).size < 500_000);
  assert.ok(!fs.readFileSync(path.join(root, "index.html"), "utf8").includes("image/zimo.png"));
  assert.ok(!fs.existsSync(path.join(root, "assets/images/wish-tree.svg")), "The coarse scene draft should not be published");
});

test("piano recording is unmodified and attributed under its own license", () => {
  const crypto = require("node:crypto");
  const recording = fs.readFileSync(path.join(root, "assets/audio/canon-in-d-lee-galloway.ogg"));
  assert.equal(recording.subarray(0, 4).toString(), "OggS");
  assert.equal(crypto.createHash("sha256").update(recording).digest("hex"), "dbde7ed591f33e3dcfc941bce6494ec74b523a955d8c7342224290801e68d195");
  const credit = fs.readFileSync(path.join(root, "assets/audio/ATTRIBUTION.md"), "utf8");
  assert.match(credit, /Lee Galloway/);
  assert.match(credit, /CC BY-SA 3\.0/);
  assert.match(credit, /commons\.wikimedia\.org/);
});

test("unpublished research stays at interest level without methods or detailed case studies", () => {
  assert.equal(data.researchInterests.length, 3);
  for (const item of data.researchInterests) {
    assert.equal(item.overviewOnly, true);
    assert.ok(!item.overview && !item.highlights && !item.boundary && !item.results && !item.metrics);
    assert.equal(item.links.length, 0);
    assert.ok(!data.projects.some(project => project.id === item.id));
  }
  assert.equal(data.profile.email, "zimozeng961@gmail.com");
  assert.equal(data.profile.secondaryEmail, "2319597720@qq.com");
});

test("all poetry excerpts are attributed, English-only and paired with licensed photography", () => {
  const authors = ["Robert Frost", "Rabindranath Tagore", "William Blake", "Emily Dickinson", "William Wordsworth"];
  assert.equal(data.poems.length, authors.length);
  for (const poem of data.poems) {
    assert.ok(authors.includes(poem.author));
    assert.equal(typeof poem.lines, "string");
    assert.ok(!/[\u4e00-\u9fff]/.test(poem.lines));
    assert.ok(!poem.reflection && !poem.translation);
    assert.ok(poem.work && poem.source.startsWith("https://"));
    assert.ok(poem.imageSource.startsWith("https://commons.wikimedia.org/"));
    assert.ok(poem.imageAuthor && poem.imageLicense);
    assert.ok(fs.existsSync(path.join(root, poem.image)));
    assert.ok(fs.statSync(path.join(root, poem.image)).size < 200_000);
  }
  assert.equal(data.poems.find(poem => poem.author === "Robert Frost").lines.length < 90, true);
});

test("custom-domain deployment rewrites only this site's links and excludes private files", () => {
  const os = require("node:os");
  const { execFileSync } = require("node:child_process");
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "zimo-domain-build-"));
  const output = path.join(temporary, "site");
  try {
    execFileSync("python3", [path.join(root, "scripts/stage_site.py"), output], { cwd: root });
    const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
    assert.match(html, /rel="canonical" href="https:\/\/zengzimo\.cn\/"/);
    const content = fs.readFileSync(path.join(output, "assets/js/content.js"), "utf8");
    assert.ok(content.includes("https://lifelonglearneradam.github.io/docsift/"), "Other project links are not rewritten");
    assert.ok(fs.readFileSync(path.join(output, "sitemap.xml"), "utf8").includes("https://zengzimo.cn/project.html?id=docsift"));
    assert.ok(fs.readFileSync(path.join(output, "robots.txt"), "utf8").includes("https://zengzimo.cn/sitemap.xml"));
    assert.ok(fs.readFileSync(path.join(output, "404.html"), "utf8").includes('<base href="/">'));
    assert.ok(fs.readFileSync(path.join(output, "assets/js/app.js"), "utf8").includes("https://zengzimo.cn/"));
    for (const privatePath of [".git", "image", "server", ".env", ".dev.vars", "tests"]) assert.ok(!fs.existsSync(path.join(output, privatePath)), privatePath);
    assert.ok(fs.readFileSync(path.join(root, "index.html"), "utf8").includes('href="https://lifelonglearneradam.github.io/Myweb/"'), "Building does not overwrite the GitHub mirror source");
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

test("custom domain and free fallback all use their own same-origin chat API", () => {
  const js = fs.readFileSync(path.join(root, "assets/js/companion-chat.js"), "utf8");
  assert.ok(js.includes('const PUBLIC_SITE = "https://zengzimo.cn"'));
  assert.ok(js.includes('"https://www.zengzimo.cn"') && js.includes('"https://me.zimo-personal-space.workers.dev"'));
  assert.ok(js.includes('HOSTED_ORIGINS.has(location.origin) ? "/api/chat"'));
  const config = JSON.parse(fs.readFileSync(path.join(root, "server/static-site/wrangler.jsonc"), "utf8"));
  assert.deepEqual(config.routes.map(route => route.pattern).sort(), ["www.zengzimo.cn", "zengzimo.cn"]);
  assert.ok(config.routes.every(route => route.custom_domain));
  assert.equal(config.workers_dev, true, "The old free hostname remains available");
});

test("old URLs are redirects and do not retain obsolete personal content", () => {
  for (const name of ["about", "hobby", "photo", "myessay", "contact"]) {
    for (const prefix of ["", "web/"]) {
      const html = fs.readFileSync(path.join(root, `${prefix}${name}.html`), "utf8");
      assert.match(html, /data-redirect="/);
      assert.match(html, /http-equiv="refresh"/);
      assert.ok(!/<img\b/.test(html), "Legacy pages must not expose old private photo galleries");
    }
  }
});
