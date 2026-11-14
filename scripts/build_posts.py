#!/usr/bin/env python3
"""Build owner-written Markdown posts into local static data. No network or runtime dependencies."""
from pathlib import Path
from datetime import date
import argparse
import html
import json
import re
import sys

ROOT = Path(__file__).resolve().parent.parent


def safe_url(value):
    value = html.unescape(value).strip()
    if re.search(r"[\x00-\x20\\]", value) or value.startswith("//"):
        return "#"
    if re.match(r"^[a-z][a-z0-9+.-]*:", value, re.I) and not re.match(r"^(https?://|mailto:)", value, re.I):
        return "#"
    return value


def inline(text):
    tokens = []

    def stash(value):
        tokens.append(value)
        return f"\x00{len(tokens) - 1}\x00"

    text = re.sub(r"`([^`]+)`", lambda m: stash("<code>" + html.escape(m[1]) + "</code>"), text)
    text = re.sub(r"!\[([^\]]*)\]\(([^\s)]+)\)", lambda m: stash('<img src="' + html.escape(safe_url(m[2]), quote=True) + '" alt="' + html.escape(m[1], quote=True) + '" loading="lazy">'), text)

    def link(match):
        target = safe_url(match[2])
        extra = ' target="_blank" rel="noopener noreferrer"' if target.startswith(("https://", "http://")) else ""
        return stash('<a href="' + html.escape(target, quote=True) + '"' + extra + ">" + html.escape(match[1]) + "</a>")

    text = re.sub(r"\[([^\]]+)\]\(([^\s)]+)\)", link, text)
    text = html.escape(text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return re.sub(r"\x00(\d+)\x00", lambda m: tokens[int(m[1])], text)


def markdown(source):
    lines = source.splitlines()
    output, toc, paragraph = [], [], []
    i = 0

    def flush():
        if paragraph:
            output.append("<p>" + inline(" ".join(paragraph)) + "</p>")
            paragraph.clear()

    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            flush()
            language = re.sub(r"[^a-zA-Z0-9_+-]", "", line[3:].strip())
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            output.append('<pre><code class="language-' + language + '">' + html.escape("\n".join(code)) + "</code></pre>")
        elif re.match(r"^#{1,6}\s+", line):
            flush()
            match = re.match(r"^(#{1,6})\s+(.+?)\s*#*$", line)
            level = min(6, len(match[1]) + 1)  # The page owns its single h1.
            label = match[2]
            identifier = f"post-heading-{len(toc) + 1}"
            toc.append({"id": identifier, "title": label, "level": level})
            output.append(f'<h{level} id="{identifier}" tabindex="-1">{inline(label)}</h{level}>')
        elif re.match(r"^\s*(-{3,}|\*{3,})\s*$", line):
            flush()
            output.append("<hr>")
        elif re.match(r"^\s*[-*+]\s+", line) or re.match(r"^\s*\d+\.\s+", line):
            flush()
            ordered = bool(re.match(r"^\s*\d+\.\s+", line))
            tag, items = ("ol" if ordered else "ul"), []
            pattern = r"^\s*\d+\.\s+(.+)" if ordered else r"^\s*[-*+]\s+(.+)"
            while i < len(lines):
                item = re.match(pattern, lines[i])
                if not item:
                    break
                items.append("<li>" + inline(item[1]) + "</li>")
                i += 1
            output.append(f"<{tag}>" + "".join(items) + f"</{tag}>")
            continue
        elif line.startswith(">"):
            flush()
            quoted = []
            while i < len(lines) and lines[i].startswith(">"):
                quoted.append(lines[i].lstrip("> "))
                i += 1
            output.append("<blockquote><p>" + inline(" ".join(quoted)) + "</p></blockquote>")
            continue
        elif not line.strip():
            flush()
        else:
            paragraph.append(line.strip())
        i += 1
    flush()
    return "\n".join(output), toc


def read_post(path):
    text = path.read_text(encoding="utf-8-sig")
    metadata = {}
    if text.startswith("---\n"):
        chunks = text.split("---", 2)
        if len(chunks) != 3:
            raise ValueError(f"{path.name}: unfinished metadata")
        for line in chunks[1].splitlines():
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            key, separator, value = line.partition(":")
            if not separator:
                raise ValueError(f"{path.name}: metadata uses one key: value per line")
            value = value.strip()
            if value.startswith(('"', "'")) and value.endswith(value[:1]):
                value = value[1:-1]
            metadata[key.strip()] = value
        text = chunks[2].lstrip("\r\n")
    # Publication is explicit; an unlabelled file cannot leak an unfinished/private note.
    if metadata.get("draft", "true").lower() != "false":
        return None
    identifier = metadata.get("slug", path.stem.removesuffix(".en").removesuffix(".zh"))
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", identifier):
        raise ValueError(f"{path.name}: use a lowercase English slug, e.g. first-note")
    title = metadata.get("title")
    if not title:
        match = re.search(r"^#\s+(.+)$", text, re.M)
        title = match[1] if match else path.stem
    language = metadata.get("lang", "en" if path.stem.endswith(".en") else "zh")
    if language not in ("zh", "en"):
        raise ValueError(f"{path.name}: lang must be zh or en")
    published = metadata.get("date", "")
    if published:
        date.fromisoformat(published)
    if text.startswith("# " + title + "\n"):
        text = text.split("\n", 1)[1].lstrip()
    body, toc = markdown(text)
    summary = metadata.get("summary") or re.sub(r"[`*#>\[\]]", "", text.split("\n\n")[0]).strip()[:150]
    return {"id": identifier, "language": language, "title": title, "summary": summary, "category": metadata.get("category", "随记" if language == "zh" else "Notes"), "date": published, "html": body, "toc": toc, "minutes": max(1, round(len(text) / (650 if language == "zh" else 1200)))}


def build(source):
    grouped = {}
    for path in sorted(source.glob("*.md")):
        if path.name == "README.md":
            continue
        post = read_post(path)
        if not post:
            continue
        entry = grouped.setdefault(post["id"], {})
        if post["language"] in entry:
            raise ValueError(f"Duplicate article language: {post['id']} / {post['language']}")
        entry[post["language"]] = post
    posts = []
    for identifier, versions in grouped.items():
        original = versions.get("zh") or versions["en"]
        post = {"id": identifier, "languages": list(versions), "minutes": original["minutes"], "date": original["date"]}
        for field in ("title", "summary", "category", "html", "toc"):
            post[field] = {lang: versions.get(lang, original)[field] for lang in ("zh", "en")}
        posts.append(post)
    posts.sort(key=lambda post: (post["date"], post["id"]), reverse=True)
    return posts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=str(ROOT / "posts"))
    parser.add_argument("--output", default=str(ROOT / "assets/js/posts.js"))
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    try:
        posts = build(Path(args.source))
        payload = json.dumps(posts, ensure_ascii=False, indent=2).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
        generated = "/* Generated from owner-published posts/*.md. Drafts are never included. */\nwindow.PORTFOLIO.notes = " + payload + ";\n"
        output = Path(args.output)
        if args.check:
            if not output.exists() or output.read_text(encoding="utf-8") != generated:
                raise ValueError("Article data is stale; run npm run build.")
        else:
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(generated, encoding="utf-8")
            if output.resolve() == (ROOT / "assets/js/posts.js").resolve():
                urls = ["", "archive.html", "winter.html", "resume.html", "credits.html"]
                urls += ["project.html?id=" + value for value in ("docsift", "miniso", "quantpilot", "ledger", "sat", "decibel", "monkeyocr")]
                urls += ["note.html?id=" + post["id"] for post in posts]
                sitemap = '<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n' + "".join('  <url><loc>https://lifelonglearneradam.github.io/Myweb/' + html.escape(url) + '</loc></url>\\n' for url in urls) + '</urlset>\\n'
                (ROOT / "sitemap.xml").write_text(sitemap.replace('\\n', '\n'), encoding="utf-8")
        print(f"{'Checked' if args.check else 'Built'} {len(posts)} published Markdown posts; drafts excluded.")
    except (ValueError, OSError) as error:
        print(error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
