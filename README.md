# Tariq Ahmad - Portfolio

Professional portfolio website showcasing my work as a Computer Engineering graduate and Software Developer.

Live at **[tariqahmad.dev](https://tariqahmad.dev)**.

## Features

- ✨ Modern, responsive design with GSAP + ScrollTrigger animations
- 🎨 Dark theme with a custom CSS-variable design system
- ⌨️ **Command console** (`⌘K` / `Ctrl+K`) — a terminal-styled palette to jump to sections and projects, open links, copy the email address, or open the CV
- 📱 Smooth scrolling with Lenis (plus proximity snap scrolling)
- 🖱️ Custom cursor effects (desktop, disabled for reduced motion)
- 🎯 Particle background animations
- 📝 Testimonials carousel with drag, wheel and keyboard controls (manual only — no autoplay)
- 🗂️ Project pages as "case files": breadcrumb HUD, tech chips, and previous/next navigation
- 🧭 The same HUD language on 404, error and loading states
- ⚡ Statically prerendered — every route is SSG
- 🔧 Built with TypeScript for type safety
- 💅 Styled with Tailwind CSS
- ♿ `prefers-reduced-motion` honoured across CSS and JS animations

## Getting Started

Requires **Node >= 20** and **pnpm**.

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build (all routes prerendered) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (`next/core-web-vitals`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm svgr:icons` | Regenerate icon components from `components/shared/icons/svgs/` |

### Dev escape hatches

- `?loader=full` — force the full preloader (useful for previewing it)
- `?loader=off` — skip the preloader entirely

## Content

All portfolio content lives in **`lib/data.ts`** — projects, experience,
certifications, stack, testimonials and the hero roles. Dates shared by the
sitemap and JSON-LD live in `lib/site.ts` (`CONTENT_UPDATED_AT`); bump that one
value when content changes. Types are in `types/index.ts`. Nothing else needs
editing to update the site's content.

Project thumbnails are optional: drop images into `public/projects/` and set
`thumbnail` / `longThumbnail` / `images` on the matching entry. Without them the
detail page and social card fall back to `/og-image.jpg`.

The CV link is **not** a committed file: `GENERAL_INFO.cvUrl` points at the CV
Builder's share URL, which always renders the latest saved CV. If that share is
ever rotated, update the one value in `lib/data.ts`. The banner button opens it
in a new tab and says “OPENING…”, not “downloaded”, because the new tab owns the
actual download.

## Routing

`app/(site)/` is the marketing shell (home + `/product`) and owns the navbar,
footer, preloader, particles, sticky email and scroll snap. `app/projects/[slug]`
lives outside the group so project pages keep their immersive, chrome-free
case-file layout without shipping the shell's JavaScript. URLs are unchanged by
the grouping.

## Deployment

Auto-deploys to Vercel on push to `main`. `next.config.ts` sets the security
headers and image formats; `vercel.json` is intentionally minimal. The apex
domain (`tariqahmad.dev`) 301-redirects to `https://www.tariqahmad.dev`, which is
the canonical host used by metadata, the sitemap and JSON-LD.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** GSAP + ScrollTrigger (`@gsap/react`)
- **Smooth Scroll:** Lenis
- **Package Manager:** pnpm
- **Deployment:** Vercel

## Author

**Tariq Ahmad**
- Computer Engineering Graduate, Istanbul Aydin University
- Email: me@tariqahmad.dev
- LinkedIn: [linkedin.com/in/tariq-ahmad-a43320264](https://www.linkedin.com/in/tariq-ahmad-a43320264/)
- GitHub: [github.com/tariqahmaad](https://github.com/tariqahmaad)

## License

MIT
