#!/usr/bin/env python3
"""Notify search engines after deploying. Only submit URLs from the live primary sitemap."""
import argparse
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

SITE = "https://zengzimo.cn"
SITEMAP = SITE + "/sitemap.xml"
KEY_FILE = "indexnow-key.txt"  # Public ownership proof, not an account credential.
ROOT = Path(__file__).resolve().parent.parent
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None  # Never forward an authorization header or Baidu token to a redirect.


def request(url, *, method="GET", data=None, headers=None):
    req = Request(url, data=data, method=method, headers={"User-Agent": f"ZimoSite/1.0 (+{SITE}/)", **(headers or {})})
    with build_opener(NoRedirect).open(req, timeout=20) as response:
        return response.status, response.headers.get_content_type(), response.read()


def public_urls(xml, selected):
    root = ET.fromstring(xml)
    if root.tag != NS + "urlset":
        raise ValueError("The live sitemap is not a URL set.")
    urls = [el.text or "" for el in root.findall(f"{NS}url/{NS}loc")]
    if not urls or len(urls) != len(set(urls)):
        raise ValueError("The live sitemap is empty or contains duplicates.")
    for url in urls:
        parts = urlsplit(url)
        if parts.scheme != "https" or parts.netloc != urlsplit(SITE).netloc or parts.fragment or parts.path.startswith("/api/"):
            raise ValueError("The live sitemap contains a non-public or off-site URL.")
    if any(url not in urls for url in selected):
        raise ValueError("Only URLs in the live primary sitemap may be submitted.")
    return list(dict.fromkeys(selected)) if selected else urls


def submit(engine, selected):
    if engine in ("google", "baidu"):
        variable = "GSC_ACCESS_TOKEN" if engine == "google" else "BAIDU_PUSH_TOKEN"
        token = os.environ.get(variable)
        if not token:
            raise ValueError(f"Not submitted: {variable} is not configured for the verified site. See docs/SEARCH.md.")
    if engine == "google" and selected:
        raise ValueError("Search Console accepts the sitemap, not individual blog URLs via this API.")
    _, _, xml = request(SITEMAP)
    urls = public_urls(xml, selected)
    if engine == "bing":
        key = (ROOT / KEY_FILE).read_text(encoding="ascii").strip()
        key_location = f"{SITE}/{KEY_FILE}"
        _, _, live_key = request(key_location)
        if not re.fullmatch(r"[a-f0-9]{32}", key) or live_key.strip() != key.encode("ascii"):
            raise ValueError("IndexNow key mismatch: deploy the public key file first.")
        if len(urls) > 10000:
            raise ValueError("IndexNow accepts up to 10,000 URLs per batch; specify changed URLs.")
        payload = {"host": urlsplit(SITE).netloc, "key": key, "keyLocation": key_location, "urlList": urls}
        status, mime, _ = request("https://api.indexnow.org/indexnow", method="POST", data=json.dumps(payload).encode(), headers={"Content-Type": "application/json; charset=utf-8"})
        if status not in (200, 202) or mime == "text/html":
            raise ValueError(f"IndexNow returned an unexpected response: HTTP {status} ({mime}).")
        detail = "received, key validation pending" if status == 202 else "received"
        print(f"Bing / IndexNow: HTTP {status}; {len(urls)} URLs {detail}. Not an indexing confirmation.")
    elif engine == "google":
        prop = os.environ.get("GSC_PROPERTY", "sc-domain:zengzimo.cn")
        if prop not in ("sc-domain:zengzimo.cn", SITE + "/"):
            raise ValueError("GSC_PROPERTY must be the verified primary domain or URL-prefix property.")
        url = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{quote(prop, safe='')}/sitemaps/{quote(SITEMAP, safe='')}"
        status, _, _ = request(url, method="PUT", data=b"", headers={"Authorization": "Bearer " + token})
        if status not in (200, 204):
            raise ValueError(f"Unexpected Search Console response: HTTP {status}.")
        print(f"Google Search Console: HTTP {status}; sitemap submitted to {prop}. Not an indexing confirmation.")
    else:
        query = urlencode({"site": SITE, "token": token})
        _, _, raw = request("https://data.zz.baidu.com/urls?" + query, method="POST", data="\n".join(urls).encode(), headers={"Content-Type": "text/plain; charset=utf-8"})
        result = json.loads(raw)
        if not isinstance(result, dict) or result.get("success") != len(urls):
            accepted = result.get("success", 0) if isinstance(result, dict) else 0
            raise ValueError(f"Baidu did not confirm the full batch ({accepted}/{len(urls)}). Check the property and quota.")
        print(f"Baidu: API confirmed {len(urls)} URLs received. Not an indexing confirmation.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("engine", choices=("bing", "google", "baidu"))
    parser.add_argument("urls", nargs="*", help="Optional changed URLs for IndexNow or Baidu; defaults to the live sitemap.")
    args = parser.parse_args()
    try:
        submit(args.engine, args.urls)
    except HTTPError as error:
        sys.exit(f"{args.engine}: HTTP {error.code}; receipt not confirmed. See docs/SEARCH.md.")
    except (URLError, TimeoutError, ConnectionError):
        sys.exit(f"{args.engine}: HTTPS connection failed; receipt not confirmed. Check connectivity or use the webmaster console.")
    except (ValueError, OSError, ET.ParseError) as error:
        sys.exit(str(error))
