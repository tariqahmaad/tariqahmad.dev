'use client';

import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

// Scroll threshold to show the button (in pixels)
const SCROLL_THRESHOLD = 400;

// Scroll direction detection tolerance (prevents flickering)
const SCROLL_TOLERANCE = 5;

// Animation constants
const ANIMATION_DURATION = 0.3;
const HOVER_SCALE = 1.1;

type VisibilityState = 'hidden' | 'visible' | 'entering' | 'exiting';

const ScrollToTop = () => {
    const containerRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const [visibilityState, setVisibilityState] = useState<VisibilityState>('hidden');
    const lastScrollYRef = useRef(0);
    const lastDirectionRef = useRef<'up' | 'down' | null>(null);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine if button should be visible based on scroll position and direction
    const updateVisibility = useCallback(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;

        // Ignore tiny scroll movements (debounce)
        if (Math.abs(scrollDelta) < SCROLL_TOLERANCE) {
            return;
        }

        // Determine scroll direction
        const isScrollingDown = scrollDelta > 0;
        const currentDirection = isScrollingDown ? 'down' : 'up';
        lastDirectionRef.current = currentDirection;

        // Check if we're past the threshold
        const pastThreshold = currentScrollY > SCROLL_THRESHOLD;

        // Logic: Show when scrolling UP and past threshold, hide when scrolling DOWN
        const shouldBeVisible = pastThreshold && !isScrollingDown;

        // Update visibility state
        setVisibilityState(prev => {
            // Prevent state changes during animation transitions
            if (prev === 'entering' || prev === 'exiting') return prev;

            if (shouldBeVisible && prev === 'hidden') {
                return 'entering';
            } else if (!shouldBeVisible && prev === 'visible') {
                return 'exiting';
            }
            return prev;
        });

        lastScrollYRef.current = currentScrollY;
    }, []);

    // Handle scroll visibility with direction detection
    useEffect(() => {
        // Initialize scroll position
        lastScrollYRef.current = window.scrollY;

        // Check initial state
        updateVisibility();

        window.addEventListener('scroll', updateVisibility, { passive: true });
        return () => window.removeEventListener('scroll', updateVisibility);
    }, [updateVisibility]);

    // GSAP animations for slide in/out
    useGSAP(() => {
        // Skip animation if user prefers reduced motion
        if (prefersReducedMotion) {
            if (visibilityState === 'entering') {
                setVisibilityState('visible');
            } else if (visibilityState === 'exiting') {
                setVisibilityState('hidden');
            }
            return;
        }

        if (visibilityState === 'entering') {
            gsap.fromTo(
                containerRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: ANIMATION_DURATION,
                    ease: 'back.out(1.7)',
                    onComplete: () => setVisibilityState('visible'),
                }
            );
        } else if (visibilityState === 'exiting') {
            gsap.to(containerRef.current, {
                y: 100,
                opacity: 0,
                duration: ANIMATION_DURATION,
                ease: 'power2.in',
                onComplete: () => setVisibilityState('hidden'),
            });
        }
    }, [visibilityState]);

    // Hover animation helper
    const animateHover = (scale: number, iconY: number) => {
        if (prefersReducedMotion) return;
        gsap.to(containerRef.current, { scale, duration: 0.3, ease: 'power2.out' });
        gsap.to(iconRef.current, { y: iconY, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseEnter = () => animateHover(HOVER_SCALE, -3);
    const handleMouseLeave = () => animateHover(1, 0);

    // Scroll to top handler
    const scrollToTop = () => {
        // Use Lenis instance if available (from layout.tsx)
        const lenis = (window as Window & { lenis?: { scrollTo: (target: string | number) => void } }).lenis;
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Don't render if completely hidden
    if (visibilityState === 'hidden') return null;

    const isVisible = visibilityState === 'visible' || visibilityState === 'entering';

    return (
        <button
            ref={containerRef}
            onClick={scrollToTop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-8 right-[2%] z-50 group"
            aria-label="Scroll to top"
            role="button"
            tabIndex={isVisible ? 0 : -1}
        >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg scale-125 group-hover:bg-primary/30 transition-colors duration-300" />

            {/* Main button container */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background-light border border-primary/40 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary group-hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />

                {/* Animated arrow icon */}
                <div ref={iconRef} className="relative">
                    <ArrowUp
                        className="w-5 h-5 text-primary transition-colors duration-300"
                        strokeWidth={2.5}
                    />
                </div>

                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
            </div>
        </button>
    );
};

export default ScrollToTop;