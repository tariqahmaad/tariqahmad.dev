import { gsap, useGSAP } from '@/lib/gsap-setup';
import { RefObject } from 'react';

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
    useGSAP(
        () => {
            // Scrubbed exit fades would hide content for reduced-motion users
            // (and fight the `opacity: 1 !important` CSS fallback), so skip.
            if (
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
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
        { scope: containerRef, dependencies: [startTrigger, endTrigger, yOffset, opacity], revertOnUpdate: true },
    );
};
