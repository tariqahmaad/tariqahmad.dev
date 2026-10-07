import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hover index with hysteresis for the screenshot grids.
 *
 * Setting a new index applies instantly (panel content swaps without delay),
 * but clearing to null is deferred by `delay` ms: crossing the gap between
 * two thumbnails fires leave then enter on adjacent frames, and without the
 * defer every piece of hover chrome (panel brackets, sibling dimming, the
 * fading panel image) would flash off and back on. A re-enter inside the
 * window cancels the pending clear. `clearNow` skips the wait (used when the
 * lightbox takes over).
 */
export const useStickyIndex = (delay = 300) => {
    const [index, setIndex] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);

    const set = useCallback(
        (next: number | null) => {
            if (next !== null) {
                if (timerRef.current !== null) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
                setIndex(next);
                return;
            }
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = window.setTimeout(() => {
                timerRef.current = null;
                setIndex(null);
            }, delay);
        },
        [delay],
    );

    const clearNow = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIndex(null);
    }, []);

    useEffect(
        () => () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        },
        [],
    );

    return { index, set, clearNow };
};
