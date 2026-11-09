import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { PAGE_TRANSITION } from '@/lib/page-transition';

/**
 * The one content entrance every page uses after the shutter opens: the marked
 * elements rise and fade in, one after another. Project pages and `/product`
 * both call this, so "See how it works" enters exactly like opening a case
 * file does. Timing comes from `PAGE_TRANSITION`.
 *
 * The elements are visible in the server markup (the closed shutter covers
 * them), so reduced motion and a JS failure both end up on the final state.
 */
export function usePageEnter(
    scope: RefObject<HTMLElement | null>,
    selector: string,
): void {
    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const targets = gsap.utils.toArray<HTMLElement>(selector, root);
            if (!targets.length) return;

            if (
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                gsap.set(targets, { autoAlpha: 1, y: 0 });
                return;
            }

            gsap.set(targets, { autoAlpha: 0, y: 30 });
            gsap.to(targets, {
                autoAlpha: 1,
                y: 0,
                duration: PAGE_TRANSITION.contentDuration,
                ease: 'power3.out',
                stagger: PAGE_TRANSITION.contentStagger,
                delay: PAGE_TRANSITION.enterDelay,
            });
        },
        { scope },
    );
}
