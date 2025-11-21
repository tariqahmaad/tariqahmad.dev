# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Tariq Ahmad built with Next.js 15, TypeScript, Tailwind CSS, and GSAP animations. The site features smooth scrolling, custom cursor effects, and particle backgrounds. Deployed on Vercel at **tariqahmad.dev**.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Production build
pnpm build

# Start production server locally
pnpm start

# Run ESLint
pnpm lint
```

Development server runs at `http://localhost:3000`

## Architecture

### Component-Based Architecture
This portfolio uses a modern component-based structure:

**Main Page Components** (`app/_components/`):
- `Banner.tsx` - Hero section with animated title and stats
- `AboutMe.tsx` - About section with personal introduction
- `Skills.tsx` - Tech stack showcase with icons
- `Experiences.tsx` - Work experience timeline
- `ProjectList.tsx` - Featured projects grid

**Shared Components** (`components/`):
- `Navbar.tsx` - Hamburger menu navigation
- `Footer.tsx` - Footer with credits and GitHub stats
- `CustomCursor.tsx` - Custom cursor animation
- `ParticleBackground.tsx` - Animated particle effects
- `Preloader.tsx` - Loading animation
- `ScrollProgressIndicator.tsx` - Scroll progress bar
- `StickyEmail.tsx` - Vertical email link

### Data Management
All portfolio content is centralized in `lib/data.ts`:
- `GENERAL_INFO` - Contact information (email, phone, LinkedIn)
- `SOCIAL_LINKS` - Social media links
- `MY_STACK` - Technology stack with icons
- `PROJECTS` - Project details with descriptions, tech stack, images
- `MY_EXPERIENCE` - Work experience history

### Animation System
- **GSAP** - Complex scroll-triggered animations
- **Lenis** - Smooth scrolling library
- Scroll triggers defined per component

### Styling System
- **Tailwind CSS** utility classes for all styling
- **CSS Variables** in `app/globals.css` for theming
- Custom fonts: Anton (headings) and Roboto Flex (body)
- Dark theme with custom color palette

### TypeScript Configuration
- Path alias `@/*` maps to root directory for cleaner imports
- Strict mode enabled
- Next.js plugin for type checking

### Metadata & SEO
All SEO configuration is in `app/layout.tsx`:
- Page title, description
- Google fonts integration
- Removed analytics (was for previous owner)

## Key Files

**Core Files:**
- `app/page.tsx` - Main page layout (imports all components)
- `app/layout.tsx` - Root layout with fonts and wrappers
- `app/globals.css` - Global styles and CSS variables
- `lib/data.ts` - **All portfolio content (EDIT THIS TO UPDATE CONTENT)**
- `types/index.ts` - TypeScript type definitions

**Configuration:**
- `tailwind.config.ts` - Tailwind theme customization
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Component library config
- `vercel.json` - Vercel deployment config

## Content Updates

To update portfolio content, edit `lib/data.ts`:
- **GENERAL_INFO** - Email, phone, LinkedIn URL
- **SOCIAL_LINKS** - Social media profiles
- **MY_STACK** - Add/remove technologies (need matching icons in `/public/logo/`)
- **PROJECTS** - Project details, descriptions, tech stacks (need images in `/public/projects/`)
- **MY_EXPERIENCE** - Work history

## Component Customization

To customize component appearance:
- **Banner** stats: Edit `app/_components/Banner.tsx` lines 70-92
- **AboutMe** text: Edit `app/_components/AboutMe.tsx` lines 57-91
- **Footer** credits: Edit `components/Footer.tsx` lines 33-51

## Assets

**Logo Icons** (`public/logo/`):
- Technology logos for skills section
- Must match names in `MY_STACK` in data.ts

**Project Images** (`public/projects/`):
- `thumbnail/` - Grid view images
- `long/` - Detail page hero images
- `images/` - Detail page gallery images

## ESLint Notes

Use actual apostrophes in JSX, not HTML entities:
```tsx
// ✅ Correct
<p>I'm a developer</p>

// ❌ Wrong (causes ESLint errors)
<p>I&apos;m a developer</p>
```

## Author

**Tariq Ahmad** - Computer Engineering Student at Istanbul Aydin University
- Email: tariq_muzamil@live.com
- LinkedIn: linkedin.com/in/tariqahmad
- GitHub: github.com/tariqahmaad

## Deployment

The site auto-deploys to Vercel when pushing to the `main` branch.

Domain: tariqahmad.dev (configured in Vercel dashboard)
