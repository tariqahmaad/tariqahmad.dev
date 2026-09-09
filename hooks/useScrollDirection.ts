import { useEffect, useState } from 'react';

interface UseScrollDirectionOptions {
    /** Accumulated distance (px) before the direction is allowed to flip. */
    threshold?: number;
    /** Within this distance of the top the page always reads as "up". */
    topOffset?: number;
    /** When false, no listeners are attached and the result stays `false`. */
    enabled?: boolean;
}

/**
 * `true` while the page is being scrolled down, `false` while scrolling up or
 * within `topOffset` of the top of the document.
 *
 * Sub-threshold deltas accumulate instead of being discarded, so momentum
 * jitter and iOS rubber-band bounce can't flip the flag, and the read is
 * rAF-throttled so a scroll listener never costs more than one layout read per
 * frame.
 *
 * The last direction is kept once scrolling stops - the flag only changes on
 * real movement - so a control dimmed by this hook doesn't flash back to full
 * opacity the moment the user pauses.
 */
export const useScrollDirection = ({
    threshold = 12,
    topOffset = 96,
    enabled = true,
}: UseScrollDirectionOptions = {}) => {
    const [isScrollingDown, setIsScrollingDown] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setIsScrollingDown(false);
            return;
        }

        let lastY = window.scrollY;
        let frame = 0;

        const update = () => {
            frame = 0;

            const y = window.scrollY;
            const delta = y - lastY;

            // Too small to be intentional: leave `lastY` alone so the delta
            // keeps accumulating toward the threshold.
            if (Math.abs(delta) < threshold) return;

            lastY = y;

            const next = delta > 0 && y > topOffset;
            setIsScrollingDown((prev) => (prev === next ? prev : next));
        };

        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
        };
    }, [threshold, topOffset, enabled]);

    return isScrollingDown;
};
