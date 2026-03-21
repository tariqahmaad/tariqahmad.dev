'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { IExperience } from '@/types';
import { useRef } from 'react';
import DurationBar from './DurationBar';

interface TimelineItemProps {
    experience: IExperience;
    index: number;
    isLast: boolean;
}

const TimelineItem = ({ experience, index, isLast }: TimelineItemProps) => {
    return (
        <div className="timeline-item relative flex gap-6 pb-5 md:pb-6">
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
                {/* Dot with pulse ring layers */}
                <div
                    className={`timeline-dot relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 mt-2 bg-background border-muted-foreground ${experience.highlighted ? 'timeline-dot-current' : ''}`}
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
            <div className="flex-1 experience-card group relative flex flex-col p-5 sm:p-6 bg-background-light border border-transparent rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.08)]">
                {/* Header row: Title/Company on left, Date on right */}
                <div className="flex items-start justify-between gap-4 mb-2.5">
                    <div>
                        <h3 className="font-anton text-body-xl sm:text-heading-sm text-primary leading-tight mb-1.5">
                            {experience.title}
                        </h3>
                        <p className="text-body-sm sm:text-body-base text-foreground">
                            {experience.company}
                        </p>
                    </div>
                </div>

                {/* Duration Bar */}
                <DurationBar
                    startDate={experience.startDate}
                    endDate={experience.endDate}
                    isHighlighted={experience.highlighted}
                    className="mb-2.5"
                />

                {/* Description */}
                {experience.description && (
                    <p className="text-body-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {experience.description}
                    </p>
                )}

                {/* Hover corner accents */}
                {(['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map((pos) => (
                    <div key={pos} className={`absolute ${pos} w-6 h-6 border-transparent group-hover:border-primary/70 transition-colors duration-300`} />
                ))}
            </div>
        </div>
    );
};

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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
                });
                gsap.set('.timeline-line-fill', { height: '100%' });
                gsap.set('.duration-bar-fill', { width: '100%' });
                return;
            }

            const items = gsap.utils.toArray<HTMLElement>('.timeline-item');
            const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

            items.forEach((item, index) => {
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
                            toggleActions: 'play none none reverse',
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
            const durationBarFills = gsap.utils.toArray<HTMLElement>(
                '.duration-bar-fill',
            );

            const addPulseAnimation = (
                tl: gsap.core.Timeline,
                dot: HTMLElement,
                lineFill?: HTMLElement,
                durationBarFill?: HTMLElement,
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

                // 1. Dot activates — border turns green, gains glow
                tl.to(dot, {
                    borderColor: primaryColor,
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

                // 5. Duration bar fills from left to right
                if (durationBarFill) {
                    tl.to(
                        durationBarFill,
                        {
                            width: '100%',
                            duration: 0.5,
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
                        toggleActions: 'play none none reverse',
                    },
                });

                orderedIndexes.forEach((index) => {
                    const dot = dots[index];
                    const lineFill = lineFills[index] as
                        | HTMLElement
                        | undefined;
                    const durationBarFill = durationBarFills[index] as
                        | HTMLElement
                        | undefined;

                    if (!dot) return;

                    addPulseAnimation(masterTimeline, dot, lineFill, durationBarFill);
                });
            } else {
                // Mobile: keep one-by-one item triggers.
                dots.forEach((dot, i) => {
                    const lineFill = lineFills[i] as HTMLElement | undefined;
                    const durationBarFill = durationBarFills[i] as HTMLElement | undefined;
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: dot,
                            start: 'top 82%',
                            toggleActions: 'play none none reverse',
                        },
                    });

                    addPulseAnimation(tl, dot, lineFill, durationBarFill);
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

                {/* Timeline - 2 columns on desktop, flows column-by-column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:grid-flow-col !gap-x-10 !gap-y-0 mx-auto">
                    {MY_EXPERIENCE.map((experience, index) => (
                        <TimelineItem
                            key={`${experience.title}-${index}`}
                            experience={experience}
                            index={index}
                            isLast={index === MY_EXPERIENCE.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experiences;
