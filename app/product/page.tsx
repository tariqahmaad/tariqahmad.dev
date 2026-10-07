import type { Metadata } from 'next';
import Image from 'next/image';
import {
    ArrowLeft,
    Download,
    Eye,
    History,
    LayoutTemplate,
    Pencil,
    Save,
    Share2,
    User,
} from 'lucide-react';
import TransitionLink from '@/components/shared/TransitionLink';

export const metadata: Metadata = {
    title: 'CV Builder - Free ATS Resume Builder',
    description:
        'CV Builder: a free browser-based resume builder with 3 ATS-friendly templates, live A4 preview, instant PDF export, and share links with analytics.',
    alternates: {
        canonical: 'https://tariqahmad.dev/product',
    },
    openGraph: {
        type: 'website',
        url: 'https://tariqahmad.dev/product',
        siteName: 'Tariq Ahmad Portfolio',
        title: 'CV Builder by Tariq Ahmad - Free ATS Resume Builder with AI',
        description:
            'Free browser-based resume builder: 3 ATS-friendly templates, live A4 preview, instant PDF export, share links with analytics.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'CV Builder - Free ATS Resume Builder with AI',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CV Builder by Tariq Ahmad - Free ATS Resume Builder with AI',
        description:
            'Free browser-based resume builder: 3 ATS-friendly templates, live A4 preview, instant PDF export, share links with analytics.',
        images: ['/og-image.png'],
    },
};

const FEATURES = [
    {
        icon: Pencil,
        title: 'Guided editor',
        text: 'Profile, work history, education, projects, and skills in structured sections — no design skills needed.',
    },
    {
        icon: Eye,
        title: 'Live A4 preview',
        text: 'The preview keeps up with every keystroke, paginated to real A4 so there are no export surprises.',
    },
    {
        icon: LayoutTemplate,
        title: 'Three templates',
        text: 'Classic, Rhyhorn, and Nexus — each ATS-friendly, switchable at any time without retyping.',
    },
    {
        icon: Download,
        title: 'Instant PDF export',
        text: 'One click to a clean, ATS-friendly PDF. No account required for the core builder flow.',
    },
    {
        icon: Share2,
        title: 'Share links + analytics',
        text: 'Get a unique link for recruiters and see views and engagement on what you shared.',
    },
    {
        icon: User,
        title: 'Guest mode',
        text: 'Start building immediately — your data stays in your browser until you choose otherwise.',
    },
    {
        icon: Save,
        title: 'Auto-save',
        text: 'Drafts save automatically as you work, so a closed tab never means lost work.',
    },
    {
        icon: History,
        title: 'Version control',
        text: 'Named versions let you tailor a resume per application and roll back any time.',
    },
];

const STACK = [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind',
    'Firebase',
    'react-pdf',
];

export default function ProductPage() {
    return (
        <div className="pb-section">
            {/* Hero */}
            <section className="relative overflow-hidden pt-28 xs:pt-32 md:pt-40 pb-10 xs:pb-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/[0.07] to-transparent"
                />
                <div className="container relative">
                    <TransitionLink
                        href="/"
                        className="group mb-8 inline-flex h-12 items-center gap-2 font-mono text-ui-base uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary outline-none"
                    >
                        <ArrowLeft
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                            aria-hidden="true"
                        />
                        Back to portfolio
                    </TransitionLink>

                    <div className="flex flex-wrap items-center gap-2.5 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 bg-primary/[0.06] rounded-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            <span className="font-mono text-ui-sm uppercase tracking-wider text-primary/90">
                                Live product
                            </span>
                        </span>
                    </div>

                    <h1 className="font-anton text-display-sm sm:text-display-md md:text-display-lg leading-none">
                        CV Builder
                    </h1>
                    <p className="mt-5 max-w-[52ch] text-balance text-body-lg sm:text-body-xl leading-relaxed text-muted-foreground">
                        Build an ATS-friendly resume in your browser - free,
                        no account needed. Guided sections, a live A4
                        preview, and instant PDF export.
                    </p>

                    <div className="mt-8">
                        <a
                            href="https://cv.tariqahmad.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open the live CV Builder app (opens in a new tab)"
                            className="group/live relative inline-flex items-center justify-center gap-2 h-14 px-10 bg-primary text-primary-foreground uppercase font-anton tracking-widest text-body-lg sm:text-body-xl overflow-hidden transition-colors outline-none hover:bg-primary-hover"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover/live:top-0 transition-all duration-500 ease-out"
                            />
                            <span className="z-[1]">
                                Open the live app
                            </span>
                        </a>
                        <p className="mt-3 font-mono text-ui-sm text-muted-foreground/70">
                            Free forever · No credit card required
                        </p>
                    </div>
                </div>
            </section>

            {/* What it is */}
            <section className="py-10 xs:py-14">
                <div className="container">
                    <p className="font-mono uppercase tracking-[0.25em] text-primary/70 text-body-sm sm:text-body-base mb-4">
                        {'// what it is'}
                    </p>
                    <h2 className="font-anton text-heading-sm sm:text-heading-md md:text-heading-lg leading-tight max-w-[20ch]">
                        A resume builder that respects your time — and your
                        data.
                    </h2>
                    <div className="mt-6 max-w-[68ch] space-y-3 text-body-lg sm:text-body-xl text-muted-foreground leading-relaxed">
                        <p>
                            CV Builder runs entirely in the browser: type in
                            the guided editor and watch a real A4 preview
                            update as you go. When it looks right, export a
                            clean PDF or share a link with recruiters.
                        </p>
                        <p>
                            The core flow — editor, templates, PDF export —
                            needs no account. Signing in unlocks the cloud
                            workflow: saved drafts, named versions, share
                            links, and view analytics.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature grid */}
            <section className="py-10 xs:py-14">
                <div className="container">
                    <p className="font-mono uppercase tracking-[0.25em] text-primary/70 text-body-sm sm:text-body-base mb-4">
                        {'// features'}
                    </p>
                    <h2 className="font-anton text-heading-sm sm:text-heading-md leading-tight mb-8">
                        Everything you need
                    </h2>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <li
                                    key={feature.title}
                                    className="border border-white/10 bg-card p-5 transition-colors duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.35)]"
                                >
                                    <Icon
                                        className="w-6 h-6 text-primary"
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-4 font-anton text-body-xl tracking-wide">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                                        {feature.text}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* Screenshots (captured live from cv.tariqahmad.dev) */}
            <section className="py-10 xs:py-14">
                <div className="container">
                    <p className="font-mono uppercase tracking-[0.25em] text-primary/70 text-body-sm sm:text-body-base mb-4">
                        {'// take a look'}
                    </p>
                    <h2 className="font-anton text-heading-sm sm:text-heading-md leading-tight mb-8">
                        Straight from the app
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                src: '/screenshots/editor.png',
                                alt: 'The CV Builder guided editor with live A4 preview',
                            },
                            {
                                src: '/screenshots/templates.png',
                                alt: 'The CV Builder template gallery with Classic, Rhyhorn and Nexus',
                            },
                            {
                                src: '/screenshots/landing.png',
                                alt: 'The CV Builder landing page: build a resume that gets you hired',
                            },
                        ].map((shot) => (
                            <figure
                                key={shot.src}
                                className="border border-white/10 bg-card overflow-hidden rounded-sm"
                            >
                                <Image
                                    src={shot.src}
                                    alt={shot.alt}
                                    width={800}
                                    height={500}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1148px) 33vw, 360px"
                                    loading="lazy"
                                    className="w-full aspect-[8/5] object-cover"
                                />
                                <figcaption className="px-3 py-2 font-mono text-ui-sm text-muted-foreground/80 border-t border-white/5">
                                    Captured live from the app
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech stack */}
            <section className="py-10 xs:py-14">
                <div className="container">
                    <p className="font-mono uppercase tracking-[0.25em] text-primary/70 text-body-sm sm:text-body-base mb-4">
                        {'// under the hood'}
                    </p>
                    <ul className="flex flex-wrap gap-2.5" aria-label="Tech stack">
                        {STACK.map((tech) => (
                            <li
                                key={tech}
                                className="px-3 py-1.5 border border-white/10 bg-card font-mono text-ui-base text-foreground/80"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Big CTA + quiet way back */}
            <section className="pt-10 xs:pt-14 pb-4 text-center">
                <div className="container">
                    <h2 className="font-anton text-heading-md sm:text-heading-lg leading-tight">
                        Your next role starts
                        <br />
                        with a better resume.
                    </h2>
                    <div className="mt-8">
                        <a
                            href="https://cv.tariqahmad.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open the live CV Builder app (opens in a new tab)"
                            className="group/live relative inline-flex items-center justify-center gap-2 h-14 px-10 bg-primary text-primary-foreground uppercase font-anton tracking-widest text-body-lg sm:text-body-xl overflow-hidden transition-colors outline-none hover:bg-primary-hover"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover/live:top-0 transition-all duration-500 ease-out"
                            />
                            <span className="z-[1]">Start building — it&apos;s free</span>
                        </a>
                    </div>
                    <p className="mt-10 font-mono text-ui-sm text-muted-foreground/60">
                        <TransitionLink
                            href="/#about-me"
                            className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline hover:text-foreground transition-colors"
                        >
                            <ArrowLeft
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                            />
                            Back to about me &amp; the portfolio
                        </TransitionLink>
                    </p>
                </div>
            </section>
        </div>
    );
}
