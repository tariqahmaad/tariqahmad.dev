'use client';

import { GENERAL_INFO } from '@/lib/data';
import { isProjectDetailPage } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const ORIGINAL_ITEM_COUNT = 3;
const RENDERED_SET_COUNT = 3;
const TOTAL_RENDERED_ITEMS = ORIGINAL_ITEM_COUNT * RENDERED_SET_COUNT;

const StickyEmail = () => {
    const pathname = usePathname();
    const marqueeRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const timeScaleTweenRef = useRef<gsap.core.Tween | null>(null);
    // Survives marquee rebuilds so a resize mid-hover doesn't resume playback.
    const targetTimeScaleRef = useRef(1);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (!marqueeRef.current || prefersReducedMotion) return;

        const marquee = marqueeRef.current;
        let animation: gsap.core.Tween | null = null;

        // Re-measure on resize/font-swap: the loop distance was previously
        // measured once, so a later layout change desynced the marquee and left
        // a visible gap at the wrap point.
        const build = () => {
            const firstItem = marquee.children[0] as HTMLElement | undefined;
            const secondSetFirstItem = marquee.children[
                ORIGINAL_ITEM_COUNT
            ] as HTMLElement | undefined;

            if (!firstItem || !secondSetFirstItem) return;

            const firstRect = firstItem.getBoundingClientRect();
            const secondRect = secondSetFirstItem.getBoundingClientRect();
            const totalDistance = secondRect.top - firstRect.top;

            if (totalDistance <= 0) return;

            animation?.kill();
            gsap.set(marquee, { y: 0 });
            animation = gsap.fromTo(
                marquee,
                { y: 0 },
                {
                    y: -totalDistance,
                    duration: 20,
                    ease: 'none',
                    repeat: -1,
                }
            );
            animationRef.current = animation;
            // Keep the hover state across a rebuild.
            animation.timeScale(targetTimeScaleRef.current);
        };

        build();

        window.addEventListener('resize', build);
        document.fonts?.ready.then(build).catch(() => {});

        return () => {
            window.removeEventListener('resize', build);
            animation?.kill();
            animationRef.current = null;
            gsap.set(marquee, { y: 0 });
        };
    }, [prefersReducedMotion, pathname]);

    // Hover eases the marquee to a stop instead of slamming it to a halt, and
    // eases back up on leave. The playhead is never reset, so the text cannot
    // jump position. `timeScale` is a *method* on a GSAP tween (not a
    // property), so the value is driven through a plain object and applied in
    // onUpdate - tweening `timeScale` directly would replace the method.
    useEffect(() => {
        const target = isHovered ? 0 : 1;
        targetTimeScaleRef.current = target;

        const animation = animationRef.current;
        if (!animation) return;

        const state = { value: animation.timeScale() };

        timeScaleTweenRef.current?.kill();
        timeScaleTweenRef.current = gsap.to(state, {
            value: target,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true,
            onUpdate: () => {
                animation.timeScale(state.value);
            },
        });

        return () => {
            timeScaleTweenRef.current?.kill();
            timeScaleTweenRef.current = null;
        };
    }, [isHovered]);

    if (isProjectDetailPage(pathname)) return null;

    return (
        <div
            data-menu-inert
            className="max-xl:hidden fixed top-0 bottom-0 left-0 overflow-hidden
                       before:pointer-events-none after:pointer-events-none
                       before:absolute before:inset-x-0 before:top-0 before:h-32 before:z-10
                       before:bg-gradient-to-b before:from-background before:to-transparent
                       after:absolute after:inset-x-0 after:bottom-0 after:h-32 after:z-10
                       after:bg-gradient-to-t after:from-background after:to-transparent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* `will-change-transform` pins the strip to one composited layer so
                the continuously animated text is rasterised once and translated,
                instead of being re-rasterised on every frame/hover repaint. */}
            <div
                ref={marqueeRef}
                className="flex flex-col will-change-transform"
                style={{ gap: '120px' }}
            >
                {Array.from({ length: TOTAL_RENDERED_ITEMS }).map((_, index) => {
                    const isDuplicateSet = index >= ORIGINAL_ITEM_COUNT;

                    return (
                        <a
                            key={index}
                            href={`mailto:${GENERAL_INFO.email}`}
                            aria-hidden={isDuplicateSet ? 'true' : undefined}
                            tabIndex={isDuplicateSet ? -1 : undefined}
                            // `transition-colors`, never `transition-all`: with
                            // `all` the browser promotes this anchor to its own
                            // layer when the hover transition starts, which
                            // re-rasterises the rotated glyphs at a different
                            // subpixel offset - the text visibly shifts. Only the
                            // colour changes here, so only the colour transitions.
                            className="px-3 text-muted-foreground tracking-[1px] transition-colors hover:text-primary"
                            style={{
                                textOrientation: 'mixed',
                                writingMode: 'vertical-rl',
                            }}
                        >
                            {GENERAL_INFO.email}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default StickyEmail;
