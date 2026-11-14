import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("build_posts", ROOT / "scripts/build_posts.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PostsTest(unittest.TestCase):
    def test_no_drafts_or_unlabelled_notes_are_published(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)
            (source / "private.md").write_text("# A private note\nDo not publish", encoding="utf-8")
            (source / "draft.md").write_text("---\ntitle: draft\ndraft: true\n---\ntext", encoding="utf-8")
            self.assertEqual(module.build(source), [])

    def test_publish_and_pair_original_language_without_fake_dates(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)
            (source / "one.md").write_text("---\ntitle: 真实文章\nslug: one\ndraft: false\n---\n## 说明\n正文", encoding="utf-8")
            posts = module.build(source)
            self.assertEqual(posts[0]["date"], "")
            self.assertEqual(posts[0]["languages"], ["zh"])
            self.assertEqual(posts[0]["title"]["en"], "真实文章")
            self.assertIn('id="post-heading-1"', posts[0]["html"]["zh"])
            (source / "one.en.md").write_text("---\ntitle: Real article\nslug: one\nlang: en\ndraft: false\n---\nOriginal English text", encoding="utf-8")
            posts = module.build(source)
            self.assertEqual(set(posts[0]["languages"]), {"en", "zh"})
            self.assertEqual(posts[0]["title"]["en"], "Real article")

    def test_common_markdown_and_safe_html(self):
        rendered, toc = module.markdown("## Title\n\nHello **world**.\n\n- first\n- second\n\n> a quote\n\n```js\nconst a = '<img onerror=evil()>';\n```\n\n[unsafe](javascript:alert)\n\n<script>evil()</script>\n\n![Picture](assets/images/photo.webp)")
        self.assertEqual(toc[0]["title"], "Title")
        self.assertIn("<strong>world</strong>", rendered)
        self.assertIn("<ul>", rendered)
        self.assertIn("<blockquote>", rendered)
        self.assertIn("language-js", rendered)
        self.assertNotIn('href="javascript:', rendered)
        self.assertNotIn("<script>", rendered)
        self.assertIn('alt="Picture"', rendered)
        self.assertIn('rel="noopener noreferrer"', module.inline("[docs](https://example.com)"))

    def test_invalid_publication_metadata_fails_loudly(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)
            (source / "bad.md").write_text("---\ntitle: title\nslug: ../private\ndraft: false\n---\ntext", encoding="utf-8")
            with self.assertRaises(ValueError):
                module.build(source)


if __name__ == "__main__":
    unittest.main()
