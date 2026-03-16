'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import Snap from 'lenis/dist/lenis-snap.mjs';

// Smooth easing curve
const easeOutExpoSmooth = (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -12 * t);

export default function ScrollSnap() {
    const lenis = useLenis();
    const snapRef = useRef<Snap | null>(null);

    useEffect(() => {
        if (!lenis) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        // Lazy snap configuration - only snaps when very close to a section
        snapRef.current = new Snap(lenis, {
            type: 'proximity',
            lerp: 0.05,
            duration: 1.5,
            easing: easeOutExpoSmooth,
            distanceThreshold: '10%', // Only snap when within 10% of viewport
            debounce: 200, // Wait longer before deciding to snap
        });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => {
            snapRef.current?.addElement(section as HTMLElement, {
                align: 'start',
            });
        });

        return () => {
            snapRef.current?.destroy();
        };
    }, [lenis]);

    return null;
}