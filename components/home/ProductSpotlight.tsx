'use client';

import Image from 'next/image';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import TransitionLink from '@/components/shared/TransitionLink';
import BracketFrame from '@/components/shared/hud/BracketFrame';
import HudButton from '@/components/shared/hud/HudButton';
import ScreenshotPreviewPanel from '@/components/product/ScreenshotPreviewPanel';
import ScreenshotLightbox from '@/components/product/ScreenshotLightbox';
import { PRODUCT_SHOTS } from '@/components/product/screenshots';
import { useCursorPreview } from '@/hooks/useCursorPreview';
import { useStickyIndex } from '@/hooks/useStickyIndex';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { cn, shouldSkipAnimation } from '@/lib/utils';
import { useRef, useState } from 'react';

// Location-specific captions for the shared captures.
const SPOTLIGHT_CAPTIONS = [
    'Start free, no account needed',
    'Template gallery with live preview',
    'Guided editor with live preview',
];

const SHOTS = PRODUCT_SHOTS.map((shot, i) => ({
    ...shot,
    caption: SPOTLIGHT_CAPTIONS[i] ?? '',
}));

const ProductSpotlight = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLElement>(null);

    // Hover preview shares the /product gallery's floating magnifier (same
    // hook + panel). Desktop + no reduced motion only; touch users get the
    // static grid plus the tap-to-expand lightbox below.
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );
    const previewEnabled = isDesktop && !prefersReducedMotion;

    const { attach, attachInner, show, move, hide, cancelHide } =
        useCursorPreview(previewEnabled);
    // Sticky: clearing defers so gap crossings never flash the chrome off
    // and back on; the panel content still swaps instantly on enter.
    const {
        index: activeIndex,
        set: setActiveIndex,
        clearNow: clearActiveIndex,
    } = useStickyIndex(300);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const active = activeIndex === null ? null : SHOTS[activeIndex];

    const handleEnter = (index: number, e: React.MouseEvent) => {
        if (!previewEnabled) return;
        cancelHide();
        setActiveIndex(index);
        show(e);
    };

    const handleMove = (e: React.MouseEvent) => {
        if (!previewEnabled || activeIndex === null) return;
        move(e);
    };

    const handleLeave = () => {
        setActiveIndex(null);
        hide();
    };

    const openLightbox = (index: number) => {
        hide();
        clearActiveIndex();
        setLightboxIndex(index);
    };

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
                    {/* Corner brackets — signature motif shared with
                        Testimonials / Experiences / ProjectCard. */}
                    <BracketFrame className="z-20" />

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
                        </div>

                        <h3 className="font-anton text-heading-md sm:text-heading-lg leading-tight">
                            CV Builder
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-balance text-body-lg sm:text-body-xl leading-relaxed text-muted-foreground">
                            Build an ATS-friendly resume in your browser -
                            free, no account needed.
                        </p>

                        <div className="mt-6 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3">
                            <HudButton
                                href="https://cv.tariqahmad.dev"
                                external
                                variant="solid"
                                size="md"
                                ariaLabel="Open the live CV Builder app (opens in a new tab)"
                                icon={<ExternalLink className="w-4 h-4" />}
                            >
                                Open the live app
                            </HudButton>
                            <TransitionLink
                                href="/product"
                                aria-label="See how CV Builder works"
                                className="group/details relative inline-flex items-center justify-center gap-2 h-12 px-8 border border-primary text-primary uppercase font-anton tracking-widest text-body-lg overflow-hidden rounded-tl-[10px] rounded-br-[10px] transition-colors hover:bg-primary/10"
                            >
                                See how it works
                                <ArrowUpRight
                                    className="w-4 h-4 transition-transform duration-300 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5"
                                    aria-hidden="true"
                                />
                            </TransitionLink>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {SHOTS.map((shot, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <figure
                                        key={shot.src}
                                        onMouseEnter={(e) =>
                                            handleEnter(index, e)
                                        }
                                        onMouseMove={handleMove}
                                        onMouseLeave={handleLeave}
                                        className={cn(
                                            'group group/shot relative border bg-background/60 overflow-hidden rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.35)]',
                                            isActive
                                                ? 'border-primary/50'
                                                : 'border-white/10 hover:border-primary/30',
                                            // Spotlight the hovered shot:
                                            // siblings recede.
                                            activeIndex !== null &&
                                                !isActive &&
                                                'opacity-60 saturate-[.85]',
                                        )}
                                    >
                                        {/* Corner brackets — same signature
                                            motif as the rest of the theme. */}
                                        <BracketFrame
                                            className="z-[1]"
                                            active={isActive}
                                        />
                                        <button
                                            type="button"
                                            data-cursor-rest
                                            onClick={() =>
                                                openLightbox(index)
                                            }
                                            aria-label={`Expand screenshot: ${shot.alt}`}
                                            className="relative z-[1] block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
                                        >
                                            <Image
                                                src={shot.src}
                                                alt={shot.alt}
                                                width={shot.width}
                                                height={shot.height}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1148px) 33vw, 360px"
                                                loading="lazy"
                                                className={cn(
                                                    'w-full h-auto object-cover transition-transform duration-300 ease-out',
                                                    isActive && 'scale-[1.02]',
                                                )}
                                            />
                                        </button>
                                        <figcaption className="relative z-[1] px-3 py-2 font-mono text-ui-sm text-muted-foreground/80 border-t border-white/5">
                                            {shot.caption}
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </div>
                    </div>
                </article>

                <ScreenshotPreviewPanel
                    shot={active}
                    caption={active?.caption ?? ''}
                    index={activeIndex ?? -1}
                    total={SHOTS.length}
                    visible={activeIndex !== null}
                    attach={attach}
                    attachInner={attachInner}
                />

                {lightboxIndex !== null && (
                    <ScreenshotLightbox
                        shots={SHOTS}
                        index={lightboxIndex}
                        onIndexChange={setLightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />
                )}
            </div>
        </section>
    );
};

export default ProductSpotlight;
