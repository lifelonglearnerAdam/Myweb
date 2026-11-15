# Tor visual field notes · first article

Public URL: https://zengzimo.cn/note.html?id=tor-onion-field-notes

## Editorial contract

The owner requested a picture-led, film-like account of the Tor session as the first article. The Markdown source is `posts/tor-onion-field-notes.md`, published explicitly with `draft: false`, dated 2026-11-15. The underlying configuration and actual-browser observations were recorded on 2026-11-14. This is an AI-assisted engineering/learning record, not novel protocol research or a population-level benchmark.

Do not turn the documented results into an absolute anonymity claim:

- Five distinct onion service homepages rendered real page content with HTTP 200 in the installed Tor Browser: Riseup, Tor Metrics, Ahmia, Tor Project and SecureDrop.
- Tor Project and SecureDrop first exceeded the 45-second acceptance timeout. Later warm results are not first-load timings.
- Ahmia's homepage and default-engine selection were verified, but search queries returned the homepage. Search functionality was **not** accepted as working.
- ZeroBin's public homepage worked; the v3 onion address it advertised returned `descNotFound` in this observation.
- The Sci-Hub observation was its public homepage only, not an onion test or a paper download.
- Names without a verified current address were not declared tested.
- Normal and failure-path network checks support a bounded accidental-direct-connection claim, not a full security audit, all-app VPN kill switch, or resistance to compromise/traffic correlation.

Only conceptual artwork prompts were sent to the image model. No endpoint, credentials, personal photos or raw connection logs were provided or published.

## Visual inventory

All assets are local under `assets/images/posts/tor/`:

- Three original `gpt-image-2.6` artworks: the cover, rendezvous metaphor, and fail-closed gate metaphor. Generated through the owner's configured image provider, compressed as WebP. Deliberately not treated as topology/evidence.
- Seven original SVG figures: web terminology, normal Tor routing, onion-service rendezvous, Tor-over-proxy chain, observed times, independent search boxes, privacy boundaries.
- One montage of five actual browser viewport captures. No browser chrome, account data, personal IPs, selected proxy names or local endpoints. External page content/branding remains its owners' property; shown only for limited technical commentary.

The entire article image set is under 400 KB in the initial build. Fonts and explanatory labels in SVG remain text; larger detail mode lets phone readers pan a 1440px version. Alternative text and the article copy retain the key explanation independently of the diagram's small overview labels.

To rebuild original SVGs (no dependencies/network):

```bash
python3 scripts/build_tor_figures.py
```

To prepare artwork and evidence derivatives again, supply the explicit private input folders locally:

```bash
python3 scripts/build_tor_figures.py --art-dir /path/to/generated-art --evidence-dir /path/to/approved-browser-captures
```

The optional derivative steps require Pillow. They select only the known artwork/evidence files; they do not copy directories or embed their paths. Raw source files, prompts, provider replies, configuration and credentials stay outside this public repository.

## Storyboard behavior

`layout: visual-story` is an opt-in Markdown presentation. A heading starts each scene, standalone images become zoomable figures, and short prose remains ordinary document content. The nine scenes include a final sources/methods frame. The Markdown HTML exists before enhancement; failure to import the optional module leaves it readable.

The article alone imports `assets/js/visual-story.js` and its scoped CSS. It provides:

- Chapter picker, current-scene count, previous/next and progress.
- Explicitly started auto reading, selectable 20/30/45-second screen interval, immediate pause control. Tall scenes reveal their remaining visuals/captions before advancing, rather than skipping to the next heading.
- Pause on manual wheel/touch/reading keys, hidden tab and reduced-motion changes. No autoplay, video/audio download, forced scroll snapping, or visitor analytics.
- Image modal, Escape/close, focus restoration, fit/detail modes and pan-able large diagrams.
- Respect for reduced motion, ordinary scrolling, theme changes, mobile navigation and original-language fallback.
- Teardown of listeners/timers/dialog on language rerender or same-origin navigation. Existing piano and mascot instances are not replaced.

No onion connection, provider API call or browser-control service is performed by the public article. It is a static account of an earlier test.

## Validation and deployment

```bash
npm run build
npm run resumes  # shared source files are included in the existing PDF freshness manifest
npm run check

python3 scripts/stage_site.py .public-site
# Use a local Wrangler installation or the normal CLI on PATH:
wrangler dev --local --config server/static-site/wrangler.jsonc --port 4175

playwright-cli open http://127.0.0.1:4175/
playwright-cli run-code --filename=tests/visual-story-checks.js
playwright-cli run-code --filename=tests/blog-checks.js
playwright-cli run-code --filename=tests/browser-checks.js
playwright-cli run-code --filename=tests/experience-checks.js

wrangler deploy --config server/static-site/wrangler.jsonc
```

The browser storyboard checks cover the actual first article, all local images, manual playback and its actual 20-second screen-step timer, pause on user interaction, chapter state, lightbox/focus/detail mode, theme/language changes, 390px geometry and cleanup on navigation/Back. Existing tests now count explicitly published articles rather than assuming the blog is permanently empty. Draft exclusion and browser-only fixture tests remain in place.

The repository uses `main` as its default branch and `master` for its Pages mirror; synchronize without force-overwriting unrelated history. Only allowlisted public output is deployed to the Worker, not source/test logs or private material. Verify the first homepage card and the full article again on the actual custom domain after deployment.
