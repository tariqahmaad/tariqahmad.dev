# Screenshot placeholders — CV Builder spotlight

These three SVGs are **clearly-labeled placeholders** rendered by
`components/home/ProductSpotlight.tsx` and `app/product/page.tsx`.

| File | Shows |
| ---- | ----- |
| `editor.svg` | Guided editor + live preview |
| `templates.svg` | Classic / Rhyhorn / Nexus templates |
| `share.svg` | PDF export + share links with analytics |

## Replacing with real screenshots

1. Capture the live app at https://cv.tariqahmad.dev (1280px wide works well).
2. Drop the real files into this folder — either overwrite these SVGs
   (same filenames) or add PNGs (e.g. `editor.png`) and update the `src`
   paths in `ProductSpotlight.tsx` / `app/product/page.tsx`.
3. Compress before committing (`squoosh`, `sharp`, or `next/image`
   optimization handles the rest at build time).

No fake content: only ship captures of the real product.
