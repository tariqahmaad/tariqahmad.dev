# Product screenshots — CV Builder spotlight

Real captures of the live app at https://cv.tariqahmad.dev, served at
1280px wide and rendered by `components/home/ProductSpotlight.tsx` and
`app/(site)/product/page.tsx`.

Order matters: the spotlight and `/product` gallery render the array in
order, so this is also the display order.

| File | Shows | Size |
| ---- | ----- | ---- |
| `landing.webp` | Landing hero: start free, no account needed | 1280x793 |
| `templates.webp` | Template gallery: Classic, Rhyhorn, Nexus, Ivy | 1280x794 |
| `editor.webp` | Guided editor + live A4 preview | 1280x788 |

`templates` and `landing` captured 2026-11-07; `editor` is from the
2026-10-07 pass. To refresh: re-capture, overwrite the `.webp` files, keep
filenames stable. No fake content: only ship captures of the real product.

Notes on the current files:

- Served as WebP at 1280px (kept the originals' aspect, ~94% smaller than
  the 2500px PNGs they replaced).
- The 2026-11 captures were taken at 2x on a ~1250px viewport. The browser
  scrollbar and the Next.js dev-tools badge (bottom-left) were removed
  before resizing, so the images contain only product UI.
- Each image's real `width`/`height` is declared in the two components
  above, so they render at their own ratio with no `object-cover` crop.
- `editor.webp` is the weakest of the three: it was captured with the
  form empty, so the A4 preview is blank and the progress ring reads 0%.
  Re-capture it with sample data entered (name, summary, experience,
  skills) before the next content pass.
