'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ScrollTrigger } from '@/lib/gsap-setup';

/**
 * Exposes the Lenis instance on the window object for use in non-React contexts
 * (e.g., scrollToSection utility function and ScrollToTop component)
 *
 * Also connects Lenis to GSAP ScrollTrigger so scroll-triggered animations
 * stay in sync during programmatic scrolls (e.g. scrollToTop).
 */
export default function LenisBridge() {
    const lenis = useLenis();
    const isMountedRef = useRef(true);
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );

    // Lenis replaces native wheel scrolling with an eased glide, and none of
    // the CSS reduced-motion rules reach it. `ReactLenis` is configured from a
    // server component (app/layout.tsx), so the preference is applied here, live,
    // by switching smoothing off: the wheel then scrolls natively again.
    useEffect(() => {
        if (!lenis) return;

        lenis.options.smoothWheel = !prefersReducedMotion;
    }, [lenis, prefersReducedMotion]);

    // Stop Lenis from rewriting <html>'s class list. It does so on stop/start
    // and on every scroll-state change (`lenis-stopped`, `lenis-scrolling`,
    // `lenis-smooth`), and any restyle of <html> re-resolves the whole page:
    // measured ~115ms at 4x CPU per write, versus ~2ms for the same change on
    // <body>. That is what made the menu and console stutter on first click,
    // because stopping Lenis for the scroll lock is one such write. Nothing in
    // this project reads those classes (the base `lenis` class is set in
    // Lenis's constructor, before this runs); the instance methods and the
    // `isStopped`/`isScrolling` state are untouched.
    useEffect(() => {
        if (!lenis) return;

        const instance = lenis as unknown as { updateClassName?: () => void };
        instance.updateClassName = () => {};

        return () => {
            delete instance.updateClassName;
        };
    }, [lenis]);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            // Clear the window reference on unmount to prevent stale references
            if (typeof window !== 'undefined') {
                (window as Window & { lenis?: typeof lenis }).lenis = undefined;
            }
        };
    }, []);

    useEffect(() => {
        if (!lenis) {
            // Lenis not available yet — clear any stale window reference
            if (typeof window !== 'undefined') {
                (window as Window & { lenis?: typeof lenis }).lenis = undefined;
            }
            return;
        }

        if (!isMountedRef.current) return;

        (window as Window & { lenis?: typeof lenis }).lenis = lenis;

        // Connect Lenis scroll events to ScrollTrigger so GSAP animations
        // update correctly during Lenis-driven smooth scrolling
        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            lenis.off('scroll', ScrollTrigger.update);
        };
    }, [lenis]);

    return null;
}
