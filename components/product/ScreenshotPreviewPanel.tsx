'use client';

import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { IProductShot } from './screenshots';

interface Props {
    shot: IProductShot | null;
    caption: string;
    /** 0-based index of the hovered shot, or -1 when none. */
    index: number;
    total: number;
    /** Whether the panel is currently revealed (drives the bracket draw). */
    visible: boolean;
    /** Callback ref from useCursorPreview — attaches the panel node. */
    attach: (node: HTMLDivElement | null) => void;
    /** Callback ref from useCursorPreview — attaches the inner parallax node. */
    attachInner: (node: HTMLDivElement | null) => void;
}

// Floating magnifier for the screenshot grids. Decorative: the figures carry
// the real alt text, so this is hidden from assistive tech rather than
// announcing every image twice.
//
// Portaled to document.body (after a mount guard, so SSR markup matches): the
// homepage card carries GSAP inline transforms, which would otherwise become
// the containing block for a `position: fixed` descendant and misplace the
// panel. `pointer-events-none` so it can never steal the hover from the
// figure underneath it, and `autoAlpha` (JS-driven) rather than plain opacity
// so it is also `visibility: hidden` at rest.
const ScreenshotPreviewPanel = ({
    shot,
    caption,
    index,
    total,
    visible,
    attach,
    attachInner,
}: Props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div
            ref={attach}
            aria-hidden="true"
            className="pointer-events-none invisible fixed left-0 top-0 z-[60] w-[36rem] max-w-[calc(100vw-24px)] opacity-0"
        >
            <div className="relative border border-primary/40 bg-card overflow-hidden rounded-tl-[10px] rounded-br-[10px] shadow-[0_0_40px_-10px_hsl(var(--primary)/0.35)]">
                {/* Corner brackets that draw in with the reveal — the
                    signature motif. CSS-driven off the hover state so they
                    stay in sync with the GSAP reveal. */}
                <span
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute inset-0 z-[2] border-t-2 border-l-2 rounded-tl-[10px] transition-[clip-path,border-color] duration-500 ease-out',
                        visible
                            ? 'border-primary [clip-path:inset(0)]'
                            : 'border-primary/40 [clip-path:inset(0_85%_65%_0)]',
                    )}
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute inset-0 z-[2] border-b-2 border-r-2 rounded-br-[10px] transition-[clip-path,border-color] duration-500 delay-150 ease-out',
                        visible
                            ? 'border-primary [clip-path:inset(0)]'
                            : 'border-primary/40 [clip-path:inset(65%_0_0_85%)]',
                    )}
                />
                {/* Affordance tag: the figures must not match the custom
                    cursor's interactive selectors (or the cursor spotlight
                    would scale up and stack with this panel), so the "click
                    to expand" hint lives here instead. */}
                <div className="absolute left-3 top-3 z-[3] inline-flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-sm border border-primary/30 font-mono text-ui-xs uppercase tracking-wider text-primary">
                    <ZoomIn className="w-3 h-3" aria-hidden="true" />
                    View
                </div>
                <div className="overflow-hidden">
                    {/* Parallax wrapper (stable ref — only the keyed <Image>
                        inside remounts). The image is scaled up so drifting it
                        never exposes an edge. */}
                    <div ref={attachInner} className="will-change-transform">
                        {shot && (
                            // Keyed by src: switching shots while visible
                            // remounts the image and replays the crossfade.
                            <Image
                                key={shot.src}
                                src={shot.src}
                                alt=""
                                width={shot.width}
                                height={shot.height}
                                sizes="576px"
                                className="shot-swap w-full h-auto object-cover scale-[1.08]"
                            />
                        )}
                    </div>
                </div>
                {/* Light sweep replayed on every shot switch (remounts with
                    the keyed image above). */}
                {shot && (
                    <span
                        key={`sheen-${shot.src}`}
                        aria-hidden="true"
                        className="panel-sheen"
                    />
                )}
                <p className="relative z-[1] px-3 py-2 font-mono text-ui-sm text-muted-foreground/80 border-t border-white/5 flex items-center justify-between gap-3">
                    <span
                        key={shot?.src ?? 'empty'}
                        className="caption-rise truncate"
                    >
                        {caption}
                    </span>
                    {index >= 0 && (
                        <span className="shrink-0 text-primary/70">
                            {String(index + 1).padStart(2, '0')} /{' '}
                            {String(total).padStart(2, '0')}
                        </span>
                    )}
                </p>
            </div>
        </div>,
        document.body,
    );
};

export default ScreenshotPreviewPanel;
