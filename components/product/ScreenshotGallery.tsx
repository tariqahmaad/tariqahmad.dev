'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCursorPreview } from '@/hooks/useCursorPreview';
import { useStickyIndex } from '@/hooks/useStickyIndex';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useState } from 'react';
import ScreenshotPreviewPanel from './ScreenshotPreviewPanel';
import ScreenshotLightbox from './ScreenshotLightbox';

export interface IGalleryShot {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
}

interface Props {
    shots: IGalleryShot[];
}

// Screenshot grid with a cursor-following magnifier (shared
// useCursorPreview hook + ScreenshotPreviewPanel) and a click-to-expand
// lightbox for touch/keyboard users.
//
// The figures deliberately match none of the custom cursor's interactive
// selectors: the expand trigger is a <button data-cursor-rest>, which the
// cursor resolves to its rest scale, so the cursor spotlight never stacks with
// the floating panel.
const ScreenshotGallery = ({ shots }: Props) => {
    // Subscribed (not read once) so crossing the breakpoint updates live. The
    // hook returns false during SSR and the first client render, which keeps
    // the server and client markup identical.
    const isDesktop = useMediaQuery('(min-width: 768px)');
    // Subscribed for the same reason: shouldSkipAnimation() reads matchMedia,
    // so calling it during render would only reflect the value at that render
    // and a preference toggled later would never take effect.
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );

    // No hover to preview on touch, and reduced-motion users get the static
    // grid as the complete experience.
    const previewEnabled = isDesktop && !prefersReducedMotion;

    const { attach, attachInner, show, move, hide, cancelHide } =
        useCursorPreview(previewEnabled);

    // Drives the panel's image source. Deliberately the only React state in
    // the hover path: pointer coordinates go straight into the quickTo setters
    // so a mousemove never triggers a re-render. Sticky: clearing defers so
    // gap crossings never flash the chrome off and back on.
    const {
        index: activeIndex,
        set: setActiveIndex,
        clearNow: clearActiveIndex,
    } = useStickyIndex(300);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const active = activeIndex === null ? null : shots[activeIndex];

    const handleEnter = (index: number, e: React.MouseEvent) => {
        if (!previewEnabled) return;

        // A pending hide from the previous figure is now stale.
        cancelHide();
        setActiveIndex(index);
        show(e);
    };

    const handleMove = (e: React.MouseEvent) => {
        if (!previewEnabled || activeIndex === null) return;
        move(e);
    };

    const handleLeave = () => {
        setActiveIndex(null);
        hide();
    };

    const openLightbox = (index: number) => {
        // Park the floating panel behind the dialog (z-60 < z-80).
        hide();
        clearActiveIndex();
        setLightboxIndex(index);
    };

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-3">
                {shots.map((shot, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <figure
                            key={shot.src}
                            onMouseEnter={(e) => handleEnter(index, e)}
                            onMouseMove={handleMove}
                            onMouseLeave={handleLeave}
                            className={cn(
                                'group relative border bg-card overflow-hidden rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.35)]',
                                isActive
                                    ? 'border-primary/50'
                                    : 'border-white/10 hover:border-primary/30',
                                // Spotlight the hovered shot: siblings recede.
                                activeIndex !== null &&
                                    !isActive &&
                                    'opacity-60 saturate-[.85]',
                            )}
                        >
                            {/* Corner brackets, revealed on hover - the same
                                treatment as Testimonials / ProjectCard. */}
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'bracket-arm pointer-events-none absolute inset-0 z-[1] border-t-2 border-l-2 rounded-tl-[10px] transition-[clip-path,border-color] duration-300 ease-out',
                                    isActive
                                        ? 'border-primary [clip-path:inset(0)]'
                                        : 'border-primary/60 [clip-path:inset(0_80%_60%_0)] group-hover:border-primary group-hover:[clip-path:inset(0)]',
                                )}
                            />
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'bracket-arm pointer-events-none absolute inset-0 z-[1] border-b-2 border-r-2 rounded-br-[10px] transition-[clip-path,border-color] duration-300 delay-75 ease-out',
                                    isActive
                                        ? 'border-primary [clip-path:inset(0)]'
                                        : 'border-primary/60 [clip-path:inset(60%_0_0_80%)] group-hover:border-primary group-hover:[clip-path:inset(0)]',
                                )}
                            />

                            <button
                                type="button"
                                data-cursor-rest
                                onClick={() => openLightbox(index)}
                                aria-label={`Expand screenshot: ${shot.alt}`}
                                className="relative z-[1] block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
                            >
                                <Image
                                    src={shot.src}
                                    alt={shot.alt}
                                    width={shot.width}
                                    height={shot.height}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1148px) 33vw, 360px"
                                    loading="lazy"
                                    className={cn(
                                        'w-full h-auto object-cover transition-transform duration-300 ease-out',
                                        isActive && 'scale-[1.02]',
                                    )}
                                />
                            </button>
                            <figcaption className="relative z-[1] px-3 py-2 font-mono text-ui-sm text-muted-foreground/80 border-t border-white/5">
                                {shot.caption}
                            </figcaption>
                        </figure>
                    );
                })}
            </div>

            <ScreenshotPreviewPanel
                shot={active}
                caption={active?.caption ?? ''}
                index={activeIndex ?? -1}
                total={shots.length}
                visible={activeIndex !== null}
                attach={attach}
                attachInner={attachInner}
            />

            {lightboxIndex !== null && (
                <ScreenshotLightbox
                    shots={shots}
                    index={lightboxIndex}
                    onIndexChange={setLightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    );
};

export default ScreenshotGallery;
