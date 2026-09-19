'use client';

import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUp, ChevronsUp } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SCROLL_THRESHOLD = 400;
const SCROLL_TOLERANCE = 5;
const PROGRESS_RING_RADIUS = 18;
const PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS;

const ScrollToTop = () => {
    const containerRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const progressRingRef = useRef<SVGCircleElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [clickSuccess, setClickSuccess] = useState(false);

    const lastScrollYRef = useRef(0);
    // Cached `scrollHeight - clientHeight`: reading it per frame forced a
    // style/layout invalidation for the whole document on every scroll frame.
    const scrollableHeightRef = useRef(0);
    const frameRef = useRef<number | null>(null);
    const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Subscribed, not read once during render: `useMediaQuery` returns false
    // through SSR and the first client render (so the markup matches) and then
    // follows the preference live. A one-time render read both missed a later
    // change and left the GSAP effect skipping its show/hide branch forever,
    // stranding the button at the `opacity: 0; translate(0, 100px)` a previous
    // animated run had written.
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );

    // Logical visibility lives in CSS (Tailwind utilities, so it is already in the
    // server-rendered stylesheet) instead of being owned by GSAP. The visibility
    // flip is only delayed so the 0.3s exit tween can play out; reduced motion
    // drops the delay. Kept as one static string so SSR and client markup match.
    const hiddenClasses = 'invisible pointer-events-none transition-[visibility] delay-300 motion-reduce:delay-0';

    const updateVisibility = useCallback(() => {
        frameRef.current = null;

        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;

        // Refresh the anchor unconditionally: the tolerance early-return used to
        // skip this, so small deltas accumulated against a stale position.
        lastScrollYRef.current = currentScrollY;

        if (progressRingRef.current) {
            const scrollableHeight = scrollableHeightRef.current;
            // Guard the divide: a non-scrollable page would otherwise yield NaN.
            const progress = scrollableHeight > 0
                ? Math.min(currentScrollY / scrollableHeight, 1)
                : 0;
            const offset = PROGRESS_RING_CIRCUMFERENCE - progress * PROGRESS_RING_CIRCUMFERENCE;
            progressRingRef.current.style.strokeDashoffset = String(offset);
        }

        if (Math.abs(scrollDelta) < SCROLL_TOLERANCE) return;

        const isScrollingDown = scrollDelta > 0;
        const pastThreshold = currentScrollY > SCROLL_THRESHOLD;
        const nextVisible = pastThreshold && !isScrollingDown;

        // The button hides itself with `visibility: hidden` + `aria-hidden`, so
        // focus must not still be on it when that commit lands: browsers flag
        // aria-hidden on a focused element and then dump focus to <body> anyway.
        // Blurring here - before the state flip, not in an effect after the
        // commit - closes even the one frame where focus would sit on a hidden
        // element. Focus lands on the document body, which is where the reader
        // is after the page was scrolled back to the top.
        if (!nextVisible) {
            const active = document.activeElement;
            if (
                active instanceof HTMLElement &&
                containerRef.current?.contains(active)
            ) {
                active.blur();
            }
        }

        setIsVisible(nextVisible);
    }, []);

    // Keep the cached scrollable height in step with the document. A
    // ResizeObserver is the only signal that fires for content-driven growth
    // (reveal animations, images, fonts) as well as viewport resizes, which the
    // `resize` event alone does not cover.
    useEffect(() => {
        const measureScrollableHeight = () => {
            const { scrollHeight, clientHeight } = document.documentElement;
            scrollableHeightRef.current = scrollHeight - clientHeight;
        };

        measureScrollableHeight();

        // Both are observed: the root box covers content growth, body covers the
        // margin/overflow cases the root box does not reflect.
        const resizeObserver = new ResizeObserver(measureScrollableHeight);
        resizeObserver.observe(document.documentElement);
        resizeObserver.observe(document.body);

        return () => resizeObserver.disconnect();
    }, []);

    // Coalesce scroll events into a single layout read + style write per frame.
    const handleScroll = useCallback(() => {
        if (frameRef.current !== null) return;
        frameRef.current = requestAnimationFrame(updateVisibility);
    }, [updateVisibility]);

    useEffect(() => {
        lastScrollYRef.current = window.scrollY;
        updateVisibility();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, [handleScroll, updateVisibility]);

    // The success flash reverts on a timer; clear it so it can't fire post-unmount.
    useEffect(
        () => () => {
            if (clickTimeoutRef.current !== null) clearTimeout(clickTimeoutRef.current);
        },
        [],
    );

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // Reduced motion: CSS owns the visuals here, so drop whatever inline
            // opacity/transform a previous animated run wrote. Without this the
            // button stays at `opacity: 0; translate(0, 100px)` - it never
            // animates back in and the preference change hides it permanently.
            if (prefersReducedMotion) {
                [
                    containerRef.current,
                    glowRef.current,
                    iconRef.current,
                ].forEach((node) => {
                    if (node) {
                        gsap.set(node, { clearProps: 'opacity,transform' });
                    }
                });
                return;
            }

            // Visibility is owned by `hiddenClasses` above, so GSAP only animates
            // the transition. That keeps the button visible for reduced-motion
            // users instead of leaving it invisible yet still focusable. Neither
            // branch unmounts the button, so the exit tween can actually play.
            if (isVisible) {
                gsap.fromTo(
                    containerRef.current,
                    { y: 100, opacity: 0, scale: 0.8 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                    }
                );

                gsap.fromTo(
                    glowRef.current,
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1.5,
                        opacity: 0.6,
                        duration: 0.6,
                        ease: 'power2.out',
                    }
                );
            } else {
                // The start values are stated explicitly because
                // `revertOnUpdate` has already restored the node to the values
                // the entrance tween began from: a plain `to()` would tween
                // towards where the node already sits and the slide-out would
                // not be seen at all.
                gsap.fromTo(
                    containerRef.current,
                    { y: 0, opacity: 1, scale: 1 },
                    {
                        y: 100,
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.in',
                    }
                );
            }
        },
        {
            // Without this, cleanup only ran on unmount: every visibility flip
            // stacked another tween on the same y/opacity/scale with no
            // `overwrite`, so a quick flip snapped the button back to
            // `{ y: 100, opacity: 0 }` mid-flight.
            dependencies: [isVisible, prefersReducedMotion],
            revertOnUpdate: true,
        },
    );

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (prefersReducedMotion) return;

        gsap.to(containerRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
        gsap.to(iconRef.current, {
            y: -2,
            duration: 0.2,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (prefersReducedMotion) return;

        gsap.to(containerRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        gsap.to(iconRef.current, {
            y: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
    };

    const scrollToTop = () => {
        if (clickSuccess) return;

        if (!prefersReducedMotion) {
            gsap.to(containerRef.current, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
            });

            gsap.to(glowRef.current, {
                scale: 2,
                opacity: 1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
            });
        }

        setClickSuccess(true);
        if (clickTimeoutRef.current !== null) clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
            clickTimeoutRef.current = null;
            setClickSuccess(false);
        }, 600);

        const lenis = (window as Window & { lenis?: { scrollTo: (target: string | number) => void } }).lenis;
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderIcon = () => {
        if (clickSuccess) {
            return (
                <ChevronsUp
                    className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] animate-bounce"
                    strokeWidth={2.5}
                />
            );
        }
        if (isHovered) {
            return (
                <ChevronsUp
                    className="w-5 h-5 text-primary drop-shadow-[0_0_6px_rgba(0,255,0,0.6)]"
                    strokeWidth={2.5}
                />
            );
        }
        return (
            <ArrowUp
                className="w-5 h-5 text-primary/90 group-hover:text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.4)] transition-all duration-300"
                strokeWidth={2.5}
            />
        );
    };

    return (
        <button
            ref={containerRef}
            onClick={scrollToTop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed bottom-8 right-[2%] z-50 group ${isVisible ? '' : hiddenClasses}`}
            aria-label="Scroll to top"
            aria-hidden={!isVisible}
            data-visible={isVisible ? 'true' : 'false'}
            tabIndex={isVisible ? 0 : -1}
            data-cursor-hide
        >
            <div
                ref={glowRef}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:bg-primary/40 transition-colors duration-300"
            />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background-light/90 border border-primary/30 backdrop-blur-md transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/5 shadow-[0_0_20px_rgba(0,255,0,0.1)] group-hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] overflow-hidden">

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                <div
                    aria-hidden="true"
                    className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out"
                />

                <svg
                    aria-hidden="true"
                    className="absolute top-0 right-0 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M5 2 H14 M14 2 V11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.5)]"
                    />
                </svg>
                <svg
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M11 14 H2 M2 14 V5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.5)]"
                    />
                </svg>

                <svg
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 44 44"
                >
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="hsl(var(--primary) / 0.15)"
                        strokeWidth="1.5"
                    />
                    <circle
                        ref={progressRingRef}
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="hsl(var(--primary) / 0.6)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={PROGRESS_RING_CIRCUMFERENCE}
                        strokeDashoffset={PROGRESS_RING_CIRCUMFERENCE}
                        className="drop-shadow-[0_0_4px_rgba(0,255,0,0.5)] transition-all duration-100"
                    />
                </svg>

                <div ref={iconRef} aria-hidden="true" className="relative z-10">
                    {renderIcon()}
                </div>

                <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,255,0,0.05)]"
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"
                />
            </div>

            <style jsx>{`
                /* A modal overlay inerts the page while it is open - the site
                   menu sets inert on everything outside itself. This button
                   sits at z-50, i.e. above that overlay, so without this rule it
                   would keep looking clickable while being unreachable.
                   (No backticks in this block: it is a template literal.) */
                button[inert] {
                    visibility: hidden;
                }

                @keyframes breathe {
                    0%, 100% { opacity: 0.2; transform: scale(1.5); }
                    50% { opacity: 0.4; transform: scale(1.7); }
                }

                button:not(:hover) > div:first-child {
                    animation: breathe 3s ease-in-out infinite;
                }
            `}</style>
        </button>
    );
};

export default ScrollToTop;
