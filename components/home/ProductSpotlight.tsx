'use client';

import Image from 'next/image';
import { ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import TransitionLink from '@/components/shared/TransitionLink';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { shouldSkipAnimation } from '@/lib/utils';
import { useRef } from 'react';

const SCREENSHOTS = [
    {
        src: '/screenshots/editor.png',
        alt: 'The CV Builder guided editor with live A4 preview',
        caption: 'Guided editor with live preview',
    },
    {
        src: '/screenshots/templates.png',
        alt: 'The CV Builder template gallery with Classic, Rhyhorn and Nexus',
        caption: 'Three ATS-friendly templates',
    },
    {
        src: '/screenshots/landing.png',
        alt: 'The CV Builder landing page: build a resume that gets you hired',
        caption: 'Start free, no account needed',
    },
];

const ProductSpotlight = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const card = cardRef.current;
            if (!card) return;

            if (shouldSkipAnimation()) {
                gsap.set(card, { clearProps: 'all' });
                return;
            }

            gsap.from(card, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({ containerRef });

    return (
        <section className="py-section" id="product-spotlight">
            <div className="container" ref={containerRef}>
                <SectionTitle title="FEATURED PRODUCT" />

                <article
                    ref={cardRef}
                    className="group relative border border-primary/25 bg-card overflow-hidden rounded-tl-[10px] rounded-br-[10px] transition-colors duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.35)]"
                >
                    {/* Top glow wash */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.08] to-transparent"
                    />
                    {/* Corner brackets */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-0 left-0 z-20 w-6 h-6 border-t-2 border-l-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 right-0 z-20 w-6 h-6 border-b-2 border-r-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <div className="relative p-6 xs:p-8 md:p-10">
                        <div className="flex flex-wrap items-center gap-2.5 mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 bg-primary/[0.06] rounded-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                </span>
                                <span className="font-mono text-ui-sm uppercase tracking-wider text-primary/90">
                                    Live product
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-secondary/30 bg-secondary/[0.06] rounded-sm">
                                <Sparkles
                                    className="w-3.5 h-3.5 text-secondary"
                                    aria-hidden="true"
                                />
                                <span className="font-mono text-ui-sm uppercase tracking-wider text-secondary/90">
                                    Built with Claude
                                </span>
                            </span>
                        </div>

                        <h3 className="font-anton text-heading-md sm:text-heading-lg leading-tight">
                            CV Builder
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-balance text-body-lg sm:text-body-xl leading-relaxed text-muted-foreground">
                            Build an ATS-friendly resume in your browser -
                            free, no account needed.
                        </p>

                        <div className="mt-6 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3">
                            <a
                                href="https://cv.tariqahmad.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open the live CV Builder app (opens in a new tab)"
                                className="group/live relative inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground uppercase font-anton tracking-widest text-body-lg overflow-hidden transition-colors outline-none hover:bg-primary-hover"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute top-[200%] left-0 right-0 h-full bg-foreground/90 group-hover/live:top-0 transition-all duration-500 ease-out"
                                />
                                <span className="z-[1] inline-flex items-center gap-2">
                                    Open the live app
                                    <ExternalLink
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                </span>
                            </a>
                            <TransitionLink
                                href="/product"
                                aria-label="See how CV Builder works"
                                className="group/details relative inline-flex items-center justify-center gap-2 h-12 px-8 border border-primary text-primary uppercase font-anton tracking-widest text-body-lg overflow-hidden transition-colors hover:bg-primary/10"
                            >
                                See how it works
                                <ArrowUpRight
                                    className="w-4 h-4 transition-transform duration-300 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5"
                                    aria-hidden="true"
                                />
                            </TransitionLink>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {SCREENSHOTS.map((shot) => (
                                <figure
                                    key={shot.src}
                                    className="border border-white/10 bg-background/60 overflow-hidden rounded-sm"
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
                                        {shot.caption}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default ProductSpotlight;
