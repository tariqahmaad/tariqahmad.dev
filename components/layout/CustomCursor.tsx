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

// Helper: nearest interactive ancestor of `element` (or `element` itself).
// Returning the ancestor instead of a boolean lets the hover probe cache it -
// every descendant of an interactive ancestor is interactive too, so the
// `closest()` walk only has to run when the pointer leaves that subtree.
function interactiveAncestorOf(element: Element | null): Element | null {
    if (!element) return null;
    return element.matches(INTERACTIVE_SELECTORS)
        ? element
        : element.closest(INTERACTIVE_SELECTORS);
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
        // Mirrors the useGSAP closure's `isActive` so the route-change effect can
        // tell whether the cursor is live without re-deriving the media queries.
        isActive: false,
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

        // Only re-seat a cursor that is actually live. Writing here regardless
        // of `isActive` used to strand the disc: `deactivate()` (reduced motion,
        // or a window narrower than 768px) detaches the mousemove listener, so
        // nothing was left that could fade out the `opacity: 1` written below.
        if (!cursorStateRef.current.isActive) return;

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
        // Coalesce rapid mousemove events through rAF so the visibility check and
        // quickTo run at most once per frame.
        let pendingMove: { x: number; y: number } | null = null;
        // Topmost element under the pointer, taken from the mousemove event
        // itself: the browser dispatches a mousemove to that element, so
        // `event.target` already *is* the hit test result. Calling
        // `document.elementFromPoint` on top of it repeated the browser's own hit
        // test on every frame of pointer motion.
        let hoveredElement: Element | null = null;
        let moveRaf = 0;

        const flushMove = () => {
            moveRaf = 0;
            if (!pendingMove) return;
            const { x, y } = pendingMove;
            pendingMove = null;

            const shouldHideCursor = Boolean(
                hoveredElement?.closest('[data-cursor-hide]'),
            );

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
            // `instanceof Element`, not `HTMLElement`: SVG children are valid
            // targets and `data-cursor-hide` sits on a button that wraps one.
            hoveredElement = e.target instanceof Element ? e.target : null;
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

        // Enter/leave transitions fire a mouseover/mouseout pair for every
        // element boundary the pointer crosses - far more often than the hover
        // state can change, and each pair used to run up to four
        // `matches()`/`closest()` walks. Only the newest event of a frame
        // matters (the hover state follows where the pointer is now, not the
        // path it took), so they are collapsed into a single rAF pass.
        let hoverRaf = 0;
        // `null` is a meaningful value ("pointer left the document"), hence the
        // separate flag rather than using null for "nothing pending".
        let pendingHoverElement: Element | null = null;
        let hasPendingHover = false;
        // Interactive ancestor the pointer was last inside. Re-validated with a
        // single-node `matches()`: while it still matches, every descendant of
        // it is interactive, so transitions inside one component (a card, a nav
        // item) skip the ancestor walk entirely.
        let interactiveAncestor: Element | null = null;

        const resolveHover = (element: Element | null): boolean => {
            if (!element) return false;

            // Screenshot-preview thumbnails carry their own floating panel, so
            // the cursor stays at rest scale over them even though they are
            // <button>s (otherwise the spotlight would scale up and stack with
            // the panel). Same opt-out idea as `data-cursor-hide` above.
            if (element.closest('[data-cursor-rest]')) {
                interactiveAncestor = null;
                return false;
            }

            const cached = interactiveAncestor;
            // `matches()` on the cached node is a single-element test, cheaper
            // than walking the tree: while it still matches, every descendant of
            // it is interactive too.
            if (
                cached !== null &&
                cached.matches(INTERACTIVE_SELECTORS) &&
                cached.contains(element)
            ) {
                return true;
            }

            interactiveAncestor = interactiveAncestorOf(element);
            return interactiveAncestor !== null;
        };

        const flushHover = () => {
            hoverRaf = 0;
            if (!hasPendingHover) return;
            hasPendingHover = false;

            const shouldHover = resolveHover(pendingHoverElement);
            pendingHoverElement = null;

            if (shouldHover === cursorStateRef.current.isHovering) return;

            cursorStateRef.current.isHovering = shouldHover;
            cursorStateRef.current.currentScale = shouldHover ? HOVER_SCALE : 1;
            // Same target scale, ease and duration the enter/leave handlers used,
            // so the hover state itself is unchanged - only its timing moves to
            // the frame boundary.
            gsap.to(spotlightRef.current, {
                scale: cursorStateRef.current.currentScale,
                duration: HOVER_DURATION,
                ease: 'power3.out',
            });
        };

        const queueHover = (element: Element | null) => {
            pendingHoverElement = element;
            hasPendingHover = true;
            if (!hoverRaf) hoverRaf = requestAnimationFrame(flushHover);
        };

        const handleMouseOver = (e: MouseEvent) => {
            // The element being entered is where the pointer is now, so it wins
            // over anything queued earlier in the same frame.
            // [data-cursor-hide] is handled solely by flushMove's per-frame hit
            // test, so no competing opacity tweens are created here.
            queueHover(e.target instanceof Element ? e.target : null);
        };

        const handleMouseOut = (e: MouseEvent) => {
            // `relatedTarget` is where the pointer is heading (null when it
            // leaves the window), which is the state the next frame renders.
            queueHover(
                e.relatedTarget instanceof Element ? e.relatedTarget : null,
            );
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
            cursorStateRef.current.isActive = true;

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
            cursorStateRef.current.isActive = false;

            if (moveRaf) {
                cancelAnimationFrame(moveRaf);
                moveRaf = 0;
            }
            if (hoverRaf) {
                cancelAnimationFrame(hoverRaf);
                hoverRaf = 0;
            }
            pendingMove = null;
            pendingHoverElement = null;
            hasPendingHover = false;
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
            // The route-change effect now only re-seats the cursor while it is
            // active, so the ring is reset here as well: a click mask left
            // mid-tween must not survive into the next activation.
            if (ringRef.current) {
                updateRingMask(ringRef.current, MASK_DEFAULT_OUTER_STOP);
            }
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
