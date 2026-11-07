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

import HudOverlay from '@/components/shared/hud/HudOverlay';

const CommandPalette = dynamic(() => import('./CommandPalette'), {
    ssr: false,
    loading: () => <HudOverlay zIndex={70} />,
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
    open: (origin?: CommandOrigin) => void;
    close: () => void;
    prefetch: () => void;
}

const NOOP = () => {};
const CommandUIContext = createContext<CommandUI>({
    isOpen: false,
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
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;
    // The shortcut listener is registered once, so it cannot read `isOpen`
    // from a closure. The ref is the live value.
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    const open = useCallback((nextOrigin?: CommandOrigin) => {
        setOrigin(nextOrigin ?? readSearchTriggerOrigin() ?? null);
        setIsOpen(true);
    }, []);
    const close = useCallback(() => setIsOpen(false), []);
    const prefetch = useCallback(() => {
        void import('./CommandPalette');
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey)) return;
            if (event.key.toLowerCase() !== 'k') return;
            if (event.shiftKey || event.altKey) return;

            event.preventDefault();

            if (isOpenRef.current) {
                setIsOpen(false);
                return;
            }
            if (document.querySelector('[data-modal-open="true"]')) return;

            open();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open]);

    // A navigation from inside the palette closes it; so does any other
    // route change while it happens to be open.
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

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
        () => ({ isOpen, open, close, prefetch }),
        [isOpen, open, close, prefetch],
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
