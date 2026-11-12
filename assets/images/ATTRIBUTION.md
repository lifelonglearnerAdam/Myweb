# Visual assets & attribution

## Original site assets

- `landscape.svg`: original blue/lilac landscape designed for this homepage.
- `wish-tree.svg`: original pink wishing-tree illustration inspired by the relationship-tree motif in *Fox Spirit Matchmaker*. Not an official image or extracted game/anime asset.
- `favicon.svg`: original Z monogram.
- `quantpilot.svg`, `ledger.svg`: original interface studies with illustrative, non-personal data; not screenshots of private accounts.
- `research.svg`: original diagram illustrating image / ground-truth / prediction comparison.
- `social-preview.png`: original social preview based on the site’s visual identity.
- `docsift.webp`, `miniso.webp`: resized screenshots of the owner’s public project demos.
- `avatar.webp`: crop of the profile photograph already present in the original public Myweb repository.

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

Each original cell is 192 × 208; browser cells are displayed at 144 × 156 CSS pixels.

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
