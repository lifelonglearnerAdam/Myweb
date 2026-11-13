#!/usr/bin/env python3
"""Stage an allowlisted static site, never .git, local photos, configs, or backend secrets."""
from pathlib import Path
import argparse
import shutil

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument("destination")
args = parser.parse_args()
out = Path(args.destination).resolve()
if out == ROOT or ROOT.is_relative_to(out) or (out.is_relative_to(ROOT) and out != ROOT / ".public-site"):
    raise SystemExit("Use the reserved .public-site output or a separate build destination outside the repository.")
out.mkdir(parents=True, exist_ok=True)
# This is a dedicated build output; do not reuse it for personal files.
for child in out.iterdir():
    if child.is_dir(): shutil.rmtree(child)
    else: child.unlink()
files = list(ROOT.glob("*.html")) + [ROOT / ".nojekyll", ROOT / "robots.txt", ROOT / "sitemap.xml"]
for file in files:
    shutil.copy2(file, out / file.name)
for directory in ("assets", "web"):
    shutil.copytree(ROOT / directory, out / directory)
# The GitHub mirror uses /Myweb/; this independent free hostname serves from its root.
# Rewrite only this site's own absolute URLs, never other project links.
for p in out.rglob("*"):
    if p.is_file() and p.suffix in {".html", ".js", ".xml", ".txt"}:
        text = p.read_text(encoding="utf-8")
        text = text.replace("https://lifelonglearneradam.github.io/Myweb/", "https://me.zimo-personal-space.workers.dev/")
        text = text.replace("lifelonglearneradam.github.io/Myweb/", "me.zimo-personal-space.workers.dev/")
        if p.name == "404.html": text = text.replace('<base href="/Myweb/">', '<base href="/">')
        p.write_text(text, encoding="utf-8")
print(f"Staged {len(list(out.rglob('*')))} site files and folders; local photos and backend configuration excluded.")
