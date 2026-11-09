# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Tariq Ahmad built with Next.js 15, TypeScript, Tailwind CSS, and GSAP animations. Features smooth scrolling with Lenis, custom cursor effects, and particle backgrounds. Deployed on Vercel at **tariqahmad.dev**.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Production build
pnpm build

# Delete the .next cache (dev and build share it - see note below)
pnpm clean

# Run ESLint
pnpm lint

# Typecheck (tsc --noEmit)
pnpm typecheck

# Generate React components from SVG icons (uses SVGR)
pnpm svgr:icons
```

Development server runs at `http://localhost:3000`

`next dev` and `next build` share `.next`, so switching between them while the
other is running (or after an interrupted run) leaves a mixed cache and fails
with errors like `Cannot find module './vendor-chunks/…'` or
`Cannot find module for page: /_document`. Run `pnpm clean` and restart.

## Architecture

### Data-Driven Content

All portfolio content is centralized in `lib/data.ts`:
- `GENERAL_INFO` - Contact information (email, LinkedIn, `cvUrl`)
- `SOCIAL_LINKS` - Social media profiles
- `MY_STACK` - Technology stack organized by category (languages, frontend, backend, database, tools), typed as `Record<string, ISkill[]>`
- `PROJECTS` - Project details with HTML descriptions, tech stacks, links
- `MY_EXPERIENCE` - Work history with highlighted flag for featured roles
- `MY_CERTIFICATIONS` - Certifications grouped by provider
- `BANNER_ROLES` - Rotating hero role pairs (first/second line)
- `BANNER_STATS` - CGPA / project count / certification count (derived from data)
- `ABOUT_ME` - Tagline, availability line, bio paragraphs
- `TESTIMONIALS` - Quotes with optional `avatar` and `rating`

Non-content constants live in `lib/site.ts` (`SITE_URL`, `CONTENT_UPDATED_AT`).
The sitemap and JSON-LD `dateModified` both read `CONTENT_UPDATED_AT`, so there
is one date to bump. `lib/navigation.ts` is the single source for the site's
sections (navbar labels/icons, scroll-spy, console), and `lib/commands.ts`
describes the console's command index.

Types are defined in `types/index.ts` (`IProject`, `IProjectLink`, `IExperience`, `ITestimonial`, `ISkill`, `ICertificationCategory`).

### Animation System

Uses **GSAP** with ScrollTrigger for scroll-triggered animations:
- Each major section (Banner, Skills, Experiences, Certifications) has its own animation setup
- `useGSAP` hook from `@gsap/react` for proper cleanup
- Scroll triggers: reveal animations use `start: 'top 90%'`; the shared exit
  fade in `hooks/useScrollExitAnimation.ts` uses `start: 'bottom 50%'` /
  `end: 'bottom 10%'` with `scrub: 1`

**Lenis** provides smooth scrolling:
- Initialized in `app/layout.tsx` via `ReactLenis` wrapper with `duration: 1.4`
  (Lenis takes the duration + easing branch when `duration` is set, so a `lerp`
  alongside it would be dead config)
- `LenisBridge` component exposes the instance on `window.lenis` for use in utility functions (`scrollToSection`) and the scroll lock
- Snap scrolling enabled via `ScrollSnap` component using the typed `lenis/snap` entry point (not a deep `dist/` import)

### Site Shell, Console and HUD Language

`app/(site)/layout.tsx` owns the marketing chrome (Navbar, Footer, Preloader,
ParticleBackground, StickyEmail, ScrollSnap) for `/` and `/product`. Project
pages live outside that group, wrap themselves in `<main id="main">`, and keep
their immersive case-file layout. The root layout keeps only global pieces
(Lenis, providers, CustomCursor, ScrollProgressIndicator, ScrollToTop).

- **Command console**: `components/command/CommandProvider.tsx` holds the
  `⌘K`/`Ctrl+K` state and lazy-loads `CommandPalette.tsx`. The palette is a
  modal dialog with a combobox input (`aria-activedescendant`), ref-counted
  scroll lock, inert background, focus restore, and a static command index in
  `lib/commands.ts`. Triggers: the `Search ⌘K` button in the header (next to the
  menu toggle) and the keyboard shortcut. It is deliberately not a row in the
  menu list.
- **One scroll-spy**: `ActiveSectionProvider` runs `useScrollDetection` once and
  feeds the navbar plus the console's status line.
- **HUD primitives**: `components/shared/hud/` — `BracketFrame` (corner arms),
  `HudButton` (solid/outline link button), `HudOverlay` (modal backdrop),
  `LaunchArrow` (`LaunchArrow` = the stroke-draw arrow glyph, `ArrowLaunchSlot`
  = the full launch sequence: prompt cursor, glide, RGB echoes, reticle,
  glitch bursts). The slot is used on project titles, the prev/next case cards
  and the footer email; the bare glyph (`rest="drawn"`) on "See how it works"
  and the back link. Both need an ancestor `group`. Pick a `direction` rather
  than mirroring with a CSS transform: the glitch/echo keyframes own `transform`.
- **Page transitions**: one system for every internal link. `TransitionLink`
  closes the preloader's slat shutter (`closeShutter`), the route changes,
  `app/template.tsx` opens it (`openShutter`), then the page's content enters via
  `usePageEnter` (`.fade-in-later` on project pages, `data-enter` inside
  `PageEnter` on `/product`). All durations live in `PAGE_TRANSITION`
  (`lib/page-transition.ts`); change feel there, not per page. A new page should
  mark its hero blocks and call the hook rather than inventing its own reveal.
  Two traps: the safety timer in `TransitionLink` must stay long (`stuckAfter`),
  because a slow navigation (a dev server compiling a route) is not a failed one,
  and cross-route section links (`/#selected-projects`) navigate to a bare `/` and
  queue the section in `lib/section-handoff.ts` (use `pushWithSection` for
  `router.push`; `TransitionLink` does it itself), so the address bar never shows
  a hash. They rely on `HashScroll` (home
  page), since Next looks for the hash before the page behind `loading.tsx`
  exists and Lenis clamps to its stale page height unless it is `resize()`d first.
- **Errors**: `components/error/HudErrorScreen.tsx` is shared by `app/error.tsx`,
  `app/not-found.tsx`, `app/global-error.tsx` and `ErrorBoundary`.
- **Modal contract**: dialogs carry `data-modal-open="true"` so `⌘K` never stacks
  a second dialog; `useInertOutside` handles background inerting and restores
  prior state. Two gotchas: (1) `useInertOutside`'s only dependency is
  `isActive`, so a dialog that renders after the first commit (a portal behind a
  `mounted` flag, like `ScreenshotLightbox`) must pass that flag, not a constant
  `true` — otherwise it runs before the dialog exists and never re-runs;
  (2) `useScrollLock` stops Lenis, and a stopped Lenis `preventDefault`s every
  wheel/touch event, so any scrollable region inside a dialog needs
  `data-lenis-prevent` (the menu panel and the palette list have it).
- **Never restyle `<html>` while a modal opens.** Any style change on the root
  (a class, `overflow`) re-resolves the whole page: ~115ms at 4x CPU, versus ~2ms
  on `<body>`. That was the first-click stutter on the menu and the search
  button. So `useScrollLock` freezes the page with a fixed body only (no
  `overflow` writes, writes before `lenis.stop()`, no `clientWidth` read), and
  `LenisBridge` no-ops `lenis.updateClassName` so Lenis never rewrites the
  `<html>` class list. Do not add `lenis-*` CSS or `html.…` toggles back.

### Styling System

**Tailwind CSS** with custom configuration:
- CSS Variables in `app/globals.css` for theming (HSL color format)
- Dark theme with primary green (`140 100% 50%`) and secondary cyan (`193 100% 52%`)
- Custom typography system in `tailwind.config.ts`:
  - Display sizes: `display-sm` (48px) to `display-xl` (90px)
  - Heading sizes: `heading-sm` (30px) to `heading-lg` (48px)
  - Body sizes: `body-sm` (14px) to `body-xl` (20px)
- Custom fonts: Anton (headings) and Roboto Flex (body) via CSS variables
- Container max-width: 1148px (`xl` and `2xl` breakpoints)

**CSS Patterns:**
- The native cursor is hidden only after `CustomCursor` mounts and adds
  `html.has-custom-cursor` (so a JS failure never leaves desktop users with no
  cursor), and only when `prefers-reduced-motion` allows
- Scrollbar is hidden via `::-webkit-scrollbar { display: none; }` plus
  `scrollbar-width: none` for Firefox
- Extensive `prefers-reduced-motion` support - all animations respect user preference
- **Hover vs. touch vs. keyboard**: `tailwind.config.ts` sets
  `future.hoverOnlyWhenSupported`, so `hover:`/`group-hover:` only fire on devices
  that really hover (no stuck hover after a tap). Two custom variants:
  `group-engaged:` = an ancestor `.group` is hovered (hover devices) **or**
  keyboard focus-visible — use it instead of `group-hover:` for any reveal, so
  keyboard users get the same effect; `no-hover:` = the primary input cannot
  hover (touch), for resting states desktop only gets on hover.
- **Unnamed `group` matches ANY hovered ancestor group.** A child inside a
  hoverable card that is itself a `group` reacts to the whole card. Use a named
  group (`group/details`, `group-hover/details:`) or, for `BracketFrame`,
  `hoverScope="none"` with `active` driving it.
- Tailwind silently emits nothing for a class that is not in the scale (e.g.
  `delay-250`, `duration-450`). After adding utilities, compile once and grep the
  output: `pnpm exec tailwindcss -i app/globals.css -o <scratch>.css --content "a.tsx,b.tsx"`
  (one comma-separated `--content`; repeating the flag keeps only the last).
- The dev server's Tailwind cache can go stale after several edits (new classes
  stop being generated, with no error). If a class "does nothing" in dev but
  compiles fine from the CLI, `pnpm clean` and restart before debugging the code.
- A keyframe in `tailwind.config.ts` can be used without an `animate-<name>`
  class: arbitrary values like `animate-[scan_1.6s_ease-in-out_infinite]` (the
  loading bar in `app/(site)/loading.tsx`) pull it in by name. Before deleting a
  "dead" keyframe, grep for `<name>_` as well as `animate-<name>`.
- The boot `Preloader` plays once per page load, not once per mount: project
  pages sit outside the `(site)` group, so returning from one remounts it. The
  module flag `bootedThisDocument` (set only when a show completes) makes that
  remount render nothing; a real refresh resets it and still gets the encore.

### Icon System

Two approaches for icons:
1. **Lucide React** - For standard UI icons (`lucide-react` package)
2. **Custom SVG Icons** - Stored in `components/shared/icons/`
   - To add new icons: create `components/shared/icons/svgs/` (it is not checked
     in), place SVG files there, then run `pnpm svgr:icons` to generate React components
   - Custom icons use SVGR with `--no-dimensions --typescript` flags

### Custom Hooks

Located in `hooks/`:
- `useScrollExitAnimation` - GSAP exit animations on scroll
- `usePageEnter` - The one content entrance after a page transition (timed by `lib/page-transition.ts`)
- `useGlitchText` - Text glitch effect
- `useScrollDetection` - Active-section detection (run once by `ActiveSectionProvider`)
- `useScrollDirection` - Down/up scroll state (dims the phone menu toggle)
- `useMediaQuery` - Live CSS media-query subscription (SSR-safe)
- `useScrollLock` - Ref-counted body scroll lock (menu, console, lightbox)
- `useInertOutside` - Inert everything outside a modal's branch, restoring prior state
- `useMenuKeyboardNavigation` - Keyboard navigation for menus

### SEO Configuration

- `app/robots.ts` - Dynamic robots.txt generation
- `app/sitemap.ts` - Dynamic sitemap.xml generation (lastModified = `CONTENT_UPDATED_AT`)
- `components/layout/StructuredData.tsx` - JSON-LD structured data (dateModified = `CONTENT_UPDATED_AT`)
- Metadata configured in `app/layout.tsx` with Open Graph and Twitter cards
- `/product` has its own 1200×630 card at `public/og-product.jpg` (a real
  template-gallery capture), not the portfolio's personal `og-image.jpg`.

### Project Structure

```
app/
  layout.tsx          # Root layout: fonts, metadata, Lenis, providers, global overlays
  template.tsx        # Page-transition slat shutter (wraps every route)
  globals.css         # CSS variables, HUD utilities, reduced-motion support
  error.tsx           # Route error boundary (HudErrorScreen)
  global-error.tsx    # Fatal fallback, renders its own <html>/<body>
  not-found.tsx       # Terminal-style 404
  robots.ts           # SEO robots.txt
  sitemap.ts          # SEO sitemap.xml
  (site)/
    layout.tsx        # Marketing chrome: Navbar, <main>, Footer, Preloader, particles, email, snap
    loading.tsx       # HUD boot skeleton
    page.tsx          # Portfolio homepage (imports all sections)
    product/page.tsx  # CV Builder case study
  projects/[slug]/    # Immersive project "case files" (outside the site shell)
    page.tsx
    loading.tsx

components/
  command/            # CommandProvider (⌘K state) + lazy CommandPalette
  home/               # Banner, AboutMe, Skills, Experiences, Certifications, ProductSpotlight, ProjectList, Testimonials, DurationBar, CvDownloadButton, ConnectButton
  layout/             # Navbar, Footer, CustomCursor, Preloader, ParticleBackground, ScrollProgressIndicator, StickyEmail, LenisBridge, ScrollSnap, ScrollToTop, StructuredData, ActiveSectionProvider
  shared/             # SectionTitle, TransitionLink, ArrowAnimation, BackLink
  shared/hud/         # BracketFrame, HudButton, HudOverlay, LaunchArrow
  shared/icons/       # Custom SVG icon components
  projects/           # ProjectCard, ProjectDetails
  product/            # ScreenshotGallery, ScreenshotLightbox, ScreenshotPreviewPanel, screenshots.ts
  error/              # ErrorBoundary, HudErrorScreen, GlobalErrorFallback

hooks/                # useScrollExitAnimation, useGlitchText, useScrollDetection, useScrollDirection, useMediaQuery, useScrollLock, useInertOutside, useMenuKeyboardNavigation, useStickyIndex, useCursorPreview

lib/
  data.ts             # All portfolio content (edit this to update content)
  site.ts             # SITE_URL, CONTENT_UPDATED_AT
  navigation.ts       # SITE_SECTIONS (navbar + scroll-spy + console)
  page-transition.ts  # Shutter close/open + the timing table every page shares
  commands.ts         # Console command index
  utils.ts            # cn() utility, scrollToSection, gradient text classes, shouldSkipAnimation
  gsap-setup.ts       # GSAP + ScrollTrigger initialization

types/
  index.ts            # TypeScript interfaces (IProject, IProjectLink, IExperience, ITestimonial, ISkill, ICertification*)

public/
  logo/               # Technology stack icons (match names in MY_STACK)
  projects/           # Project images (empty — set `thumbnail` in data.ts to use)
  personal/           # Profile images
  screenshots/        # Real CV Builder captures (spotlight + /product gallery)
  testimonials/       # Optional testimonial avatars (set `avatar` in data.ts to use)
  og-image.jpg        # Portfolio social card
  og-product.jpg      # /product social card (1200×630)
```

### Path Aliases

`@/*` maps to project root for clean imports:
```ts
import { PROJECTS } from '@/lib/data';
import { IProject } from '@/types';
```

### ESLint Rules

- Config is just `{ "extends": "next/core-web-vitals" }` — there are no custom
  rules, and `react/no-unescaped-entities` is **not** enabled. The house style is
  still to write real apostrophes in JSX (`I'm`, not `I&apos;m`), but it is not
  enforced by lint.
- There is no test runner. `pnpm lint`, `pnpm typecheck` and `pnpm build` are the
  only gates, and `.github/workflows/ci.yml` runs exactly those three on every
  push to `main` and every pull request (with `pnpm install --frozen-lockfile`,
  the same lockfile check Vercel performs on deploy).

## Content Updates

To update portfolio content, edit `lib/data.ts`:

**Adding Projects:**
```ts
{
  title: 'Project Name',
  slug: 'project-slug',  // Used for routing if detail pages added
  year: 2024,
  techStack: ['React', 'TypeScript'],
  description: 'HTML string with <br/> and <ul> formatting',
  role: 'HTML string for detailed role description',
  sourceCode: 'https://github.com/...',
  liveUrl: 'https://...',
}
```

**Adding Skills:**
- Add entry to `MY_STACK` category with icon path `/logo/filename.png`
- Add corresponding icon file to `public/logo/`

**Adding Experience:**
- Set `highlighted: true` for featured/important positions (adds "Featured" badge, glow effects on timeline dot, and enhanced duration bar animation)

**CV link:**
- `GENERAL_INFO.cvUrl` is the CV Builder share URL, not a committed file; it
  renders the latest saved CV. If the share is rotated, update that one value.
  The banner button says "OPENING…" because the new tab owns the download.

**Dates:**
- Bump `CONTENT_UPDATED_AT` in `lib/site.ts` when content changes (feeds the
  sitemap and JSON-LD).

## Key Implementation Details

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:
- CSS animations reduced to `0.01ms` duration
- Scroll-triggered animations disabled via GSAP `prefersReducedMotion()` check
  (scrubbed/pinned ones use `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`)
- Lenis smooth wheel scrolling is switched off live by `LenisBridge`, and
  `scrollToSection` / `ScrollToTop` jump (`immediate`) instead of gliding
- Custom cursor disabled when reduced motion is preferred
- Content visibility ensured via `opacity: 1 !important` overrides

### Custom Cursor

- Only active on desktop (`min-width: 768px`), and the breakpoint/reduced-motion
  media queries are subscribed to (not read once), so resizing across 768px
  enables/disables it live
- The native cursor is hidden via `html.has-custom-cursor * { cursor: none !important }` —
  the class is added only after the cursor is actually initialized, so a JS
  failure never leaves desktop users without a cursor
- Follow motion uses `gsap.quickTo` (one tween, retargeted per frame) and the
  element is centred with `xPercent/yPercent: -50` so GSAP does not clobber the
  centering
- Respects `prefers-reduced-motion` - falls back to native cursor

### Performance Optimizations

- `will-change: transform` on frequently animated elements
- Images use `formats: ['image/avif', 'image/webp']` in Next.js config
- Scrollbar hidden to prevent layout shifts during smooth scroll
- GPU acceleration for backdrop-filter elements

## Deployment

Auto-deploys to Vercel on push to `main` branch.

Canonical domain: **https://www.tariqahmad.dev** (the apex `tariqahmad.dev`
301-redirects to it).


