# Visual assets & attribution

## Original site assets

- `wishing-tree-scene.webp`: scene generated with `gpt-image-2.6` through the owner-configured image provider, then compressed to WebP. A pink wishing tree, reflective lake, and pale lavender mountains, inspired by the wishing-tree motif in *Fox Spirit Matchmaker*. Not an official frame or extracted game/anime asset. The earlier SVG drafts have been removed.
- `avatar.webp`: separately generated with `gpt-image-2.6`, then resized and compressed. A non-official fan-art portrait inspired by Tushan Susu, not a photograph or a crop of the third-party animation atlas. Character/franchise rights remain with their respective owners; no official endorsement is implied.
- `favicon.svg`: original Z monogram.
- `quantpilot.svg`, `ledger.svg`: original interface studies with illustrative, non-personal data; not screenshots of private accounts.
- `research.svg`: original diagram illustrating image / ground-truth / prediction comparison.
- `social-preview.png`: original social preview based on the site’s visual identity.
- `docsift.webp`, `miniso.webp`: resized screenshots of the owner’s public project demos.

## Tor visual field notes · 2026-11-15

Files are limited to `posts/tor/`:

- `cover.webp`, `rendezvous-art.webp`, `gate-art.webp`: original concept art generated with the owner's configured `gpt-image-2.6` image model, compressed to WebP. These are visual metaphors, not accurate network topologies or evidence of a successful connection. No personal photographs, IPs or proxy settings were provided to the image model.
- `web-layers.svg`, `onion-routing.svg`, `onion-rendezvous.svg`, `clash-chain.svg`, `observed-times.svg`, `two-search-boxes.svg`, `privacy-boundaries.svg`: original explanatory/data figures; source in `scripts/build_tor_figures.py`. Approximate diagrams and single-run observations, not a physical map, anonymity proof or performance benchmark.
- `five-sites-evidence.webp`: a limited, resized montage of actual Tor Browser viewport captures made during the 2026-11-14 acceptance session. Sites: Riseup ([riseup.net](https://riseup.net/)), Tor Metrics ([metrics.torproject.org](https://metrics.torproject.org/)), Ahmia ([ahmia.fi](https://ahmia.fi/)), Tor Project ([torproject.org](https://www.torproject.org/)), SecureDrop ([securedrop.org](https://securedrop.org/)). Website content, branding and page designs remain the respective owners' property. Shown for contextual technical commentary, not claimed as original illustration, relicensed, or endorsed by those projects. The montage excludes browser chrome, personal account information and connection endpoints.

The article credits its AI-assisted drafting and automated test provenance, documents failed and unresolved checks, and links to official technical explanations. Original files, raw logs, credentials and local configuration are not published. Image prompts are conceptual only and are preserved locally, not embedded in the page.

## Poetry photography · external sources

These are landscape photographs, not hand-drawn or newly generated illustrations. All are cropped and resized to 900 × 540 and compressed to WebP; derivative files retain their respective licenses. Attribution is shown on the cards and in `credits.html#poetry-credit`.

- `poem-road.webp` — **Stiller Beobachter**, *Autumn path ^2*, **CC BY 2.0**.
  Source: https://commons.wikimedia.org/wiki/File:Autumn_path_%5E2_-_Flickr_-_Stiller_Beobachter.jpg
  License: https://creativecommons.org/licenses/by/2.0/
- `poem-stars.webp` — **Giles Laurent**, *Milky Way during Perseids seen from Oeschinensee with water reflections*, **CC BY-SA 4.0**.
  Source: https://commons.wikimedia.org/wiki/File:036_Milky_Way_during_Perseids_seen_from_Oeschinensee_with_water_reflections_Photo_by_Giles_Laurent.jpg
  License: https://creativecommons.org/licenses/by-sa/4.0/
- `poem-flower.webp` — **NPS Photo**, *Castilleja parviflora*, **Public domain**, as recorded by the source.
  Source: https://commons.wikimedia.org/wiki/File:Castilleja_parviflora_(8dc220e9-26dd-4244-b7f8-e9790a1427e6).jpg
- `poem-sea.webp` — **Leonhard Lenz**, *Sunrise in Kristianopel at Baltic sea 04*, **CC BY-SA 4.0**.
  Source: https://commons.wikimedia.org/wiki/File:Sunrise_in_Kristianopel_at_Baltic_sea_04.jpg
  License: https://creativecommons.org/licenses/by-sa/4.0/
- `poem-mountain.webp` — **Basile Morin**, *Karst mountains colorful clouds and mist at sunrise from the top of Mount Nam Xay, Vang Vieng, Laos*, **CC BY-SA 4.0**.
  Source: https://commons.wikimedia.org/wiki/File:Karst_mountains_colorful_clouds_and_mist_at_sunrise_from_the_top_of_Mount_Nam_Xay_Vang_Vieng_Laos.jpg
  License: https://creativecommons.org/licenses/by-sa/4.0/

Poetry and the photographs are independently attributed; a photograph's license does not grant ownership of the paired poem.

## Tushan Susu / 涂山苏苏

Files: `susu-spritesheet.webp`, `susu-idle.webp`.

- Creator: **legeling** — https://github.com/legeling
- Source: https://github.com/legeling/awesome-codex-pet/tree/main/pets/tushan-susu--legeling
- Source package: `tushan-susu--legeling`, sprite format v2, 1536 × 2288, 8 columns × 11 rows.
- Original atlas SHA-256: `3e3f62c8417cd1f6e41eeaf0e2cc25d166613815dfd29917c64d1d6cd6d0246e`.
- Source asset description: **AI-generated community interpretation** of Tushan Susu from *Fox Spirit Matchmaker* / 《狐妖小红娘》. Not an official character model or official Live2D.
- Source repository asset license: **CC BY-NC 4.0** — https://creativecommons.org/licenses/by-nc/4.0/
- Package-specific license statement: “Non-commercial use only. Commercial use is prohibited. Character rights remain with their respective owners.”
- Adaptations: the atlas is recompressed with lossy WebP; `susu-idle.webp` is a crop of its first neutral frame. No claim of original character authorship is made.
- This is a non-commercial personal site. **Commercial reuse requires different artwork or appropriate permission.**

The browser animation and navigation code is independently implemented. No upstream desktop-pet runtime or install script is shipped or executed.

### Animation layout

Each original cell is 192 × 208; browser cells are displayed at 144 × 156 CSS pixels on phones and approximately 166 × 179.83 CSS pixels on desktop. The source atlas is unchanged.

| Row | Motion | Non-empty frames |
| --- | --- | --- |
| 0 | Idle | 7 |
| 1 | Running right | 8 |
| 2 | Running left | 8 |
| 3 | Waving | 4 |
| 4 | Jumping | 5 |
| 5 | Sleepy / failed | 8 |
| 6 | Waiting | 6 |
| 7 | Thinking / working | 6 |
| 8 | Review | 6 |
| 9–10 | 16 clockwise look directions, starting upward | 16 total |

Artwork is credited publicly in [`credits.html`](../../credits.html).
