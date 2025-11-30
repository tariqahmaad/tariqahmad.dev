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
        { scope: containerRef },
    );
};
