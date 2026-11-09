import { useEffect, useRef } from 'react';

// Module-level lock registry: several consumers (the menu plus any future
// modal) can hold the lock at once, but only the first one applies the body
// styles and only the last one releases them.
let lockCount = 0;
let savedScrollY = 0;
// Tracks whether a scroll position was captured to restore, decoupled from the
// value itself (a saved scrollY of 0 is valid and shouldn't be skipped).
let hasSavedScrollY = false;

/**
 * Hook to lock/unlock body scroll when menu is open
 * Prevents background scrolling while preserving scroll position
 */
export const useScrollLock = (isLocked: boolean) => {
    // Tracks whether this consumer currently holds the lock, so the cleanup can
    // release it if the consumer unmounts while still locked.
    const lockHeldRef = useRef(false);

    useEffect(() => {
        const win = window as Window & {
            lenis?: {
                stop: () => void;
                start: () => void;
                scrollTo: (
                    target: number,
                    options?: { immediate?: boolean; force?: boolean },
                ) => void;
            };
        };

        // Deliberately NO `overflow` writes on <html>/<body>. Changing the
        // root's overflow re-lays out the whole page (measured ~30ms real,
        // ~115ms at 4x CPU, per change) and was paid up to three times per open
        // (here, twice, plus Lenis's own `overflow: clip` class). The fixed
        // body below already freezes the page, so it was pure cost; moving the
        // body to `position: fixed` costs ~1ms. The matching Lenis override
        // lives in globals.css.
        const clearLockStyles = () => {
            document.body.style.paddingRight = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.left = '';
            document.body.style.top = '';
        };

        const releaseLock = () => {
            if (!lockHeldRef.current) return;

            lockHeldRef.current = false;
            lockCount = Math.max(0, lockCount - 1);

            // Another consumer still holds the lock - leave the styles and the
            // saved scroll position untouched for it.
            if (lockCount > 0) return;

            // Reset all styles
            clearLockStyles();

            // Resume Lenis *before* restoring the scroll position. Lenis's own
            // stylesheet would clip <html> while it is stopped (we neutralise
            // that in globals.css), and a stopped Lenis would also swallow the
            // restore, so keep this order: the page used to snap back to the
            // top whenever the menu was closed from a scrolled position.
            try {
                win.lenis?.start();
            } catch (err) {
                console.error('[useScrollLock] Lenis resume failed:', err);
            }

            // Restore scroll position. <html> is scrollable again only after
            // the resume above.
            if (hasSavedScrollY) {
                const target = savedScrollY;
                hasSavedScrollY = false;

                window.scrollTo(0, target);

                // Re-sync Lenis to the real position. `window.scrollY` is read
                // after the restore so a clamped restore still leaves Lenis and
                // the browser agreeing. Without this the first tap after closing
                // the menu does nothing and only a second tap works.
                try {
                    win.lenis?.scrollTo(window.scrollY, {
                        immediate: true,
                        force: true,
                    });
                } catch (err) {
                    console.error('[useScrollLock] Lenis resync failed:', err);
                }
            }
        };

        if (isLocked) {
            lockHeldRef.current = true;
            lockCount += 1;

            // Only the first holder freezes the page; later holders just keep
            // the lock alive.
            if (lockCount === 1) {
                // Store scroll position before locking
                savedScrollY = window.scrollY;
                hasSavedScrollY = true;

                // No scrollbar-width compensation: the site hides its scrollbar
                // (globals.css), so there is no gutter to preserve, and the
                // `clientWidth` read it needed forced a full style flush in
                // the middle of the open.
                //
                // Apply every style write first and stop Lenis LAST. Lenis's
                // stop emits a scroll event that ScrollTrigger answers by
                // reading layout, which flushes pending styles on the spot.
                // Stopping first meant that flush ran before the lock styles
                // existed, and they then cost a second one.

                // The fixed body keeps the page put. Touch gestures are
                // contained by the menu overlay in Navbar instead of writing
                // touch-action on the body, which would disable pinch-zoom for
                // the whole document (WCAG 1.4.4).
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.left = '0';
                document.body.style.top = `-${savedScrollY}px`;

                // Freeze Lenis so it doesn't keep reading the fixed body's
                // scroll as 0 and drift its internal target out of sync.
                win.lenis?.stop();
            }
        } else {
            releaseLock();
        }

        // Teardown: if this consumer unmounts (or isLocked flips) while still
        // holding the lock, release it - otherwise smooth-scroll stays dead and
        // the fixed body dumps the viewport back to scrollY 0.
        return releaseLock;
    }, [isLocked]);
};
