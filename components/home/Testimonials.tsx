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
const AUTOPLAY_MS = 5000;
const SLIDE_MS = 600;
// Minimum gap between wheel-driven steps so a continuous scroll advances the
// cards at a readable pace instead of one-and-done (or blasting through them).
const WHEEL_COOLDOWN_MS = 400;

// Extended track = [last CLONE cards] + [all cards] + [first CLONE cards].
const EXTENDED = [
    ...TESTIMONIALS.slice(TESTIMONIALS.length - CLONE),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, CLONE),
];

// Map a slide position in the extended track back to its real testimonial index
// (used for the active dot), so clones keep their identity.
const realIndexForSlide = (i: number): number => {
    const count = TESTIMONIALS.length;
    if (i < CLONE) return count - CLONE + i;
    if (i < CLONE + count) return i - CLONE;
    return i - CLONE - count;
};

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface TestimonialCardProps {
    testimonial: ITestimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
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

            {/* Signal-meter rating */}
            {testimonial.rating != null && (
                <div
                    className="mt-4 flex items-center gap-1"
                    aria-label={`${testimonial.rating} out of 5`}
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
                    <p className="font-anton uppercase text-body-sm truncate">
                        {testimonial.name}
                    </p>
                    <p className="font-mono text-ui-xs text-muted-foreground/70 tracking-wide truncate">
                        {testimonial.role}
                    </p>
                </div>
                {testimonial.linkedInUrl && (
                    <a
                        href={testimonial.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-muted-foreground/60 hover:text-primary transition-colors"
                        aria-label={`${testimonial.name} on LinkedIn`}
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
    const [active, setActive] = useState(CLONE);
    // Pause is derived from two independent reasons so neither clobbers the
    // other: hovering pauses autoplay, dragging pauses it too. A single boolean
    // broke this — a pointerup from a button/card click (or a drag release)
    // cleared the pause even while still hovering, so autoplay resumed mid-hover.
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isPaused = isHovering || isDragging;

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
                // Clamp one step into each clone buffer. The seam snap in the
                // slide effect maps the front-clone edge (CLONE-1) to the last
                // real card and the back-clone edge (CLONE+count) to the first
                // real card; going deeper would snap to a non-matching card and
                // flash, so we never let `active` wander past one clone deep.
                if (next > CLONE + count) return CLONE + count;
                if (next < CLONE - 1) return CLONE - 1;
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
        const isCloneEnd = active >= CLONE + count;
        const isCloneStart = active < CLONE;

        gsap.to(track, {
            x: -active * slideWidthRef.current,
            duration: reduce ? 0 : SLIDE_MS / 1000,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
                if (isCloneEnd) {
                    // index CLONE+count is a back-clone of card 0; jump to the
                    // real card 0 (index CLONE) at the same visual position.
                    setActive(CLONE);
                    gsap.set(track, { x: -CLONE * slideWidthRef.current });
                } else if (isCloneStart) {
                    // index CLONE-1 is a front-clone of the last card; jump to
                    // the real last card (index CLONE+count-1).
                    setActive(CLONE + count - 1);
                    gsap.set(track, {
                        x: -(CLONE + count - 1) * slideWidthRef.current,
                    });
                }
            },
        });
        // Kill any in-flight slide tween on unmount/re-run so it can't fire
        // onComplete (and setActive) on a detached node.
        return () => gsap.killTweensOf(track);
    }, [active, count]);

    // Auto-advance one step at a time, resetting the timer each slide. Pauses on
    // hover, and is disabled for reduced-motion / tiny screens (manual nav stays on).
    useEffect(() => {
        if (shouldSkipAnimation() || isPaused || count <= 1) return;
        const id = window.setInterval(() => {
            step(1);
        }, AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [active, isPaused, count, step]);

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
                            {EXTENDED.map((t, i) => (
                                <div
                                    key={i}
                                    className="w-full shrink-0 grow-0 basis-full px-3 sm:basis-1/2 lg:basis-1/3"
                                >
                                    <TestimonialCard testimonial={t} />
                                </div>
                            ))}
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

                        <div className="flex items-center gap-2.5">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActive(CLONE + i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    aria-current={
                                        i === currentReal ? 'true' : undefined
                                    }
                                    className={cn(
                                        'h-2.5 w-2.5 rounded-sm transition-all duration-300',
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
