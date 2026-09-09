'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Selectors for interactive elements that trigger hover effects
const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, textarea, select, .cursor-pointer';

// Animation constants
const HOVER_SCALE = 1.5;
const CLICK_SCALE_FACTOR = 0.5;
const MOVE_DURATION = 0.35;
const HOVER_DURATION = 0.4;
const CLICK_DURATION = 0.15;
const HIDE_DURATION = 0.15;

// Media queries the cursor must agree with. These mirror the CSS gate in
// app/globals.css (min-width: 768px + prefers-reduced-motion: no-preference)
// so the native cursor is never hidden without a live custom cursor.
const DESKTOP_QUERY = '(min-width: 768px)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

// Marker class that unlocks `cursor: none` in globals.css. It is added only
// once the custom cursor has actually initialized, so disabled JS, a
// hydration failure or an earlier thrown error can never leave desktop users
// with no cursor at all.
const CURSOR_ACTIVE_CLASS = 'has-custom-cursor';

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
    const pathname = usePathname();

    // Shared cursor state accessible from both useEffect and useGSAP
    const cursorStateRef = useRef({
        isHovering: false,
        currentScale: 1,
        isVisible: false,
        // True while the cursor has not been placed yet: stay hidden so it
        // cannot flash at a stale origin until the first pointer move.
        hiddenUntilMove: false,
    });

    // Last known pointer position, used to re-seat the cursor on route change
    const pointerRef = useRef<{ x: number; y: number } | null>(null);

    // quickTo setters, created once per activation and reused for every frame
    const followRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

    // Reset cursor on route changes
    useEffect(() => {
        const spotlight = spotlightRef.current;
        const pointer = pointerRef.current;

        if (spotlight) {
            if (pointer) {
                // GSAP owns the transform, so re-seat position and visibility
                // together — otherwise the cursor flashes at its stale route
                // position. Re-target the follow tweens too, or they would
                // snap back to their pre-navigation destination.
                followRef.current?.x(pointer.x);
                followRef.current?.y(pointer.y);
                gsap.set(spotlight, {
                    x: pointer.x,
                    y: pointer.y,
                    scale: 1,
                    opacity: 1,
                });
                cursorStateRef.current.isVisible = true;
            } else {
                // No pointer data yet: keep it hidden until the next move.
                cursorStateRef.current.hiddenUntilMove = true;
                cursorStateRef.current.isVisible = false;
                gsap.set(spotlight, {
                    scale: 1,
                    opacity: 0,
                });
            }
        }
        if (ringRef.current) {
            updateRingMask(ringRef.current, MASK_DEFAULT_OUTER_STOP);
        }
        // Reset shared state so useGSAP handlers see a clean slate
        cursorStateRef.current.isHovering = false;
        cursorStateRef.current.currentScale = 1;
    }, [pathname]);

    useGSAP((context, contextSafe) => {
        // Enable/disable state follows these two queries live, so resizing
        // across 768px (or toggling reduced motion) never leaves the page with
        // no cursor or with a dead custom one.
        const desktopQuery = window.matchMedia(DESKTOP_QUERY);
        const motionQuery = window.matchMedia(MOTION_QUERY);

        let isActive = false;
        // Coalesce rapid mousemove events through rAF so elementFromPoint and
        // quickTo run at most once per frame.
        let pendingMove: { x: number; y: number } | null = null;
        let moveRaf = 0;

        const flushMove = () => {
            moveRaf = 0;
            if (!pendingMove) return;
            const { x, y } = pendingMove;
            pendingMove = null;

            const hoveredElement = document.elementFromPoint(x, y) as HTMLElement | null;
            const shouldHideCursor = Boolean(hoveredElement?.closest('[data-cursor-hide]'));

            if (cursorStateRef.current.hiddenUntilMove) {
                // First move after (re)activation: snap instead of sweeping in
                // from the stale origin.
                cursorStateRef.current.hiddenUntilMove = false;
                gsap.set(spotlightRef.current, { x, y });
            }

            const shouldBeVisible = !shouldHideCursor;
            if (shouldBeVisible !== cursorStateRef.current.isVisible) {
                cursorStateRef.current.isVisible = shouldBeVisible;
                gsap.to(spotlightRef.current, {
                    opacity: shouldBeVisible ? 1 : 0,
                    duration: HIDE_DURATION,
                    overwrite: 'auto',
                });
            }

            // Reuse the same tweens instead of spawning a new one per frame
            followRef.current?.x(x);
            followRef.current?.y(y);
        };

        const handleMouseMove = (e: MouseEvent) => {
            pointerRef.current = { x: e.clientX, y: e.clientY };
            pendingMove = pointerRef.current;
            if (!moveRaf) moveRaf = requestAnimationFrame(flushMove);
        };

        const handleMouseEnter = () => {
            // The first mousemove reveals the cursor; until then keep it hidden
            // so entering the window cannot flash it at a stale position.
            if (cursorStateRef.current.hiddenUntilMove) return;
            cursorStateRef.current.isVisible = true;
            gsap.to(spotlightRef.current, {
                opacity: 1,
                duration: HOVER_DURATION,
                overwrite: 'auto',
            });
        };

        const handleMouseLeave = () => {
            cursorStateRef.current.isHovering = false;
            cursorStateRef.current.currentScale = 1;
            cursorStateRef.current.isVisible = false;
            gsap.set(spotlightRef.current, { scale: 1, opacity: 0 });
        };

        const handleMouseDown = () => {
            // overwrite: 'auto' (not true) so the scale tween only cancels
            // conflicting scale tweens, never the x/y follow tween.
            gsap.to(spotlightRef.current, {
                scale: cursorStateRef.current.currentScale * CLICK_SCALE_FACTOR,
                duration: CLICK_DURATION,
                ease: 'power2.out',
                overwrite: 'auto',
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
                scale: cursorStateRef.current.currentScale,
                duration: CLICK_DURATION,
                ease: 'power2.out',
                overwrite: 'auto',
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

            // [data-cursor-hide] is handled solely by flushMove's per-frame hit
            // test, so no competing opacity tweens are created here.
            if (isInteractiveElement(target) && !cursorStateRef.current.isHovering) {
                cursorStateRef.current.isHovering = true;
                cursorStateRef.current.currentScale = HOVER_SCALE;
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

            if (isInteractiveElement(target) && !isInteractiveElement(relatedTarget)) {
                cursorStateRef.current.isHovering = false;
                cursorStateRef.current.currentScale = 1;
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

        const activate = () => {
            const spotlight = spotlightRef.current;
            if (isActive || !spotlight) return;
            isActive = true;

            // GSAP writes the inline transform, which overwrites the Tailwind
            // -translate-x-1/2 -translate-y-1/2 centering classes, so centering
            // has to come from xPercent/yPercent instead.
            gsap.set(spotlight, {
                xPercent: -50,
                yPercent: -50,
            });

            const pointer = pointerRef.current;
            if (pointer) {
                gsap.set(spotlight, {
                    x: pointer.x,
                    y: pointer.y,
                    scale: 1,
                    opacity: 1,
                });
                cursorStateRef.current.isVisible = true;
                cursorStateRef.current.hiddenUntilMove = false;
            }

            // Created once and reused for every frame of the follow
            followRef.current = {
                x: gsap.quickTo(spotlight, 'x', {
                    duration: MOVE_DURATION,
                    ease: 'power3.out',
                }),
                y: gsap.quickTo(spotlight, 'y', {
                    duration: MOVE_DURATION,
                    ease: 'power3.out',
                }),
            };

            // Only now hide the native cursor: globals.css gates on this class
            document.documentElement.classList.add(CURSOR_ACTIVE_CLASS);

            window.addEventListener('mousemove', safeMouseMove);
            document.body.addEventListener('mouseenter', safeMouseEnter);
            document.body.addEventListener('mouseleave', safeMouseLeave);
            document.addEventListener('mousedown', safeMouseDown);
            document.addEventListener('mouseup', safeMouseUp);
            document.addEventListener('mouseover', safeMouseOver);
            document.addEventListener('mouseout', safeMouseOut);
        };

        const deactivate = () => {
            if (!isActive) return;
            isActive = false;

            if (moveRaf) {
                cancelAnimationFrame(moveRaf);
                moveRaf = 0;
            }
            pendingMove = null;
            followRef.current = null;

            // Hand the native cursor back before hiding the custom one
            document.documentElement.classList.remove(CURSOR_ACTIVE_CLASS);

            window.removeEventListener('mousemove', safeMouseMove);
            document.body.removeEventListener('mouseenter', safeMouseEnter);
            document.body.removeEventListener('mouseleave', safeMouseLeave);
            document.removeEventListener('mousedown', safeMouseDown);
            document.removeEventListener('mouseup', safeMouseUp);
            document.removeEventListener('mouseover', safeMouseOver);
            document.removeEventListener('mouseout', safeMouseOut);

            cursorStateRef.current.isHovering = false;
            cursorStateRef.current.currentScale = 1;
            cursorStateRef.current.isVisible = false;
            cursorStateRef.current.hiddenUntilMove = true;
            gsap.set(spotlightRef.current, { scale: 1, opacity: 0 });
        };

        const syncActiveState = () => {
            if (desktopQuery.matches && motionQuery.matches) {
                activate();
            } else {
                deactivate();
            }
        };

        syncActiveState();
        desktopQuery.addEventListener('change', syncActiveState);
        motionQuery.addEventListener('change', syncActiveState);

        return () => {
            desktopQuery.removeEventListener('change', syncActiveState);
            motionQuery.removeEventListener('change', syncActiveState);
            deactivate();
        };
    });

    return (
        <div
            ref={spotlightRef}
            className="hidden md:block fixed top-0 left-0 opacity-0 z-[9999] pointer-events-none"
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
