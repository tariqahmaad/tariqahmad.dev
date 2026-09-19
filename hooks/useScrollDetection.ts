import { useState, useEffect } from 'react';

interface UseScrollDetectionOptions {
    links: readonly { sectionId: string | null }[];
    offset?: number;
    /** When false, no listeners are attached and no layout is read. */
    enabled?: boolean;
}

/**
 * Hook to detect which section is currently active based on scroll position.
 *
 * Section offsets are measured and cached, then compared against a
 * rAF-throttled scroll position and re-measured whenever the document can have
 * moved: a resize, a web-font swap, or any layout change the document height
 * reflects. The previous version called `getElementById` + `offsetTop` for
 * every link on every scroll event, which forced a style/layout read per frame
 * and never invalidated the offsets after a resize or a web-font swap.
 */
export const useScrollDetection = ({
    links,
    offset = 100,
    enabled = true,
}: UseScrollDetectionOptions) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            setActiveSection(null);
            return;
        }

        let sectionOffsets: { id: string; top: number }[] = [];

        const measure = () => {
            sectionOffsets = links
                .flatMap((link) => {
                    if (!link.sectionId) return [];
                    const element = document.getElementById(link.sectionId);
                    if (!element) return [];
                    // getBoundingClientRect is offsetParent-independent, unlike
                    // offsetTop, which silently breaks if an ancestor becomes
                    // positioned or transformed.
                    return [
                        {
                            id: link.sectionId,
                            top:
                                element.getBoundingClientRect().top +
                                window.scrollY,
                        },
                    ];
                })
                .sort((a, b) => a.top - b.top);
        };

        let frame = 0;
        // `document.fonts.ready` cannot be cancelled and a rAF can still be
        // queued when the effect tears down; either one landing afterwards would
        // call `setActiveSection` for a component that is already unmounted.
        let cancelled = false;
        // Last measured document height, so the observer does not re-read every
        // section's box when nothing about the layout actually changed.
        let documentHeight = 0;

        const update = () => {
            frame = 0;
            if (cancelled) return;
            const scrollPosition = window.scrollY + offset;
            let next: string | null = null;
            for (const section of sectionOffsets) {
                if (section.top <= scrollPosition) next = section.id;
                else break;
            }
            // Only re-render when the answer actually changes.
            setActiveSection((prev) => (prev === next ? prev : next));
        };

        const onScroll = () => {
            if (frame || cancelled) return;
            frame = requestAnimationFrame(update);
        };

        const remeasure = () => {
            if (cancelled) return;
            measure();
            onScroll();
        };

        // Section tops move for reasons `resize` never sees: the web fonts swap
        // in, images load, and the scroll-triggered reveal animations change the
        // layout as the page is scrolled. The observer is what keeps the cached
        // offsets from going stale after the first measurement - reading the
        // height here is free because an observer callback runs after layout.
        const remeasureIfResized = () => {
            if (cancelled) return;
            const height = document.documentElement.scrollHeight;
            if (height === documentHeight) return;
            documentHeight = height;
            remeasure();
        };

        measure();
        documentHeight = document.documentElement.scrollHeight;
        update();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', remeasure);
        // Section heights shift once the web fonts swap in.
        document.fonts?.ready.then(remeasure).catch(() => {});

        const resizeObserver = new ResizeObserver(remeasureIfResized);
        resizeObserver.observe(document.body);
        resizeObserver.observe(document.documentElement);

        return () => {
            cancelled = true;
            if (frame) cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', remeasure);
        };
    }, [links, offset, enabled]);

    return activeSection;
};
