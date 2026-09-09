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

        const clearLockStyles = () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
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

            // Resume Lenis *before* restoring the scroll position. While it is
            // stopped, lenis.css applies `overflow: clip` to <html> via the
            // `.lenis-stopped` class, and `clip` forbids scrolling entirely -
            // including programmatic scrolls. Restoring first was therefore a
            // silent no-op and the page snapped back to the top whenever the
            // menu was closed from a scrolled position.
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

                const scrollbarWidth =
                    window.innerWidth - document.documentElement.clientWidth;

                // Freeze Lenis so it doesn't keep reading the (soon-to-be
                // fixed) scroll as 0 and drift its internal target out of sync.
                win.lenis?.stop();

                // Apply scroll lock styles
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                document.body.style.paddingRight = `${scrollbarWidth}px`;

                // Mobile scroll lock - the fixed body keeps the page put. Touch
                // gestures are contained by the menu overlay in Navbar instead
                // of writing touch-action on the body, which would disable
                // pinch-zoom for the whole document (WCAG 1.4.4).
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.left = '0';
                document.body.style.top = `-${savedScrollY}px`;
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
