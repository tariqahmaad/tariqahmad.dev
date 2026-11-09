import { useEffect, useRef } from 'react';

/**
 * Inert everything outside a modal overlay's own branch.
 *
 * `aria-modal` alone does not stop Tab or a screen reader's virtual cursor from
 * walking into the page behind a dialog, and a fixed selector list cannot keep
 * that promise for widgets added later. This walks from <body>, keeps the
 * overlay roots and all of their ancestors, and marks every other subtree
 * `inert` — recording each element's prior state first so closing the dialog
 * never clears an `inert` that another owner (e.g. a second modal, or the
 * preloader) still needs.
 *
 * `getRoots` is read at effect time, so callers can pass refs that are only
 * populated after mount (portals, lazy-mounted dialogs) without re-running the
 * effect on every render.
 */
export function useInertOutside(
    isActive: boolean,
    getRoots: () => Array<HTMLElement | null | undefined>,
): void {
    const rootsRef = useRef(getRoots);
    rootsRef.current = getRoots;

    useEffect(() => {
        if (!isActive || typeof document === 'undefined') return;

        const overlayRoots = new Set<HTMLElement>();
        for (const element of rootsRef.current()) {
            if (element) overlayRoots.add(element);
        }
        // Nothing mounted yet. This effect does NOT re-run on its own —
        // `isActive` is its only dependency — so a caller whose overlay renders
        // after the first commit must flip `isActive` once the overlay exists
        // (e.g. pass its `mounted` flag), not pass a constant `true`.
        if (overlayRoots.size === 0) return;

        const keepBranches = new Set<HTMLElement>();
        for (const element of overlayRoots) {
            let branch = element.parentElement;
            while (branch && branch !== document.body) {
                keepBranches.add(branch);
                branch = branch.parentElement;
            }
        }

        const previous = new Map<HTMLElement, boolean>();

        const walk = (parent: HTMLElement) => {
            for (const child of Array.from(parent.children)) {
                if (!(child instanceof HTMLElement)) continue;
                if (overlayRoots.has(child)) continue;

                if (keepBranches.has(child)) {
                    walk(child);
                    continue;
                }

                previous.set(child, child.hasAttribute('inert'));
                child.setAttribute('inert', '');
            }
        };

        walk(document.body);

        return () => {
            previous.forEach((wasInert, element) => {
                if (!wasInert) element.removeAttribute('inert');
            });
        };
    }, [isActive]);
}
