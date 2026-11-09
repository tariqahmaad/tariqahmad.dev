'use client';

import { useEffect } from 'react';
import { takePendingSection } from '@/lib/section-handoff';

// Browser Back/Forward keep their own scroll position, so a hash in the URL
// must not yank them elsewhere. `popstate` fires before the page renders, which
// is what lets the mount below tell a traversal from a link click.
let lastPopstateAt = 0;
if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        lastPopstateAt = Date.now();
    });
}

type LenisLike = {
    resize: () => void;
    scrollTo: (
        target: HTMLElement,
        options?: { immediate?: boolean; force?: boolean },
    ) => void;
};

/**
 * Lands on `#section` after a client navigation into the home page.
 *
 * Next scrolls to a hash itself, but only if the element exists at the moment
 * the route commits. The home route sits behind a loading fallback, so when the
 * page was reached from another route (a project's "All projects" link, the
 * console, the 404 page) the section is not there yet, Next finds nothing, and
 * the visitor ends up at the top of a `/#selected-projects` URL. This runs once
 * the real page has mounted, jumps instantly (the page-transition shutter is
 * still closed, so no one sees the jump), and re-asserts once after layout has
 * settled. Lenis is told to re-measure first (see `jump`).
 */
export default function HashScroll() {
    useEffect(() => {
        // In-app links queue their section (the URL stays a bare `/`); a hash
        // typed or shared in the URL is the other source. The queue is always
        // drained, so a skipped run cannot leave a stale section behind.
        const queued = takePendingSection();
        const id = queued ?? decodeURIComponent(window.location.hash.slice(1));
        if (!id) return;
        if (!queued && Date.now() - lastPopstateAt < 1500) return;

        const jump = () => {
            const element = document.getElementById(id);
            if (!element) return;

            const lenis = (window as Window & { lenis?: LenisLike }).lenis;
            if (lenis) {
                // Lenis clamps to the page height it measured last, and it
                // measures on a ResizeObserver tick: right after the route
                // swaps it still holds the loading skeleton's ~900px, which
                // clamped this jump to 439px. Re-measure first.
                lenis.resize();
                lenis.scrollTo(element, { immediate: true, force: true });
            } else {
                element.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
            }
        };

        jump();
        // Pinned sections and images settle just after mount and can shift the
        // target; this lands inside the shutter's closed hold.
        const settle = window.setTimeout(jump, 150);
        return () => window.clearTimeout(settle);
    }, []);

    return null;
}
