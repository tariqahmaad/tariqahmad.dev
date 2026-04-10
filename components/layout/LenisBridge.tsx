'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
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
