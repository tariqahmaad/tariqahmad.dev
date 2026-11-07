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

interface CommandUI {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const NOOP = () => {};
const CommandUIContext = createContext<CommandUI>({
    isOpen: false,
    open: NOOP,
    close: NOOP,
});

export const useCommandConsole = () => useContext(CommandUIContext);

/**
 * Owns the console's open state and the global shortcut.
 *
 * The palette itself is a lazy chunk: it is not part of any route's initial
 * JavaScript, and the static backdrop renders immediately on open so the first
 * keypress never feels like it did nothing. A short idle prefetch warms the
 * chunk for people who never ask for it up front.
 */
export function CommandProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey)) return;
            if (event.key.toLowerCase() !== 'k') return;
            if (event.shiftKey || event.altKey) return;

            event.preventDefault();

            setIsOpen((currentlyOpen) => {
                if (currentlyOpen) return false;
                if (document.querySelector('[data-modal-open="true"]')) {
                    return false;
                }
                return true;
            });
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

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
        () => ({ isOpen, open, close }),
        [isOpen, open, close],
    );

    return (
        <CommandUIContext.Provider value={value}>
            {children}
            {isOpen ? (
                <CommandPalette onClose={close} />
            ) : null}
        </CommandUIContext.Provider>
    );
}
