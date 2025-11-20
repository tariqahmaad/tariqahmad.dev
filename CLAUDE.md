# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Tariq Ahmad built with Next.js 15, TypeScript, and Tailwind CSS. The site is deployed on Vercel at **tariqahmad.dev**.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (uses Turbopack for faster builds)
npm run dev

# Production build
npm run build

# Start production server locally
npm start

# Run ESLint
npm run lint
```

Development server runs at `http://localhost:3000`

## Architecture

### Single-Page Application
This portfolio is a single-page application with all content in `app/page.tsx`. The page includes:
- Hero section with title and CTA buttons
- Stats section showing metrics (years of experience, projects, clients)
- About section with tech stack grid
- Projects section with 3 featured project cards
- Contact section with email and social links
- Footer

### Styling System
- **Tailwind CSS** utility classes for all styling
- Dark mode support via `dark:` prefixes (follows system preference)
- Gradient text effects using `bg-gradient-to-*` and `bg-clip-text`
- Responsive breakpoints: `md:` (768px) and `lg:` (1024px)

### TypeScript Configuration
- Path alias `@/*` maps to root directory for cleaner imports
- Strict mode enabled
- Next.js plugin for type checking

### Metadata & SEO
All SEO configuration is in `app/layout.tsx`:
- Page title, description, keywords
- Open Graph tags for social sharing
- Author metadata

## Key Files

- `app/page.tsx` - Main portfolio page (all content)
- `app/layout.tsx` - Root layout with metadata and global HTML structure
- `app/globals.css` - Tailwind directives and CSS variables for theming
- `vercel.json` - Vercel deployment config (framework detection)
- `tailwind.config.ts` - Tailwind theme customization
- `next.config.ts` - Next.js configuration (currently minimal)

## Content Updates

To update portfolio content, edit `app/page.tsx`:
- **Line 22**: Change hero title
- **Line 25**: Update tagline
- **Lines 47-63**: Modify stats (years, projects, clients, success rate)
- **Lines 74-79**: Update About section text
- **Lines 84-92**: Modify tech stack items
- **Lines 112-175**: Update project cards (titles, descriptions, tech tags, metrics)
- **Lines 214-232**: Change contact email and social links

## ESLint Notes

When adding content with apostrophes in JSX, use `'` instead of `&apos;` to avoid ESLint errors:
```tsx
// ❌ Wrong
<p>I&apos;m a developer</p>

// ✅ Correct
<p>I'm a developer</p>
```

## Deployment

The site auto-deploys to Vercel when pushing to the `main` branch. Vercel detects Next.js automatically via `vercel.json`.

Domain: tariqahmad.dev (configured in Vercel dashboard)
