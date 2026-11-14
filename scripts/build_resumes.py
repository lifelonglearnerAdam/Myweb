#!/usr/bin/env python3
"""Export public bilingual CVs with the browser CLI; check freshness without browser dependencies."""
from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import json
import shutil
import subprocess
import threading
import os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets/resume'
INPUTS = ('resume.html', 'assets/js/content.js', 'assets/js/app.js', 'assets/css/site.css', 'assets/css/blog.css', 'assets/js/theme-init.js')
FILES = ('Zimo-Zeng-Resume-zh.pdf', 'Zimo-Zeng-Resume-en.pdf')


def source_hashes():
    return {name: sha256((ROOT / name).read_bytes()).hexdigest() for name in INPUTS}


def check():
    manifest = json.loads((OUT / 'manifest.json').read_text())
    if manifest['sourceHashes'] != source_hashes():
        raise ValueError('Résumé PDFs are stale. Run npm run resumes before publishing.')
    if set(manifest['files']) != set(FILES):
        raise ValueError('Expected exactly one Chinese and one English résumé PDF.')
    if {p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()} != set(FILES) | {'manifest.json'}:
        raise ValueError('Only the two public CVs and their manifest belong in assets/resume, never a transcript.')
    for name in FILES:
        data = (OUT / name).read_bytes()
        record = manifest['files'][name]
        if not data.startswith(b'%PDF-') or len(data) != record['bytes'] or sha256(data).hexdigest() != record['sha256']:
            raise ValueError(f'Invalid or modified résumé PDF: {name}')
    print('OK: two public résumé PDFs match their current source.')


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def build():
    cli = shutil.which('playwright-cli')
    if not cli:
        raise RuntimeError('playwright-cli is needed to export PDFs; it is not needed for --check.')
    before = source_hashes()
    OUT.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    session = f'resume-export-{os.getpid()}'
    prefix = [cli, f'-s={session}']
    try:
        url = f'http://127.0.0.1:{server.server_port}/'
        subprocess.run(prefix + ['open', url], cwd=ROOT, check=True, capture_output=True, timeout=45)
        result = subprocess.run(prefix + ['--raw', 'run-code', f'--filename={ROOT / "scripts/build_resume_pdfs.js"}'], cwd=ROOT, check=True, capture_output=True, text=True, timeout=90)
        exported = json.loads(result.stdout)
        if {item['filename'] for item in exported['files']} != set(FILES):
            raise ValueError('Browser export did not return both expected files.')
        if source_hashes() != before:
            raise ValueError('Résumé source changed during export; run this again.')
        records = {}
        for name in FILES:
            data = (OUT / name).read_bytes()
            if not data.startswith(b'%PDF-'):
                raise ValueError('Browser output is not a PDF.')
            records[name] = {'sha256': sha256(data).hexdigest(), 'bytes': len(data)}
        (OUT / 'manifest.json').write_text(json.dumps({'sourceHashes': before, 'files': records}, indent=2) + '\n')
        check()
    finally:
        subprocess.run(prefix + ['close'], cwd=ROOT, capture_output=True, timeout=20)
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    try:
        check() if args.check else build()
    except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
        raise SystemExit(str(error))
