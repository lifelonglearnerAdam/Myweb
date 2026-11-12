#!/usr/bin/env python3
"""Dependency-free checks for published HTML, relative assets, IDs and accidental private data."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
ERRORS = []


class PageParser(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = []
        self.refs = []
        self.lang = None
        self.title = False
        self.viewport = False
        self.base = None
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "title":
            self.title = True
        if tag == "meta" and attrs.get("name") == "viewport":
            self.viewport = True
        if tag == "base":
            self.base = attrs.get("href")
        for key in ("src", "href"):
            if tag != "base" and attrs.get(key):
                self.refs.append((tag, attrs[key]))
        if tag == "img" and "alt" not in attrs:
            ERRORS.append(f"{self.path.relative_to(ROOT)}: img is missing alt text")
        if tag == "a" and attrs.get("target") == "_blank":
            rel = set(attrs.get("rel", "").split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                ERRORS.append(f"{self.path.relative_to(ROOT)}: external link missing safe rel")


pages = {path: PageParser(path) for path in [*ROOT.glob("*.html"), *ROOT.glob("web/*.html")]}
reference_count = 0
for path, page in pages.items():
    name = str(path.relative_to(ROOT))
    if not page.lang or not page.title or not page.viewport:
        ERRORS.append(f"{name}: missing language, title or viewport")
    for identifier, count in Counter(page.ids).items():
        if count > 1:
            ERRORS.append(f"{name}: duplicate id {identifier}")
    for tag, ref in page.refs:
        parts = urlsplit(ref)
        if parts.scheme or parts.netloc:
            if parts.scheme.lower() in {"javascript", "vbscript"}:
                ERRORS.append(f"{name}: unsafe URL scheme")
            continue
        ref_path = unquote(parts.path)
        if page.base:
            ref_path = ref_path.removeprefix("/Myweb/").lstrip("/")
            target = ROOT / (ref_path or "index.html")
        elif ref_path.startswith("/"):
            target = ROOT / ref_path.removeprefix("/Myweb/").lstrip("/")
        else:
            target = (path.parent / ref_path) if ref_path else path
        target = target.resolve()
        if target.is_dir():
            target = target / "index.html"
        reference_count += 1
        if not target.is_relative_to(ROOT) or not target.exists():
            ERRORS.append(f"{name}: missing local reference {ref}")
        elif parts.fragment and target in pages and parts.fragment not in pages[target].ids:
            ERRORS.append(f"{name}: missing fragment {ref}")

css = ROOT / "assets/css/site.css"
for ref in re.findall(r"url\([\"']?([^\)\"']+)[\"']?\)", css.read_text(encoding="utf-8")):
    if not urlsplit(ref).scheme and not (css.parent / ref).resolve().exists():
        ERRORS.append(f"CSS: missing asset {ref}")

# Only inspect published text, not local notes, test artifacts, or private files outside the site.
public_text = [*pages, *ROOT.glob("assets/js/*.js")]
private_patterns = [
    (re.compile(r"女朋友|女友|恋爱|love[123]\.jpg|ThinkDifferent______"), "obsolete personal relationship content"),
    (re.compile(r"U2025\d{5,}"), "student identifier"),
    (re.compile(r"(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}"), "GitHub credential"),
    (re.compile(r"sk-[A-Za-z0-9]{24,}"), "API credential"),
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"), "private key"),
    (re.compile(r"(?:/run/media/|/home/zimozeng/|222\.20\.97\.)"), "private filesystem or server address"),
]
for path in public_text:
    text = path.read_text(encoding="utf-8")
    for pattern, description in private_patterns:
        if pattern.search(text):
            ERRORS.append(f"{path.relative_to(ROOT)}: contains {description}")

try:
    sitemap = ET.parse(ROOT / "sitemap.xml")
    for location in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        if not location.text.startswith("https://lifelonglearneradam.github.io/Myweb/"):
            ERRORS.append(f"Unexpected sitemap URL: {location.text}")
except ET.ParseError as error:
    ERRORS.append(f"Invalid sitemap: {error}")

if not (ROOT / ".nojekyll").exists():
    ERRORS.append("Missing .nojekyll for static GitHub Pages deployment")
if ERRORS:
    print("Site checks failed:")
    for error in ERRORS:
        print(f"  - {error}")
    sys.exit(1)
print(f"OK: {len(pages)} HTML pages, {reference_count} local references, CSS assets, sitemap and public-data checks.")
