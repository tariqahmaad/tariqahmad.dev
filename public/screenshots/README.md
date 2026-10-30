# Product screenshots — CV Builder spotlight

Real captures of the live app at https://cv.tariqahmad.dev (1280px
viewport), rendered by `components/home/ProductSpotlight.tsx` and
`app/product/page.tsx`.

| File | Shows | Size |
| ---- | ----- | ---- |
| `editor.webp` | Guided editor + live A4 preview | 1280x788 |
| `templates.webp` | Template gallery: Classic, Rhyhorn, Nexus | 1280x743 |
| `landing.webp` | Landing hero: start free, no account needed | 1280x632 |

Captured 2026-10-07. To refresh: re-capture at 1280px wide, overwrite
the `.webp` files, keep filenames stable. No fake content: only ship
captures of the real product.

Notes on the current files:

- Served as WebP at 1280px (kept the originals' aspect, ~93% smaller than
  the 2500px PNGs they replaced).
- The heights differ because `landing` and `templates` were cropped: the
  former to remove the live app's first-visit "comet cursor" tooltip and
  its widget, the latter to cut just below the "Use This Template" row so
  the cards are not sliced mid-card.
- Each image's real `width`/`height` is declared in the two components
  above, so they render at their own ratio with no `object-cover` crop.
- `editor.webp` is the weakest of the three: it was captured with the
  form empty, so the A4 preview is blank and the progress ring reads 0%.
  Re-capture it with sample data entered (name, summary, experience,
  skills) before the next content pass.
