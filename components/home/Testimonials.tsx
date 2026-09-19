'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import { TESTIMONIALS } from '@/lib/data';
import type { ITestimonial } from '@/types';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { cn, shouldSkipAnimation } from '@/lib/utils';
import { gsap } from '@/lib/gsap-setup';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Linkedin, Quote, User } from 'lucide-react';

// Cards visible per view: 1 on mobile, 2 on tablet, 3 on desktop. We clone this
// many cards on each end of the track so the slider loops seamlessly (no jump
// when it wraps from the last card back to the first).
// INVARIANT: CLONE must stay >= the max cards shown at any breakpoint. Keep it
// in sync with the `basis-*` classes on each slide below (basis-full / 1/2 / 1/3);
// if a breakpoint ever shows 4 cards, bump CLONE to 4 or the seam shows gaps.
const CLONE = 3;
// INVARIANT: CLONE is an upper bound, never an assumption. Each clone buffer
// eats one real card, so with fewer than CLONE + 1 testimonials the front and
// back buffers would overlap, `realIndexForSlide` would return negative
// indices, and no dot could ever be current. Clamping keeps the loop maths
// valid for any data length: 0 and 1 testimonials degrade to cloneCount 0 —
// a single real slide, no clones, and stepping becomes a no-op instead of
// addressing a slide the track never rendered.
const cloneCount = Math.min(CLONE, Math.max(0, TESTIMONIALS.length - 1));
const AUTOPLAY_MS = 5000;
const SLIDE_MS = 600;
// Minimum gap between wheel-driven steps so a continuous scroll advances the
// cards at a readable pace instead of one-and-done (or blasting through them).
const WHEEL_COOLDOWN_MS = 400;

// Extended track = [last cloneCount cards] + [all cards] + [first cloneCount cards].
const EXTENDED = [
    ...TESTIMONIALS.slice(TESTIMONIALS.length - cloneCount),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, cloneCount),
];

// Map a slide position in the extended track back to its real testimonial index
// (used for the active dot), so clones keep their identity.
const realIndexForSlide = (i: number): number => {
    const count = TESTIMONIALS.length;
    if (i < cloneCount) return count - cloneCount + i;
    if (i < cloneCount + count) return i - cloneCount;
    return i - cloneCount - count;
};

// Front clones occupy the first `cloneCount` rendered positions, back clones the
// last `cloneCount`; everything between is a real card. Derived from the
// position alone, so it can never go stale as `active` moves or re-renders.
const isClonePosition = (i: number): boolean =>
    i < cloneCount || i >= cloneCount + TESTIMONIALS.length;

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface TestimonialCardProps {
    testimonial: ITestimonial;
    /**
     * True for the loop's duplicate slides. They stay mouse-interactive (a
     * visible clone that ignored clicks read as broken) but drop out of the tab
     * order — which is also what keeps the ancestor `aria-hidden` legal, since
     * hiding an element that still contains focusable descendants is an ARIA
     * violation.
     */
    isClone?: boolean;
}

const TestimonialCard = ({
    testimonial,
    isClone,
}: TestimonialCardProps) => {
    return (
        <div className="testimonial-item group relative flex h-full flex-col bg-background-light border border-transparent rounded-tl-[10px] rounded-br-[10px] p-5 xs:p-6 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)]">
            {/* Diagonal corner brackets — same signature motif as ProjectCard and
               the nav buttons below (top-left + bottom-right, asymmetric radius). */}
            <span
                aria-hidden
                className="bracket-arm pointer-events-none absolute inset-0 border-t-2 border-l-2 border-primary/60 rounded-tl-[10px] [clip-path:inset(0_80%_60%_0)] group-hover:border-primary group-hover:[clip-path:inset(0)] transition-[clip-path,border-color] duration-300 ease-out"
            />
            <span
                aria-hidden
                className="bracket-arm pointer-events-none absolute inset-0 border-b-2 border-r-2 border-primary/60 rounded-br-[10px] [clip-path:inset(60%_0_0_80%)] group-hover:border-primary group-hover:[clip-path:inset(0)] transition-[clip-path,border-color] duration-300 delay-75 ease-out"
            />

            <Quote className="text-primary/50 mb-2 h-5 w-5" aria-hidden />
            <p className="text-body-sm sm:text-body-base text-muted-foreground leading-relaxed flex-1">
                {testimonial.quote}
            </p>

            {/* Signal-meter rating. `role="img"` is what makes the label stick
               (same trick as DurationBar) — an aria-label on a role-less div is
               dropped by most screen readers. */}
            {testimonial.rating != null && (
                <div
                    className="mt-4 flex items-center gap-1"
                    role="img"
                    aria-label={`Rating: ${testimonial.rating} out of 5`}
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                'h-1.5 w-3 sm:w-4',
                                // `?? 0` is a TS-only fallback: the outer
                                // `!= null` guard proves rating is defined at
                                // runtime, but narrowing doesn't follow into
                                // this .map closure.
                                i < (testimonial.rating ?? 0)
                                    ? 'bg-primary'
                                    : 'bg-muted',
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Author row */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
                <div className="relative h-11 w-11 flex-shrink-0 border border-primary/30 rounded-sm bg-background">
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-sm">
                        {testimonial.avatar ? (
                            <Image
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                                draggable={false}
                            />
                        ) : (
                            <User className="h-5 w-5 text-primary/70" aria-hidden />
                        )}
                    </div>
                    <span
                        aria-hidden
                        className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"
                    />
                    <span
                        aria-hidden
                        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"
                    />
                </div>
                <div className="min-w-0">
                    {testimonial.linkedInUrl ? (
                        <a
                            href={testimonial.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${testimonial.name} on LinkedIn`}
                            tabIndex={isClone ? -1 : undefined}
                            className="font-anton uppercase text-body-sm truncate block w-fit max-w-full transition-colors hover:text-primary underline decoration-primary/40 underline-offset-4 decoration-1 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
                        >
                            {testimonial.name}
                        </a>
                    ) : (
                        <p className="font-anton uppercase text-body-sm truncate">
                            {testimonial.name}
                        </p>
                    )}
                    <p className="font-mono text-ui-xs text-muted-foreground/70 tracking-wide truncate">
                        {testimonial.role}
                    </p>
                </div>
                {testimonial.linkedInUrl && (
                    // Shares its destination with the name link above, so the
                    // label has to differ or the card announces one link twice.
                    <a
                        href={testimonial.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-muted-foreground/60 hover:text-primary transition-colors"
                        aria-label={`Open ${testimonial.name}'s LinkedIn profile`}
                        tabIndex={isClone ? -1 : undefined}
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const count = TESTIMONIALS.length;
    // Start parked on the first real card (after the front clones).
    const [active, setActive] = useState(cloneCount);
    // Pause is derived from two independent reasons so neither clobbers the
    // other: hovering pauses autoplay, dragging pauses it too. A single boolean
    // broke this — a pointerup from a button/card click (or a drag release)
    // cleared the pause even while still hovering, so autoplay resumed mid-hover.
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isPaused = isHovering || isDragging;
    // Autoplay gates, deliberately separate from `isPaused` for the same reason
    // (hover and visibility must not clear each other). Both start false and are
    // seeded by the observer/visibility effect below, so the timer never runs
    // before we know the carousel is actually being looked at.
    const [isInView, setIsInView] = useState(false);
    const [isDocumentHidden, setIsDocumentHidden] = useState(false);

    // Refs read from GSAP callbacks / observers without retriggering effects.
    const activeRef = useRef(active);
    activeRef.current = active;
    const slideWidthRef = useRef(0);
    const firstRunRef = useRef(true);

    // Pointer-drag ("click-and-throw") + wheel-to-horizontal state. Mouse-only —
    // touch/pen keep native vertical scroll and use the buttons/dots instead.
    const scrollerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const dragEngagedRef = useRef(false); // locked to the horizontal axis this gesture
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const dragStartXTrackRef = useRef(0);
    const wheelLockRef = useRef(false);
    const wheelTimeoutRef = useRef<number | null>(null);

    const currentReal = realIndexForSlide(active);

    const step = useCallback(
        (delta: number) => {
            setActive((a) => {
                const next = a + delta;
                // With no clone buffer there is nothing to wrap into, so only
                // the real positions exist — and with a single real card,
                // stepping is a no-op. Without this guard `next` could address a
                // clone slot the track never rendered and the row would slide
                // into empty space.
                if (cloneCount === 0) {
                    return count <= 1
                        ? 0
                        : Math.min(Math.max(next, 0), count - 1);
                }
                // Clamp one step into each clone buffer. The seam snap in the
                // slide effect maps the front-clone edge (cloneCount-1) to the
                // last real card and the back-clone edge (cloneCount+count) to
                // the first real card; going deeper would snap to a
                // non-matching card and flash, so we never let `active` wander
                // past one clone deep.
                if (next > cloneCount + count) return cloneCount + count;
                if (next < cloneCount - 1) return cloneCount - 1;
                return next;
            });
        },
        [count],
    );

    // ── Horizontal swipe → step ─────────────────────────────────────────────
    // Only a HORIZONTAL gesture (trackpad two-finger left/right swipe, where
    // |deltaX| > |deltaY|) drives the carousel. Vertical wheel / trackpad
    // (up/down) is ignored here so the page still scrolls normally while the
    // cursor is over the cards — the carousel never traps vertical scrolling.
    // Window-capture + rect hit-test intercept before Lenis and only act over
    // the carousel itself. (Drag-to-move is handled separately below.)
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            // Vertical scroll (incl. a plain mouse wheel, which has deltaX 0)
            // → let the page scroll; do nothing.
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

            const el = scrollerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                return;
            }
            // Ignore tiny horizontal jitter (< 6px) from trackpads.
            if (Math.abs(e.deltaX) < 6) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            if (wheelLockRef.current) return;
            wheelLockRef.current = true;
            step(e.deltaX > 0 ? 1 : -1);
            wheelTimeoutRef.current = window.setTimeout(() => {
                wheelLockRef.current = false;
                wheelTimeoutRef.current = null;
            }, WHEEL_COOLDOWN_MS);
        };

        window.addEventListener('wheel', onWheel, {
            passive: false,
            capture: true,
        });
        return () => {
            window.removeEventListener('wheel', onWheel, { capture: true });
            if (wheelTimeoutRef.current !== null) {
                window.clearTimeout(wheelTimeoutRef.current);
                wheelTimeoutRef.current = null;
            }
        };
    }, [step]);

    // ── Drag / swipe → throw (mouse, touch, pen) ───────────────────────────
    // On touch we must not steal vertical scrolling: a vertical swipe bails so
    // the page scrolls normally (touch-action: pan-y also keeps native vertical
    // panning in the browser), and only a horizontal swipe engages the track.
    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        // Don't start a drag from interactive controls (buttons / LinkedIn link).
        if ((e.target as HTMLElement).closest('a, button')) return;
        const track = trackRef.current;
        if (!track) return;
        draggingRef.current = true;
        dragEngagedRef.current = false;
        dragStartXRef.current = e.clientX;
        dragStartYRef.current = e.clientY;
        // `|| 0` guards against NaN if the track's x was never set (it should
        // always be set by the layout effect, but be defensive).
        dragStartXTrackRef.current = Number(gsap.getProperty(track, 'x')) || 0;
        setIsDragging(true);
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return;
        const track = trackRef.current;
        if (!track) return;
        const dx = e.clientX - dragStartXRef.current;
        const dy = e.clientY - dragStartYRef.current;

        if (!dragEngagedRef.current) {
            // Wait for a clear commitment before locking the axis.
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dy) > Math.abs(dx)) {
                // Vertical gesture — release so the page can scroll.
                draggingRef.current = false;
                setIsDragging(false);
                return;
            }
            dragEngagedRef.current = true;
            // Capture now so we keep receiving moves even if the pointer leaves.
            e.currentTarget.setPointerCapture(e.pointerId);
        }

        e.preventDefault();
        // Live-follow the pointer; the slide effect snaps to a card on release.
        gsap.set(track, { x: dragStartXTrackRef.current + dx });
    };

    const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
        const engaged = dragEngagedRef.current;
        draggingRef.current = false;
        dragEngagedRef.current = false;
        setIsDragging(false);
        if (!engaged) return; // tap, vertical swipe, or a click on a button/card
        const track = trackRef.current;
        if (!track) return;
        const dx = e.clientX - dragStartXRef.current;
        // Throw if dragged past 25% of a slide, capped at 90px so very wide
        // viewports still need a deliberate swipe.
        const threshold = Math.min(90, slideWidthRef.current * 0.25);
        if (Math.abs(dx) > threshold) {
            step(dx < 0 ? 1 : -1);
        } else {
            // Not far enough — spring back to the current card.
            const reduce = shouldSkipAnimation();
            gsap.to(track, {
                x: -activeRef.current * slideWidthRef.current,
                duration: reduce ? 0 : 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
            });
        }
    };

    // Measure one slide's pixel width and keep the track aligned on resize.
    useIsoLayoutEffect(() => {
        const track = trackRef.current;
        const first = track?.firstElementChild as HTMLElement | null;
        if (!track || !first) return;

        const position = () => {
            const w = first.getBoundingClientRect().width;
            // Only reposition on a real width change — card content can change
            // the first slide's *height*, which would otherwise fire this and
            // snap the track mid-slide.
            if (w === slideWidthRef.current) return;
            slideWidthRef.current = w;
            gsap.set(track, { x: -activeRef.current * w });
        };
        position();

        const ro = new ResizeObserver(position);
        ro.observe(first);
        return () => ro.disconnect();
    }, []);

    // Glide the track by exactly one slide per step. GSAP owns the transform, so
    // a click never snaps/refreshes — the left card exits, a new one enters from
    // the right. On cloned edges we snap back to the real equivalent after the slide.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        if (slideWidthRef.current <= 0) return;

        if (firstRunRef.current) {
            // Initial position already set by the layout effect above.
            firstRunRef.current = false;
            return;
        }

        const reduce = shouldSkipAnimation();
        const isCloneEnd = active >= cloneCount + count;
        const isCloneStart = active < cloneCount;

        gsap.to(track, {
            x: -active * slideWidthRef.current,
            duration: reduce ? 0 : SLIDE_MS / 1000,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
                if (isCloneEnd) {
                    // index cloneCount+count is a back-clone of card 0; jump to
                    // the real card 0 (index cloneCount) at the same visual position.
                    setActive(cloneCount);
                    gsap.set(track, { x: -cloneCount * slideWidthRef.current });
                } else if (isCloneStart) {
                    // index cloneCount-1 is a front-clone of the last card; jump
                    // to the real last card (index cloneCount+count-1).
                    setActive(cloneCount + count - 1);
                    gsap.set(track, {
                        x: -(cloneCount + count - 1) * slideWidthRef.current,
                    });
                }
            },
        });
        // Kill any in-flight slide tween on unmount/re-run so it can't fire
        // onComplete (and setActive) on a detached node.
        return () => gsap.killTweensOf(track);
    }, [active, count]);

    // ── Autoplay visibility gates ───────────────────────────────────────────
    // There are two ways the carousel is not being looked at, and both must stop
    // the timer: it is scrolled out of the viewport (so it no longer advances
    // while the visitor reads another section), or the whole tab is in the
    // background (where a timer keeps firing for slides nobody can see). Plain
    // state, so flipping either gate back simply restarts the autoplay effect.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Seed from the live value: mounting into an already-hidden tab must not
        // leave the gate reading its initial `false`.
        setIsDocumentHidden(document.hidden);
        const onVisibilityChange = () => setIsDocumentHidden(document.hidden);
        document.addEventListener('visibilitychange', onVisibilityChange);

        // Default threshold (0) = intersecting at all, which is exactly the
        // "off-screen" question; `isInView` stays false until it first fires.
        const io = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        });
        io.observe(el);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            io.disconnect();
        };
    }, []);

    // Auto-advance one step at a time, resetting the timer each slide. Pauses on
    // hover, while the carousel is off-screen, and in a hidden tab, and is
    // disabled for reduced-motion / tiny screens (manual nav stays on). One
    // timeout per advance rather than an interval: each step re-runs this effect
    // anyway, and the cleanup then clears the pending tick when a gate flips.
    useEffect(() => {
        if (
            shouldSkipAnimation() ||
            isPaused ||
            !isInView ||
            isDocumentHidden ||
            count <= 1
        ) {
            return;
        }
        const id = window.setTimeout(() => step(1), AUTOPLAY_MS);
        return () => window.clearTimeout(id);
    }, [active, isPaused, isInView, isDocumentHidden, count, step]);

    useScrollExitAnimation({ containerRef });

    if (count === 0) return null;

    return (
        <section
            className="py-section"
            id="testimonials"
            aria-roledescription="carousel"
            aria-label="Testimonials"
        >
            <div className="container" ref={containerRef}>
                <SectionTitle title="Testimonials" />

                <div
                    ref={scrollerRef}
                    role="group"
                    aria-label="Testimonials carousel"
                    className="relative touch-pan-y"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                >
                    <div className="overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing select-none">
                        <div ref={trackRef} className="flex">
                            {EXTENDED.map((t, i) => {
                                // Clones are visual stand-ins for a real card, so
                                // they stay out of the a11y tree and the tab
                                // order — but deliberately NOT `inert`. With
                                // three cards on screen at `lg`, resting on the
                                // last real card leaves two visible clones, and
                                // `inert` would make those dead to the mouse
                                // while their hover styling still lit up, which
                                // reads as a broken card. Keeping them clickable
                                // and instead pushing their links to
                                // `tabIndex={-1}` (in TestimonialCard) satisfies
                                // both: no duplicate announcements, no focusable
                                // descendants under `aria-hidden`. Real slides
                                // keep their semantics and announce a position
                                // (APG carousel pattern), which a clone must not
                                // or the same slide is announced twice.
                                const isClone = isClonePosition(i);
                                return (
                                    <div
                                        key={i}
                                        aria-hidden={isClone || undefined}
                                        role={isClone ? undefined : 'group'}
                                        aria-roledescription={
                                            isClone ? undefined : 'slide'
                                        }
                                        aria-label={
                                            isClone
                                                ? undefined
                                                : `${realIndexForSlide(i) + 1} of ${count}`
                                        }
                                        className="w-full shrink-0 grow-0 basis-full px-3 sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <TestimonialCard
                                            testimonial={t}
                                            isClone={isClone}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls: prev / dots / next */}
                    <div className="mt-6 flex items-center justify-center gap-5">
                        <button
                            type="button"
                            onClick={() => step(-1)}
                            aria-label="Previous testimonial"
                            className="group flex h-10 w-10 items-center justify-center rounded-tl-[10px] rounded-br-[10px] border border-primary/40 bg-background-light/70 text-primary/80 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_18px_hsl(var(--primary)/0.4)]"
                        >
                            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        </button>

                        <div className="flex items-center gap-4">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActive(cloneCount + i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    aria-current={
                                        i === currentReal ? 'true' : undefined
                                    }
                                    className={cn(
                                        'relative h-2.5 w-2.5 rounded-sm transition-all duration-300',
                                        "after:absolute after:-inset-[7px] after:content-['']",
                                        i === currentReal
                                            ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]'
                                            : 'bg-muted hover:bg-primary/50',
                                    )}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => step(1)}
                            aria-label="Next testimonial"
                            className="group flex h-10 w-10 items-center justify-center rounded-tl-[10px] rounded-br-[10px] border border-primary/40 bg-background-light/70 text-primary/80 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_18px_hsl(var(--primary)/0.4)]"
                        >
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
