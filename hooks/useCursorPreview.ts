import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-setup';

// Motion constants for the cursor-following screenshot preview. The follow
// itself mirrors the CustomCursor's quickTo pair: setters are created once and
// reused for every frame of pointer motion, so a mousemove never spawns a
// tween and never triggers a React re-render.
const FOLLOW_DURATION = 0.35;
const TILT_DURATION = 0.5;
const INNER_DURATION = 0.55;
const REVEAL_DURATION = 0.3;
const HIDE_DURATION = 0.2;
// Banking limits for the velocity tilt (degrees).
const MAX_TILT = 6;
const TILT_FACTOR = 0.35;
// Inner-image parallax: the preview image drifts against the pointer for
// depth (the image is scaled up so its edges never show). Kept smaller than
// the tilt so the two never fight visually.
const PARALLAX_FACTOR = 1.1;
const MAX_PARALLAX = 14;
// After the pointer rests this long, tilt + parallax ease back to neutral so
// the panel never sits frozen mid-bank.
const SETTLE_DELAY = 180;
// Iris-wipe reveal for the panel. Both strings share the same shape so GSAP
// can interpolate between them.
const SHOWN_CLIP = 'inset(0% 0% 0% 0% round 0px)';
const HIDDEN_CLIP = 'inset(16% 9% 16% 9% round 14px)';
// Minimum gap between the panel edge and the viewport edge.
const EDGE_MARGIN = 12;
// Rough half-size while the panel is still unmeasured (before its first
// layout, offsetWidth/Height are 0). Kept in sync with the panel width
// (w-[36rem] = 576px) in ScreenshotPreviewPanel.
const FALLBACK_HALF_WIDTH = 288;
const FALLBACK_HALF_HEIGHT = 200;

interface FollowSetters {
    x: (v: number) => void;
    y: (v: number) => void;
    rotationX: (v: number) => void;
    rotationY: (v: number) => void;
}

interface InnerFollowSetters {
    x: (v: number) => void;
    y: (v: number) => void;
}

/**
 * Cursor-following floating preview. Owns the panel's motion (snap, follow,
 * velocity tilt, reveal, deferred hide); the consumer owns the React state
 * (which shot is active) and renders the panel itself.
 *
 * The panel is portaled to `document.body`, so it mounts a tick after its
 * consumer (SSR renders nothing into the portal). `useGSAP`-style setup would
 * therefore run before the node exists — instead the consumer attaches the
 * node through the returned callback ref, which (re)initialises the follow
 * setters on attach and tears them down on detach. `enabled` flips (breakpoint
 * / reduced-motion change) are handled the same way.
 */
export const useCursorPreview = (enabled: boolean) => {
    // Callback ref handed to the panel element (see attach below).
    const panelRef = useRef<HTMLDivElement | null>(null);
    const followRef = useRef<FollowSetters | null>(null);
    // Inner parallax wrapper inside the panel (stable across image swaps —
    // the keyed <Image> remounts, this node does not).
    const innerRef = useRef<HTMLDivElement | null>(null);
    const innerFollowRef = useRef<InnerFollowSetters | null>(null);
    // Moving between two thumbnails fires leave then enter on the same frame.
    // Hiding and immediately re-showing would flash, so a leaving panel only
    // starts its fade if nothing has taken over by the end of the frame.
    const hideRafRef = useRef<number | null>(null);
    // Last clamped pointer position, for the velocity tilt.
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    // Settles tilt + parallax back to neutral once the pointer rests.
    const settleTimeoutRef = useRef<number | null>(null);
    const enabledRef = useRef(enabled);
    enabledRef.current = enabled;

    const initFollow = useCallback((node: HTMLDivElement) => {
        // GSAP writes the inline transform, which would overwrite any Tailwind
        // translate centering classes, so centering comes from
        // xPercent/yPercent instead (same reason as CustomCursor).
        gsap.set(node, {
            xPercent: -50,
            yPercent: -50,
            transformPerspective: 900,
        });
        followRef.current = {
            x: gsap.quickTo(node, 'x', {
                duration: FOLLOW_DURATION,
                ease: 'power3.out',
            }),
            y: gsap.quickTo(node, 'y', {
                duration: FOLLOW_DURATION,
                ease: 'power3.out',
            }),
            rotationX: gsap.quickTo(node, 'rotationX', {
                duration: TILT_DURATION,
                ease: 'power3.out',
            }),
            rotationY: gsap.quickTo(node, 'rotationY', {
                duration: TILT_DURATION,
                ease: 'power3.out',
            }),
        };
    }, []);

    const teardown = useCallback(() => {
        if (hideRafRef.current !== null) {
            cancelAnimationFrame(hideRafRef.current);
            hideRafRef.current = null;
        }
        if (settleTimeoutRef.current !== null) {
            clearTimeout(settleTimeoutRef.current);
            settleTimeoutRef.current = null;
        }
        const panel = panelRef.current;
        if (panel) gsap.killTweensOf(panel);
        const inner = innerRef.current;
        if (inner) gsap.killTweensOf(inner);
        followRef.current = null;
        innerFollowRef.current = null;
        lastPosRef.current = null;
    }, []);

    const initInnerFollow = useCallback((node: HTMLDivElement) => {
        innerFollowRef.current = {
            x: gsap.quickTo(node, 'x', {
                duration: INNER_DURATION,
                ease: 'power3.out',
            }),
            y: gsap.quickTo(node, 'y', {
                duration: INNER_DURATION,
                ease: 'power3.out',
            }),
        };
    }, []);

    const attach = useCallback(
        (node: HTMLDivElement | null) => {
            if (panelRef.current && panelRef.current !== node) {
                teardown();
            }
            panelRef.current = node;
            if (!node || !enabledRef.current) return;
            initFollow(node);
        },
        [initFollow, teardown],
    );

    // Callback ref for the inner parallax wrapper. Stable across image swaps
    // (only the keyed <Image> inside it remounts), so the setters are created
    // once and survive shot switches.
    const attachInner = useCallback(
        (node: HTMLDivElement | null) => {
            if (innerRef.current && innerRef.current !== node) {
                gsap.killTweensOf(innerRef.current);
                innerFollowRef.current = null;
            }
            innerRef.current = node;
            if (!node || !enabledRef.current) return;
            initInnerFollow(node);
        },
        [initInnerFollow],
    );

    // `enabled` flipping after the panel is already attached (crossing the
    // desktop breakpoint, toggling reduced motion).
    useEffect(() => {
        const node = panelRef.current;
        const inner = innerRef.current;
        if (enabled) {
            if (node && !followRef.current) initFollow(node);
            if (inner && !innerFollowRef.current) initInnerFollow(inner);
        } else {
            teardown();
            if (node) {
                gsap.set(node, {
                    autoAlpha: 0,
                    scale: 1,
                    rotationX: 0,
                    rotationY: 0,
                    clipPath: 'none',
                });
            }
            if (inner) gsap.set(inner, { x: 0, y: 0 });
        }
    }, [enabled, initFollow, initInnerFollow, teardown]);

    // Unmount cleanup: a deferred hide must not run against a removed panel,
    // and follow setters must not write to a detached node.
    useEffect(() => () => teardown(), [teardown]);

    // Clamp so the panel never spills past the viewport edge. Measured rather
    // than hardcoded: the panel is centred on the pointer and each screenshot
    // has a different height, so its half-height varies.
    const clampToViewport = (
        panel: HTMLDivElement,
        clientX: number,
        clientY: number,
    ) => {
        const halfWidth = (panel.offsetWidth || FALLBACK_HALF_WIDTH * 2) / 2;
        const halfHeight =
            (panel.offsetHeight || FALLBACK_HALF_HEIGHT * 2) / 2;
        return {
            x: Math.min(
                Math.max(clientX, halfWidth + EDGE_MARGIN),
                window.innerWidth - halfWidth - EDGE_MARGIN,
            ),
            y: Math.min(
                Math.max(clientY, halfHeight + EDGE_MARGIN),
                window.innerHeight - halfHeight - EDGE_MARGIN,
            ),
        };
    };

    const cancelHide = useCallback(() => {
        if (hideRafRef.current !== null) {
            cancelAnimationFrame(hideRafRef.current);
            hideRafRef.current = null;
        }
    }, []);

    const show = useCallback(
        (e: React.MouseEvent) => {
            if (!enabledRef.current) return;
            cancelHide();

            const panel = panelRef.current;
            if (!panel) return;

            // Kill in-flight tweens first, then rebuild the follow setters.
            // Without this, an enter that lands after the hide rAF fired (but
            // before the fade visibly progresses) reads autoAlpha === 1 below
            // and early-returns while the orphaned fade runs to hidden — the
            // panel then never comes back for the new thumbnail. Rebuilding
            // the quickTo setters is cheap (one enter per thumbnail, never per
            // mousemove) and they resume from the current position, so the
            // follow stays smooth.
            gsap.killTweensOf(panel);
            initFollow(panel);
            if (settleTimeoutRef.current !== null) {
                clearTimeout(settleTimeoutRef.current);
                settleTimeoutRef.current = null;
            }

            const { x, y } = clampToViewport(panel, e.clientX, e.clientY);
            lastPosRef.current = { x, y };

            // Live handoff (panel fully shown): just retarget the glide.
            // Snapping here would teleport the panel to the cursor and read
            // as a flicker on every thumbnail switch.
            const visibility = Number(gsap.getProperty(panel, 'autoAlpha')) || 0;
            if (visibility >= 1) {
                followRef.current?.x(x);
                followRef.current?.y(y);
                return;
            }

            if (visibility <= 0.02) {
                // Fully hidden: the position is stale, so teleporting is
                // invisible — then iris open from a clean state.
                gsap.set(panel, { x, y });
                followRef.current?.x(x);
                followRef.current?.y(y);
                const inner = innerRef.current;
                if (inner) gsap.set(inner, { x: 0, y: 0 });
                gsap.set(panel, {
                    scale: 0.94,
                    rotationX: 0,
                    rotationY: 0,
                    clipPath: HIDDEN_CLIP,
                });
            } else {
                // Reveal already in flight (rapid re-enter): retarget without
                // resetting, so it continues smoothly from current values.
                followRef.current?.x(x);
                followRef.current?.y(y);
            }
            gsap.to(panel, {
                autoAlpha: 1,
                scale: 1,
                clipPath: SHOWN_CLIP,
                duration: REVEAL_DURATION,
                ease: 'power3.out',
                overwrite: 'auto',
            });
        },
        [cancelHide, initFollow],
    );

    const move = useCallback((e: React.MouseEvent) => {
        if (!enabledRef.current) return;

        const panel = panelRef.current;
        if (!panel) return;

        const { x, y } = clampToViewport(panel, e.clientX, e.clientY);
        followRef.current?.x(x);
        followRef.current?.y(y);

        // Bank the panel slightly into the direction of travel, and drift the
        // inner image the opposite way for depth. Both driven by the clamped
        // positions (not raw deltas) so edge clamping never tilts either.
        const last = lastPosRef.current;
        if (last) {
            const dx = x - last.x;
            const dy = y - last.y;
            const rotationY = Math.max(
                -MAX_TILT,
                Math.min(MAX_TILT, dx * TILT_FACTOR),
            );
            const rotationX = Math.max(
                -MAX_TILT,
                Math.min(MAX_TILT, -dy * TILT_FACTOR),
            );
            followRef.current?.rotationY(rotationY);
            followRef.current?.rotationX(rotationX);
            innerFollowRef.current?.x(
                Math.max(-MAX_PARALLAX, Math.min(MAX_PARALLAX, -dx * PARALLAX_FACTOR)),
            );
            innerFollowRef.current?.y(
                Math.max(-MAX_PARALLAX, Math.min(MAX_PARALLAX, -dy * PARALLAX_FACTOR)),
            );
        }
        lastPosRef.current = { x, y };

        // Once the pointer rests, ease tilt + parallax back to neutral
        // through the live setters (no competing tweens) so the panel never
        // sits frozen mid-bank.
        if (settleTimeoutRef.current !== null) {
            clearTimeout(settleTimeoutRef.current);
        }
        settleTimeoutRef.current = window.setTimeout(() => {
            settleTimeoutRef.current = null;
            followRef.current?.rotationX(0);
            followRef.current?.rotationY(0);
            innerFollowRef.current?.x(0);
            innerFollowRef.current?.y(0);
        }, SETTLE_DELAY);
    }, []);

    const hide = useCallback(() => {
        if (hideRafRef.current !== null) {
            cancelAnimationFrame(hideRafRef.current);
        }
        // A pending settle would fight the fade below (both write rotation),
        // and the fade already returns everything to neutral.
        if (settleTimeoutRef.current !== null) {
            clearTimeout(settleTimeoutRef.current);
            settleTimeoutRef.current = null;
        }

        hideRafRef.current = requestAnimationFrame(() => {
            hideRafRef.current = null;

            const panel = panelRef.current;
            if (!panel) return;

            gsap.to(panel, {
                autoAlpha: 0,
                scale: 0.96,
                rotationX: 0,
                rotationY: 0,
                clipPath: HIDDEN_CLIP,
                duration: HIDE_DURATION,
                ease: 'power2.in',
                overwrite: 'auto',
            });
        });
    }, []);

    return { attach, attachInner, show, move, hide, cancelHide };
};
