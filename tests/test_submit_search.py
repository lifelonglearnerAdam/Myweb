import importlib.util
import json
import unittest
from pathlib import Path
from unittest.mock import patch

script = Path(__file__).resolve().parent.parent / "scripts/submit_search.py"
spec = importlib.util.spec_from_file_location("submit_search", script)
search = importlib.util.module_from_spec(spec)
spec.loader.exec_module(search)
URL = search.SITE + "/credits"
XML = f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{URL}</loc></url></urlset>'.encode()


class SearchSubmissionTest(unittest.TestCase):
    def test_only_live_public_urls(self):
        self.assertEqual(search.public_urls(XML, [URL, URL]), [URL])
        for xml, selected in [(XML, [URL + "?lang=zh"]), (XML.replace(b"zengzimo.cn", b"example.org"), []), (XML.replace(b"/credits", b"/api/chat"), [])]:
            with self.assertRaises(ValueError):
                search.public_urls(xml, selected)

    def test_indexnow_checks_public_proof_before_sending(self):
        key = (search.ROOT / search.KEY_FILE).read_bytes()
        with patch("builtins.print"), patch.object(search, "request", side_effect=[(200, "application/xml", XML), (200, "text/plain", key), (202, "text/plain", b"")]) as http:
            search.submit("bing", [URL])
            payload = json.loads(http.call_args.kwargs["data"])
            self.assertEqual(payload["urlList"], [URL])
            self.assertEqual(payload["keyLocation"], search.SITE + "/" + search.KEY_FILE)
        with patch.object(search, "request", side_effect=[(200, "application/xml", XML), (200, "text/plain", b"wrong")]) as http:
            with self.assertRaises(ValueError): search.submit("bing", [])
            self.assertEqual(http.call_count, 2)

    def test_no_credentials_no_submission(self):
        with patch.dict(search.os.environ, {}, clear=True), patch.object(search, "request") as http:
            for engine in ["google", "baidu"]:
                with self.assertRaisesRegex(ValueError, "Not submitted"):
                    search.submit(engine, [])
            http.assert_not_called()

    def test_google_uses_authenticated_sitemap_api_and_baidu_uses_page_urls(self):
        with patch.dict(search.os.environ, {"GSC_ACCESS_TOKEN": "test", "BAIDU_PUSH_TOKEN": "test"}, clear=True):
            with patch("builtins.print"), patch.object(search, "request", side_effect=[(200, "application/xml", XML), (204, "text/plain", b"")]) as http:
                search.submit("google", [])
                self.assertIn("sites/sc-domain%3Azengzimo.cn/sitemaps/https%3A%2F%2Fzengzimo.cn%2Fsitemap.xml", http.call_args.args[0])
                self.assertEqual(http.call_args.kwargs["method"], "PUT")
            with patch.object(search, "request", side_effect=[(200, "application/xml", XML), (200, "application/json", b'{"error": 401}')]) as http:
                with self.assertRaisesRegex(ValueError, "did not confirm"):
                    search.submit("baidu", [])
                self.assertTrue(http.call_args.args[0].startswith("https://data.zz.baidu.com/urls?"))
                self.assertEqual(http.call_args.kwargs["data"], URL.encode())
