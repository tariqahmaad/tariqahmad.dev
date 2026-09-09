'use client';
import React, { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
    const scrollBarRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const updateProgress = () => {
            frameRef.current = null;

            if (!scrollBarRef.current) return;

            const { scrollHeight, clientHeight } = document.documentElement;
            const scrollableHeight = scrollHeight - clientHeight;
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

        updateProgress();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
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
