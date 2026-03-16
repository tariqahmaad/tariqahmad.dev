'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef } from 'react';

// Selectors for interactive elements that trigger hover effects
const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, textarea, select';

// Animation constants
const HOVER_SCALE = 1.5;
const CLICK_SCALE_FACTOR = 0.5;
const MOVE_DURATION = 0.35;
const HOVER_DURATION = 0.4;
const CLICK_DURATION = 0.15;

// Mask gradient constants
const MASK_INNER_STOP = 45;
const MASK_DEFAULT_OUTER_STOP = 70;
const MASK_CLICK_OUTER_STOP = 46;
const MASK_TRANSITION_RANGE = 24;

// Helper: Check if element is interactive (or nested inside one)
function isInteractiveElement(element: HTMLElement | null): boolean {
    if (!element) return false;
    return element.matches(INTERACTIVE_SELECTORS) || element.closest(INTERACTIVE_SELECTORS) !== null;
}

// Helper: Update ring mask gradient
function updateRingMask(ring: HTMLDivElement, outerStop: number): void {
    const gradient = `radial-gradient(circle, #000 0%, #000 ${MASK_INNER_STOP}%, transparent ${outerStop}%)`;
    ring.style.mask = gradient;
    (ring.style as CSSStyleDeclaration & { webkitMask: string }).webkitMask = gradient;
}

const CustomCursor = () => {
    const spotlightRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useGSAP((context, contextSafe) => {
        // Skip on mobile or if user prefers reduced motion
        if (window.innerWidth < 768) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Animation state (closure-scoped for GSAP callbacks)
        let currentScale = 1;
        let isHovering = false;

        const handleMouseMove = (e: MouseEvent) => {
            gsap.to(spotlightRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: MOVE_DURATION,
                ease: 'power3.out',
                overwrite: 'auto',
            });
        };

        const handleMouseEnter = () => {
            gsap.to(spotlightRef.current, { opacity: 1, duration: HOVER_DURATION });
        };

        const handleMouseLeave = () => {
            gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
        };

        const handleMouseDown = () => {
            gsap.to(spotlightRef.current, {
                scale: currentScale * CLICK_SCALE_FACTOR,
                duration: CLICK_DURATION,
                ease: 'power2.out',
                overwrite: true,
            });
            gsap.to(ringRef.current, {
                duration: CLICK_DURATION,
                ease: 'power2.out',
                onUpdate: function () {
                    if (!ringRef.current) return;
                    const progress = this.progress();
                    const stop = MASK_DEFAULT_OUTER_STOP - MASK_TRANSITION_RANGE * progress;
                    updateRingMask(ringRef.current, stop);
                },
            });
        };

        const handleMouseUp = () => {
            gsap.to(spotlightRef.current, {
                scale: currentScale,
                duration: CLICK_DURATION,
                ease: 'power2.out',
                overwrite: true,
            });
            gsap.to(ringRef.current, {
                duration: CLICK_DURATION,
                ease: 'power2.out',
                onUpdate: function () {
                    if (!ringRef.current) return;
                    const progress = this.progress();
                    const stop = MASK_CLICK_OUTER_STOP + MASK_TRANSITION_RANGE * progress;
                    updateRingMask(ringRef.current, stop);
                },
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isInteractiveElement(target) && !isHovering) {
                isHovering = true;
                currentScale = HOVER_SCALE;
                gsap.to(spotlightRef.current, {
                    scale: HOVER_SCALE,
                    duration: HOVER_DURATION,
                    ease: 'power3.out',
                });
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const relatedTarget = e.relatedTarget as HTMLElement;

            // Only scale down if leaving an interactive element and not entering another
            if (isInteractiveElement(target) && !isInteractiveElement(relatedTarget)) {
                isHovering = false;
                currentScale = 1;
                gsap.to(spotlightRef.current, {
                    scale: 1,
                    duration: HOVER_DURATION,
                    ease: 'power3.out',
                });
            }
        };

        // Wrap handlers with contextSafe for proper GSAP cleanup
        const safeMouseMove = contextSafe?.(handleMouseMove) ?? handleMouseMove;
        const safeMouseEnter = contextSafe?.(handleMouseEnter) ?? handleMouseEnter;
        const safeMouseLeave = contextSafe?.(handleMouseLeave) ?? handleMouseLeave;
        const safeMouseDown = contextSafe?.(handleMouseDown) ?? handleMouseDown;
        const safeMouseUp = contextSafe?.(handleMouseUp) ?? handleMouseUp;
        const safeMouseOver = contextSafe?.(handleMouseOver) ?? handleMouseOver;
        const safeMouseOut = contextSafe?.(handleMouseOut) ?? handleMouseOut;

        // Attach event listeners
        window.addEventListener('mousemove', safeMouseMove);
        document.body.addEventListener('mouseenter', safeMouseEnter);
        document.body.addEventListener('mouseleave', safeMouseLeave);
        document.addEventListener('mousedown', safeMouseDown);
        document.addEventListener('mouseup', safeMouseUp);
        document.addEventListener('mouseover', safeMouseOver);
        document.addEventListener('mouseout', safeMouseOut);

        return () => {
            window.removeEventListener('mousemove', safeMouseMove);
            document.body.removeEventListener('mouseenter', safeMouseEnter);
            document.body.removeEventListener('mouseleave', safeMouseLeave);
            document.removeEventListener('mousedown', safeMouseDown);
            document.removeEventListener('mouseup', safeMouseUp);
            document.removeEventListener('mouseover', safeMouseOver);
            document.removeEventListener('mouseout', safeMouseOut);
        };
    });

    return (
        <div
            ref={spotlightRef}
            className="hidden md:block fixed top-0 left-0 opacity-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ mixBlendMode: 'difference', willChange: 'transform' }}
        >
            <div
                ref={ringRef}
                className="w-[80px] h-[80px] rounded-full"
                style={{
                    backgroundColor: 'hsl(140, 100%, 50%)',
                    mask: `radial-gradient(circle, #000 0%, #000 ${MASK_INNER_STOP}%, transparent ${MASK_DEFAULT_OUTER_STOP}%)`,
                    WebkitMask: `radial-gradient(circle, #000 0%, #000 ${MASK_INNER_STOP}%, transparent ${MASK_DEFAULT_OUTER_STOP}%)`,
                }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-black" />
        </div>
    );
};

export default CustomCursor;