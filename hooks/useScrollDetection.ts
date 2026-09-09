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
 * Section offsets are measured once and cached, then compared against a
 * rAF-throttled scroll position. The previous version called
 * `getElementById` + `offsetTop` for every link on every scroll event, which
 * forced a style/layout read per frame and never invalidated the offsets
 * after a resize or a web-font swap.
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

        const update = () => {
            frame = 0;
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
            if (frame) return;
            frame = requestAnimationFrame(update);
        };

        const remeasure = () => {
            measure();
            onScroll();
        };

        measure();
        update();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', remeasure);
        // Section heights shift once the web fonts swap in.
        document.fonts?.ready.then(remeasure).catch(() => {});

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', remeasure);
        };
    }, [links, offset, enabled]);

    return activeSection;
};
