'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { cn, scrollToSection } from '@/lib/utils';
import { IExperience } from '@/types';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import DurationBar from './DurationBar';

/* ── Tenure math (union of ISO month ranges, inclusive) ────────────────── */

const monthIndex = (iso: string): number => {
    const [y, m] = iso.split('-').map(Number);
    return y * 12 + (m - 1);
};

const currentMonthIndex = (): number => {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
};

const tenureMonths = (startISO: string, endISO: string | null): number =>
    (endISO ? monthIndex(endISO) : currentMonthIndex()) -
    monthIndex(startISO) +
    1;

const formatTenure = (months: number): string => {
    if (months < 12) return `${months} MO`;
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m === 0 ? `${y} YR` : `${y} YR ${m} MO`;
};

/* ── Corner brackets (signature motif) ───────────────────────────────────
   Diagonal brackets that draw inward on hover. `forced` (dot hover) pins
   them open without relying on group-hover. */
const CornerBrackets = ({ forced }: { forced: boolean }) => (
    <>
        <span
            aria-hidden="true"
            className={cn(
                'bracket-arm pointer-events-none absolute inset-0 border-t-2 border-l-2 rounded-tl-[10px] transition-[clip-path,border-color] duration-300 ease-out',
                forced
                    ? 'border-primary [clip-path:inset(0)]'
                    : 'border-primary/60 [clip-path:inset(0_80%_60%_0)] group-hover:border-primary group-hover:[clip-path:inset(0)]'
            )}
        />
        <span
            aria-hidden="true"
            className={cn(
                'bracket-arm pointer-events-none absolute inset-0 border-b-2 border-r-2 rounded-br-[10px] transition-[clip-path,border-color] duration-300 delay-75 ease-out',
                forced
                    ? 'border-primary [clip-path:inset(0)]'
                    : 'border-primary/60 [clip-path:inset(60%_0_0_80%)] group-hover:border-primary group-hover:[clip-path:inset(0)]'
            )}
        />
    </>
);

/* ── Timeline item ─────────────────────────────────────────────────────── */

interface TimelineItemProps {
    experience: IExperience;
    index: number;
    isLast: boolean;
    expanded: boolean;
    hovered: boolean;
    onToggle: () => void;
    onHover: (on: boolean) => void;
    cardRef: (el: HTMLDivElement | null) => void;
}

const TimelineItem = ({
    experience,
    index,
    isLast,
    expanded,
    hovered,
    onToggle,
    onHover,
    cardRef,
}: TimelineItemProps) => {
    const hasDetails =
        (experience.highlights?.length ?? 0) > 0 ||
        (experience.skills?.length ?? 0) > 0;

    const handleSpotlight = (e: ReactMouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    return (
        <li
            className="timeline-item relative flex gap-6 pb-5 md:pb-6"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center" aria-hidden="true">
                {/* Dot with pulse ring layers */}
                <div
                    className={cn(
                        'timeline-dot relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 mt-2 bg-background border-muted-foreground',
                        experience.highlighted && 'timeline-dot-current',
                        hovered && 'timeline-dot-hover'
                    )}
                >
                    {/* Pulse ring - expands outward on scroll activation */}
                    <span className="timeline-pulse-ring absolute -inset-1 rounded-full border-2 border-primary opacity-0 pointer-events-none" />
                    {/* Second ring - delayed, larger radius */}
                    <span className="timeline-pulse-ring-2 absolute -inset-2 rounded-full border border-primary/50 opacity-0 pointer-events-none" />
                </div>
                {/* Line with animated fill */}
                {!isLast && (
                    <div className="relative w-0.5 flex-1 bg-border mt-2 overflow-hidden rounded-full">
                        <div className="timeline-line-fill absolute inset-x-0 top-0 h-0 bg-gradient-to-b from-primary via-primary/50 to-primary/20 rounded-full" />
                    </div>
                )}
                {/* Spacer so last item's timeline column matches siblings */}
                {isLast && <div className="w-0.5 flex-1 mt-2" />}
            </div>

            {/* Content card */}
            <div
                ref={cardRef}
                className={cn(
                    'flex-1 experience-card group relative flex flex-col p-5 sm:p-6 bg-background-light border border-transparent rounded-tl-[10px] rounded-br-[10px] transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)]',
                    experience.highlighted && 'experience-card-highlighted',
                    hovered && 'shadow-[0_0_24px_hsl(var(--primary)/0.12)]'
                )}
                onMouseMove={handleSpotlight}
            >
                <CornerBrackets forced={hovered} />
                {/* Header: title + company */}
                <div className="mb-2.5">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                        <h3 className="font-anton text-body-xl sm:text-heading-sm text-primary leading-tight">
                            {experience.title}
                        </h3>
                    </div>
                    <p className="text-body-sm sm:text-body-base text-foreground">
                        {experience.company}
                    </p>
                </div>

                {/* Duration Bar */}
                <DurationBar
                    startDate={experience.startDate}
                    endDate={experience.endDate}
                    startISO={experience.startISO}
                    endISO={experience.endISO}
                    isHighlighted={experience.highlighted}
                    totalMonths={tenureMonths(
                        experience.startISO,
                        experience.endISO
                    )}
                    className="mb-2.5"
                />

                {/* Description */}
                {experience.description && (
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                        {experience.description}
                    </p>
                )}

                {/* Expandable details */}
                {hasDetails && (
                    <div
                        className={cn(
                            'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                            expanded
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0'
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="pt-4 space-y-4">
                                {experience.highlights &&
                                    experience.highlights.length > 0 && (
                                        <ul className="space-y-1.5">
                                            {experience.highlights.map((h) => (
                                                <li
                                                    key={h}
                                                    className="flex gap-2 text-body-sm text-muted-foreground leading-relaxed"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="text-primary font-mono flex-shrink-0"
                                                    >
                                                        ▸
                                                    </span>
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                {experience.skills &&
                                    experience.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {experience.skills.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() =>
                                                        scrollToSection('my-stack')
                                                    }
                                                    title="Jump to My Stack"
                                                    className="font-mono text-ui-sm px-2 py-1 border border-primary/25 text-primary/80 hover:text-primary hover:border-primary/60 hover:bg-primary/[0.06] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer: details toggle + tenure */}
                <div className="mt-4 flex items-center justify-between gap-3">
                    {hasDetails ? (
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-expanded={expanded}
                            aria-label={`${expanded ? 'Hide' : 'Show'} details for ${experience.title}`}
                            className="font-mono text-ui-sm tracking-[0.2em] text-primary/70 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
                        >
                            {expanded ? '− CLOSE' : '+ DETAILS'}
                        </button>
                    ) : (
                        <span />
                    )}
                    <span className="font-mono text-ui-sm text-muted-foreground/70 tracking-[0.2em]">
                        {formatTenure(
                            tenureMonths(
                                experience.startISO,
                                experience.endISO
                            )
                        )}
                    </span>
                </div>

                {/* Bottom hover corner accents */}
                {(['bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map((pos) => (
                    <div key={pos} className={`absolute ${pos} w-6 h-6 border-transparent group-hover:border-primary/70 transition-colors duration-300 pointer-events-none`} />
                ))}
            </div>
        </li>
    );
};

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleToggle = (i: number) => {
        setExpandedIndex((prev) => (prev === i ? null : i));
    };

    // Split once: two independent columns on desktop (an expanding card
    // only ever grows its own column), one continuous list on mobile.
    // Global indexes keep expanded/hover state and animation order stable.
    const mid = Math.ceil(MY_EXPERIENCE.length / 2);
    const renderItem = (experience: IExperience, index: number) => (
        <TimelineItem
            key={`${experience.title}-${index}`}
            experience={experience}
            index={index}
            isLast={index === MY_EXPERIENCE.length - 1}
            expanded={expandedIndex === index}
            hovered={hoveredIndex === index}
            onToggle={() => handleToggle(index)}
            onHover={(on) => setHoveredIndex(on ? index : null)}
            cardRef={(el) => {
                cardRefs.current[index] = el;
            }}
        />
    );

    // Row-pair match-height (desktop only): cards sharing a visual row get
    // equal heights so the columns read as pairs. The expanded pair is
    // always skipped, so neighbors never stretch with an open card. Mobile
    // stays natural height. Measured only at rest — never mid-transition.
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const equalizeRef = useRef(() => {});
    equalizeRef.current = () => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const pairCount = Math.ceil(MY_EXPERIENCE.length / 2);
        const cards = cardRefs.current;
        if (!mq.matches) {
            cards.forEach((c) => c && (c.style.minHeight = ''));
            return;
        }
        for (let r = 0; r < pairCount; r++) {
            const a = cards[r];
            const b = cards[r + pairCount];
            if (!a || !b) continue;

            const aExpanded = expandedIndex === r;
            const bExpanded = expandedIndex === r + pairCount;

            if (aExpanded || bExpanded) {
                // Only release the OPEN card's min-height. Clearing the partner's
                // as well shrank it to its natural height, which reflowed the
                // whole opposite column every time a card was opened.
                if (aExpanded) a.style.minHeight = '';
                if (bExpanded) b.style.minHeight = '';
                continue;
            }

            // Measure both at natural height, then pin the pair to the taller so
            // their timeline dots stay level across the two columns.
            a.style.minHeight = '';
            b.style.minHeight = '';
            const h = Math.max(a.offsetHeight, b.offsetHeight);
            a.style.minHeight = `${h}px`;
            b.style.minHeight = `${h}px`;
        }
        ScrollTrigger.refresh();
    };

    // Mount: measure at rest, then re-pass after reveal/fonts settle.
    useEffect(() => {
        const run = () => equalizeRef.current();
        run();
        const f = setTimeout(run, 1000);
        window.addEventListener('resize', run);
        if (document.fonts) {
            document.fonts.ready.then(run).catch(() => {});
        }
        return () => {
            clearTimeout(f);
            window.removeEventListener('resize', run);
        };
    }, []);

    // Toggle: measure only after the 300ms expand/collapse transition lands.
    // Measuring mid-transition reads ghost heights and stretches the neighbor.
    useEffect(() => {
        const t = setTimeout(() => equalizeRef.current(), 380);
        return () => clearTimeout(t);
    }, [expandedIndex]);

    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            const primaryColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()})`;

            if (prefersReducedMotion) {
                gsap.set('.timeline-item', { opacity: 1, x: 0 });
                gsap.set('.timeline-dot', {
                    borderColor: primaryColor,
                    backgroundColor: primaryColor,
                });
                gsap.set('.timeline-line-fill', { height: '100%' });
                gsap.set('.duration-tick', {
                    opacity: 1,
                    backgroundColor: primaryColor,
                    boxShadow: 'none',
                });
                return;
            }

            const items = gsap.utils.toArray<HTMLElement>('.timeline-item');
            const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

            items.forEach((item, index) => {
                // Reveal once and stay revealed. A reversible ('... reverse')
                // tween is poison here: expanding a card shifts layout, the
                // post-toggle ScrollTrigger.refresh() moves trigger starts
                // below the current scroll, and innocent cards in both columns
                // snap back to hidden then pop in again — the flicker.
                gsap.fromTo(
                    item,
                    {
                        opacity: 0,
                        x: -30,
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                        delay: index * 0.06,
                    },
                );
            });

            // Timeline pulse animation — cascading dot activation + line fill
            const dots = gsap.utils.toArray<HTMLElement>('.timeline-dot');
            const lineFills = gsap.utils.toArray<HTMLElement>(
                '.timeline-line-fill',
            );
            // Month ticks, grouped per card (variable counts) for staggered ignition.
            const tickGroups: HTMLElement[][] = items.map((item) =>
                Array.from(item.querySelectorAll<HTMLElement>('.duration-tick'))
            );

            const addPulseAnimation = (
                tl: gsap.core.Timeline,
                dot: HTMLElement,
                lineFill?: HTMLElement,
                ticks?: HTMLElement[],
            ) => {
                const pulseRing = dot.querySelector(
                    '.timeline-pulse-ring',
                ) as HTMLElement | null;
                const pulseRing2 = dot.querySelector(
                    '.timeline-pulse-ring-2',
                ) as HTMLElement | null;

                // Mark active so current-role ring starts only after pulse begins.
                tl.call(() => {
                    dot.classList.add('timeline-dot-active');
                });

                // 1. Dot activates — border turns green, background fills green, gains glow
                tl.to(dot, {
                    borderColor: primaryColor,
                    backgroundColor: primaryColor,
                    boxShadow:
                        '0 0 16px rgba(0,255,0,0.7), 0 0 30px rgba(0,255,0,0.2)',
                    scale: 1.25,
                    duration: 0.45,
                    ease: 'power2.out',
                });
                tl.to(dot, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                });

                // 2. Primary pulse ring expands outward
                if (pulseRing) {
                    tl.fromTo(
                        pulseRing,
                        { scale: 1, opacity: 0.8 },
                        {
                            scale: 2.8,
                            opacity: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                        },
                        '-=0.3',
                    );
                }

                // 3. Secondary ring — slightly delayed, wider spread
                if (pulseRing2) {
                    tl.fromTo(
                        pulseRing2,
                        { scale: 1, opacity: 0.4 },
                        {
                            scale: 3.8,
                            opacity: 0,
                            duration: 0.85,
                            ease: 'power2.out',
                        },
                        '-=0.6',
                    );
                }

                // 4. Connecting line fills downward with green energy
                if (lineFill) {
                    tl.to(
                        lineFill,
                        {
                            height: '100%',
                            duration: 0.6,
                            ease: 'power2.inOut',
                        },
                        '-=0.5',
                    );
                }

                // 5. Month ticks ignite left-to-right with stagger
                if (ticks && ticks.length > 0) {
                    tl.to(
                        ticks,
                        {
                            opacity: 1,
                            backgroundColor: primaryColor,
                            boxShadow:
                                '0 0 6px rgba(0,255,0,0.5)',
                            duration: 0.25,
                            stagger: 0.05,
                            ease: 'power2.out',
                        },
                        '-=0.4',
                    );
                }
            };

            if (isDesktop) {
                // Desktop: column-by-column order with grid-flow-col
                // First half = left column, Second half = right column
                const halfLength = Math.ceil(dots.length / 2);
                const leftColumnIndexes = Array.from({ length: halfLength }, (_, i) => i);
                const rightColumnIndexes = Array.from({ length: dots.length - halfLength }, (_, i) => i + halfLength);
                const orderedIndexes = [...leftColumnIndexes, ...rightColumnIndexes];

                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current ?? items[0],
                        start: 'top 75%',
                        toggleActions: 'play none none none',
                    },
                });

                orderedIndexes.forEach((index) => {
                    const dot = dots[index];
                    const lineFill = lineFills[index] as
                        | HTMLElement
                        | undefined;
                    const ticks = tickGroups[index] ?? [];

                    if (!dot) return;

                    addPulseAnimation(masterTimeline, dot, lineFill, ticks);
                });
            } else {
                // Mobile: keep one-by-one item triggers.
                dots.forEach((dot, i) => {
                    const lineFill = lineFills[i] as HTMLElement | undefined;
                    const ticks = tickGroups[i] ?? [];
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: dot,
                            start: 'top 82%',
                            toggleActions: 'play none none none',
                        },
                    });

                    addPulseAnimation(tl, dot, lineFill, ticks);
                });
            }

            // Continuous breathing glow on the highlighted (current) role
            const currentDots = gsap.utils.toArray<HTMLElement>(
                '.timeline-dot-current',
            );
            currentDots.forEach((dot) => {
                gsap.to(dot, {
                    boxShadow:
                        '0 0 16px rgba(0,255,0,0.7), 0 0 32px rgba(0,255,0,0.25)',
                    duration: 1.5,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    scrollTrigger: {
                        trigger: dot,
                        start: 'top 82%',
                        toggleActions: 'play pause resume pause',
                    },
                });
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({
        containerRef,
    });

    return (
        <section
            className="py-section relative overflow-hidden"
            id="my-experience"
        >
            <div className="container relative z-10" ref={containerRef}>
                <SectionTitle title="My Experience" />

                {/* Temporal anchor: the rail starts here and runs down through
                    every dot to the last role. Labelled "LATEST ROLE" — no role
                    is ongoing (the newest ended 2025-07), so a pulsing
                    "PRESENT DAY" marker would be factually wrong. */}
                <div aria-hidden="true" className="mb-[-8px] ml-[2px]">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                        </span>
                        <span className="font-mono text-ui-sm tracking-[0.3em] text-primary/70">
                            LATEST ROLE
                        </span>
                    </div>
                    {/* Connector stub into the first dot (slides underneath it) */}
                    <div className="w-0.5 h-10 bg-border ml-[5px] mt-2" />
                </div>

                {/* Timeline - one continuous list on mobile, two independent
                    columns on desktop so an expanding card never stretches
                    its neighbor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 lg:items-start mx-auto">
                    <ul aria-label="Recent roles">
                        {MY_EXPERIENCE.slice(0, mid).map((experience, i) =>
                            renderItem(experience, i)
                        )}
                    </ul>
                    <ul aria-label="Earlier roles">
                        {MY_EXPERIENCE.slice(mid).map((experience, i) =>
                            renderItem(experience, i + mid)
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
