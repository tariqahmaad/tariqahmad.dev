'use client';
import React, { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
    const scrollBarRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);
    // Cached `scrollHeight - clientHeight`: reading it per frame forced a
    // style/layout invalidation for the whole document on every scroll frame.
    const scrollableHeightRef = useRef(0);

    useEffect(() => {
        const measureScrollableHeight = () => {
            const { scrollHeight, clientHeight } = document.documentElement;
            scrollableHeightRef.current = scrollHeight - clientHeight;
        };

        const updateProgress = () => {
            frameRef.current = null;

            if (!scrollBarRef.current) return;

            const scrollableHeight = scrollableHeightRef.current;
            const scrollY = window.scrollY;

            // A page shorter than the viewport has no scrollable height: dividing
            // by it produced NaN and a `translateY(-NaN%)`. Stay at 0% (hidden).
            const scrollProgress = scrollableHeight > 0
                ? Math.min(Math.max(scrollY / scrollableHeight, 0), 1) * 100
                : 0;

            scrollBarRef.current.style.transform = `translateY(-${
                100 - scrollProgress
            }%)`;
        };

        // Coalesce scroll events into a single layout read + style write per frame.
        const handleScroll = () => {
            if (frameRef.current !== null) return;
            frameRef.current = requestAnimationFrame(updateProgress);
        };

        // Measured before the first paint of the bar so a restored scroll
        // position does not render a zero progress frame.
        measureScrollableHeight();
        updateProgress();

        // A page that grows (reveal animations, images, fonts) changes the
        // scrollable height without a `resize` event, so the cached value is
        // invalidated from the document boxes themselves.
        const resizeObserver = new ResizeObserver(measureScrollableHeight);
        resizeObserver.observe(document.documentElement);
        resizeObserver.observe(document.body);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="fixed top-[50svh] right-[2%] -translate-y-1/2 w-1.5 h-[100px] bg-background-light overflow-hidden"
        >
            <div
                className="w-full bg-primary h-full shadow-[0_0_8px_rgba(0,255,0,0.6)]"
                ref={scrollBarRef}
            ></div>
        </div>
    );
};

export default ScrollProgressIndicator;
