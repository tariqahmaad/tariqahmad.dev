'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

/**
 * Exposes the Lenis instance on the window object for use in non-React contexts
 * (e.g., scrollToSection utility function and ScrollToTop component)
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
            // Lenis not available yet - this is expected during initial render
            return;
        }

        if (!isMountedRef.current) return;

        (window as Window & { lenis?: typeof lenis }).lenis = lenis;
    }, [lenis]);

    return null;
}