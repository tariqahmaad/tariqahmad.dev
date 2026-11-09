'use client';

import dynamic from 'next/dynamic';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { usePathname } from 'next/navigation';

// No visible fallback while the chunk loads. The old one painted an opaque
// full-screen backdrop at once, which the real palette then reset to
// transparent and faded in again: a flash on exactly the first open. The
// trigger's own lock beat covers a slow chunk instead.
const CommandPalette = dynamic(() => import('./CommandPalette'), {
    ssr: false,
    loading: () => null,
});

/** Viewport rect of the trigger that opened the console. */
export interface CommandOrigin {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CommandUI {
    isOpen: boolean;
    /**
     * Bumps once per open request, before the palette mounts. The trigger
     * plays its lock beat off this, so a keyboard open animates it too.
     */
    launchTick: number;
    open: (origin?: CommandOrigin) => void;
    close: () => void;
    prefetch: () => void;
}

const NOOP = () => {};
const CommandUIContext = createContext<CommandUI>({
    isOpen: false,
    launchTick: 0,
    open: NOOP,
    close: NOOP,
    prefetch: NOOP,
});

export const useCommandConsole = () => useContext(CommandUIContext);

// Read the trigger's viewport rect at call time. Keyboard opens have no click
// event to carry one, so this is what lets them share the button's unfold;
// routes without the marketing navbar simply get no origin and use the
// palette's centered fallback.
const readSearchTriggerOrigin = (): CommandOrigin | undefined => {
    if (typeof document === 'undefined') return undefined;

    const trigger = document.querySelector<HTMLElement>(
        '[data-search-trigger]',
    );
    if (!trigger) return undefined;

    const rect = trigger.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
    };
};

/**
 * Owns the console's open state and the global shortcut.
 *
 * The palette itself is a lazy chunk: it is not part of any route's initial
 * JavaScript, and the static backdrop renders immediately on open so the first
 * keypress never feels like it did nothing. A short idle prefetch warms the
 * chunk for people who never ask for it up front; the navbar trigger warms it
 * on hover/focus too.
 */
export function CommandProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [origin, setOrigin] = useState<CommandOrigin | null>(null);
    const [launchTick, setLaunchTick] = useState(0);
    // Frame handle of an open that is waiting to mount the palette.
    const pendingOpenRef = useRef<number | null>(null);
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;
    // The shortcut listener is registered once, so it cannot read `isOpen`
    // from a closure. The ref is the live value.
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    const cancelPendingOpen = useCallback(() => {
        if (pendingOpenRef.current !== null) {
            cancelAnimationFrame(pendingOpenRef.current);
            pendingOpenRef.current = null;
        }
    }, []);

    const prefetch = useCallback(() => {
        void import('./CommandPalette');
    }, []);

    // Mounting the palette is the heavy part of an open: a large tree, the
    // body scroll lock (a page-wide relayout), the inert walk and a forced
    // layout read. Done inside the click it all landed in the same frame the
    // trigger starts animating, so the first frames of its lock beat stuttered.
    // The trigger gets its state first and paints; the palette mounts two
    // frames later (the chunk is requested right away, so that costs nothing).
    // Reduced motion has no beat to protect and opens straight away.
    const open = useCallback(
        (nextOrigin?: CommandOrigin) => {
            cancelPendingOpen();
            setOrigin(nextOrigin ?? readSearchTriggerOrigin() ?? null);
            prefetch();

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setIsOpen(true);
                return;
            }

            setLaunchTick((tick) => tick + 1);
            pendingOpenRef.current = requestAnimationFrame(() => {
                pendingOpenRef.current = requestAnimationFrame(() => {
                    pendingOpenRef.current = null;
                    setIsOpen(true);
                });
            });
        },
        [cancelPendingOpen, prefetch],
    );

    const close = useCallback(() => {
        cancelPendingOpen();
        setIsOpen(false);
    }, [cancelPendingOpen]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey)) return;
            if (event.key.toLowerCase() !== 'k') return;
            if (event.shiftKey || event.altKey) return;

            event.preventDefault();

            // Open, or an open still waiting to mount: the shortcut toggles.
            if (isOpenRef.current || pendingOpenRef.current !== null) {
                cancelPendingOpen();
                setIsOpen(false);
                return;
            }
            if (document.querySelector('[data-modal-open="true"]')) return;

            open();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, cancelPendingOpen]);

    // A navigation from inside the palette closes it; so does any other
    // route change while it happens to be open.
    useEffect(() => {
        cancelPendingOpen();
        setIsOpen(false);
    }, [pathname, cancelPendingOpen]);

    useEffect(() => cancelPendingOpen, [cancelPendingOpen]);

    // Warm the chunk once the page is idle; failure is harmless.
    useEffect(() => {
        const canPrefetch = 'requestIdleCallback' in window;
        const id = canPrefetch
            ? window.requestIdleCallback(() => void import('./CommandPalette'), {
                  timeout: 4000,
              })
            : window.setTimeout(() => void import('./CommandPalette'), 2500);

        return () => {
            if (canPrefetch) window.cancelIdleCallback(id);
            else window.clearTimeout(id);
        };
    }, []);

    const value = useMemo(
        () => ({ isOpen, launchTick, open, close, prefetch }),
        [isOpen, launchTick, open, close, prefetch],
    );

    return (
        <CommandUIContext.Provider value={value}>
            {children}
            {isOpen ? (
                <CommandPalette origin={origin ?? undefined} onClose={close} />
            ) : null}
        </CommandUIContext.Provider>
    );
}
