import { gsap, useGSAP } from '@/lib/gsap-setup';
import { RefObject } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface UseScrollExitAnimationOptions {
    containerRef: RefObject<HTMLElement | null>;
    startTrigger?: string;
    endTrigger?: string;
    yOffset?: number;
    opacity?: number;
}

/**
 * Custom hook for fade-out scroll exit animations
 * Reusable pattern across Skills, Experiences, Certifications, and ProjectList components
 */
export const useScrollExitAnimation = ({
    containerRef,
    startTrigger = 'bottom 50%',
    endTrigger = 'bottom 10%',
    yOffset = -150,
    opacity = 0,
}: UseScrollExitAnimationOptions) => {
    // Subscribed rather than read once inside the effect: `useMediaQuery` is
    // SSR-safe and follows the preference live, so flipping reduced motion on or
    // off mid-session rebuilds (or tears down) the scrubbed fade instead of
    // leaving whichever behaviour happened to be active at mount.
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );

    useGSAP(
        () => {
            // Scrubbed exit fades would hide content for reduced-motion users
            // (and fight the `opacity: 1 !important` CSS fallback), so skip.
            if (prefersReducedMotion) {
                gsap.set(containerRef.current, { y: 0, opacity: 1 });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: startTrigger,
                    end: endTrigger,
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: yOffset,
                opacity: opacity,
            });
        },
        { scope: containerRef, dependencies: [startTrigger, endTrigger, yOffset, opacity, prefersReducedMotion], revertOnUpdate: true },
    );
};
