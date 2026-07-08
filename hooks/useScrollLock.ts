import { useEffect, useRef } from 'react';

/**
 * Hook to lock/unlock body scroll when menu is open
 * Prevents background scrolling while preserving scroll position
 */
export const useScrollLock = (isLocked: boolean) => {
    const scrollYRef = useRef(0);
    // Tracks whether we captured a scroll position to restore, decoupled from
    // the value itself (a saved scrollY of 0 is valid and shouldn't be skipped).
    const hasSavedRef = useRef(false);
    // Tracks whether the lock (CSS + Lenis stop) is currently applied, so the
    // cleanup can release it if the consumer unmounts while still locked.
    const lockAppliedRef = useRef(false);

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
            document.body.style.touchAction = '';
        };

        if (isLocked) {
            // Store scroll position before locking
            scrollYRef.current = window.scrollY;
            hasSavedRef.current = true;

            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth;

            // Freeze Lenis so it doesn't keep reading the (soon-to-be fixed)
            // scroll as 0 and drift its internal target out of sync.
            win.lenis?.stop();

            // Apply scroll lock styles
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            // Mobile scroll lock - use touch-action for better mobile support
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.left = '0';
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.touchAction = 'none';

            lockAppliedRef.current = true;
        } else {
            // Reset all styles
            clearLockStyles();

            // Restore scroll position
            if (hasSavedRef.current) {
                window.scrollTo(0, scrollYRef.current);
                hasSavedRef.current = false;
            }

            // Re-sync Lenis to the real scroll position before resuming so a
            // programmatic scrollTo (e.g. a nav link) isn't clobbered by a
            // stale target. Without this, the first tap after closing the menu
            // does nothing and only a second tap works. Wrapped in try/catch
            // (mirroring scrollToSection) so a failing instance never strands
            // the page with smooth-scroll permanently stopped.
            try {
                win.lenis?.start();
                win.lenis?.scrollTo(window.scrollY, {
                    immediate: true,
                    force: true,
                });
            } catch (err) {
                console.error('[useScrollLock] Lenis resync failed:', err);
            }

            lockAppliedRef.current = false;
        }

        return () => {
            clearLockStyles();

            // If tearing down while the lock was still applied (e.g. unmount
            // mid-menu), release Lenis and restore the saved position —
            // otherwise smooth-scroll stays dead and the fixed body dumps the
            // viewport back to scrollY 0.
            if (lockAppliedRef.current) {
                if (hasSavedRef.current) {
                    window.scrollTo(0, scrollYRef.current);
                    hasSavedRef.current = false;
                }
                try {
                    win.lenis?.start();
                } catch (err) {
                    console.error(
                        '[useScrollLock] Lenis restart on teardown failed:',
                        err,
                    );
                }
                lockAppliedRef.current = false;
            }
        };
    }, [isLocked]);
};
