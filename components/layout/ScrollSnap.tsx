'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
// The package ships a typed public entry point (`lenis/snap`) — prefer it over
// the private `lenis/dist/lenis-snap.mjs` deep import.
import Snap from 'lenis/snap';

// Smooth easing curve
const easeOutExpoSmooth = (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -12 * t);

export default function ScrollSnap() {
    const lenis = useLenis();
    const pathname = usePathname();
    const snapRef = useRef<Snap | null>(null);

    // `pathname` is a dependency on purpose: the snap points are DOM nodes, so
    // after a client-side navigation the previous section elements are detached
    // and Snap recomputes every point to the current scroll offset, which makes
    // the page rubber-band. Re-registering per route keeps the list valid.
    useEffect(() => {
        if (!lenis) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        // Lazy snap configuration - only snaps when very close to a section
        const snap = new Snap(lenis, {
            type: 'proximity',
            lerp: 0.05,
            duration: 1.5,
            easing: easeOutExpoSmooth,
            distanceThreshold: '10%', // Only snap when within 10% of viewport
            debounce: 200, // Wait longer before deciding to snap
        });
        snapRef.current = snap;

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => {
            snap.addElement(section as HTMLElement, {
                align: 'start',
            });
        });

        return () => {
            snap.destroy();
            snapRef.current = null;
        };
    }, [lenis, pathname]);

    return null;
}
