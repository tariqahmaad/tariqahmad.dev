'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { ICaptionedShot } from './screenshots';

interface Props {
    shots: ICaptionedShot[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

// Accessible click-to-expand lightbox for the screenshot grids — the touch
// and keyboard story, since hover previews don't exist there. Portaled to
// document.body so no transformed ancestor (GSAP cards, backdrop blur) can
// clip it or become its containing block.
const ScreenshotLightbox = ({
    shots,
    index,
    onIndexChange,
    onClose,
}: Props) => {
    const [mounted, setMounted] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const openerRef = useRef<Element | null>(null);

    const shot = shots[index];
    const total = shots.length;

    // Mounted only while open, so the lock applies exactly for the open
    // lifetime (the hook is ref-counted, so nesting with the menu is safe).
    useScrollLock(true);

    const goPrev = useCallback(() => {
        onIndexChange((index - 1 + total) % total);
    }, [index, total, onIndexChange]);

    const goNext = useCallback(() => {
        onIndexChange((index + 1) % total);
    }, [index, total, onIndexChange]);

    useEffect(() => {
        setMounted(true);
        // Return focus to the invoking thumbnail on close.
        openerRef.current = document.activeElement;
        const raf = requestAnimationFrame(() => dialogRef.current?.focus());
        return () => {
            cancelAnimationFrame(raf);
            const opener = openerRef.current;
            if (opener instanceof HTMLElement) {
                opener.focus({ preventScroll: true });
            }
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goPrev();
            } else if (e.key === 'Tab') {
                // Minimal focus trap: cycle within the dialog.
                const dialog = dialogRef.current;
                if (!dialog) return;
                const focusables = Array.from(
                    dialog.querySelectorAll<HTMLElement>(
                        'button, [href], [tabindex]:not([tabindex="-1"])',
                    ),
                ).filter((el) => !el.hasAttribute('disabled'));
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (
                    e.shiftKey &&
                    document.activeElement === first
                ) {
                    e.preventDefault();
                    last.focus();
                } else if (
                    !e.shiftKey &&
                    document.activeElement === last
                ) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose, goNext, goPrev]);

    if (!mounted || typeof document === 'undefined' || !shot) return null;

    const controlClass =
        'inline-flex items-center justify-center border border-primary/40 bg-background-light/70 text-primary/80 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_18px_hsl(var(--primary)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-tl-[10px] rounded-br-[10px]';

    return createPortal(
        <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Screenshot ${index + 1} of ${total}: ${shot.alt}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8 focus-visible:outline-none"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-background/85 backdrop-blur-sm"
            />
            <div className="lightbox-in group relative w-full max-w-6xl border border-primary/40 bg-card overflow-hidden rounded-tl-[10px] rounded-br-[10px] shadow-[0_0_60px_-10px_hsl(var(--primary)/0.4)]">
                {/* Corner brackets, fully drawn — the signature motif. */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] border-t-2 border-l-2 border-primary rounded-tl-[10px] [clip-path:inset(0)]"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] border-b-2 border-r-2 border-primary rounded-br-[10px] [clip-path:inset(0)]"
                />
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close preview"
                    autoFocus
                    className={`${controlClass} absolute right-3 top-3 z-[2] h-10 w-10`}
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(max-width: 1280px) 100vw, 1152px"
                    className="shot-swap-plain w-full h-auto max-h-[75vh] object-contain bg-background/60"
                />
                <div className="relative z-[1] px-4 py-3 border-t border-white/5 flex items-center gap-3">
                    <p className="flex-1 min-w-0 truncate font-mono text-ui-sm text-muted-foreground/80">
                        {shot.caption}
                    </p>
                    <span
                        className="shrink-0 font-mono text-ui-sm text-primary/70"
                        aria-hidden="true"
                    >
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(total).padStart(2, '0')}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous screenshot"
                            className={`${controlClass} h-10 w-10`}
                        >
                            <ChevronLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next screenshot"
                            className={`${controlClass} h-10 w-10`}
                        >
                            <ChevronRight
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ScreenshotLightbox;
