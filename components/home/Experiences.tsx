'use client';

import SectionTitle from '@/components/shared/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { useRef } from 'react';
import { IExperience } from '@/types';

const typeColors: Record<IExperience['type'], string> = {
    'Full-time': 'text-primary',
    'Part-time': 'text-secondary',
    'Internship': 'text-muted-foreground',
    'Contract': 'text-accent-foreground',
};

interface TimelineItemProps {
    experience: IExperience;
    index: number;
    isLast: boolean;
}

const TimelineItem = ({ experience, index, isLast }: TimelineItemProps) => {
    return (
        <div className={`timeline-item relative flex gap-6 ${isLast ? '' : 'pb-5 md:pb-6'}`}>
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
                {/* Dot */}
                <div className="relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 mt-2 bg-background border-muted-foreground">
                </div>
                {/* Line */}
                {!isLast && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                )}
            </div>

            {/* Content card */}
            <div className="flex-1 experience-card group relative p-5 sm:p-6 bg-background-light border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,0,0.08)] -mt-1">
                {/* Header row: Date + Type */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs sm:text-body-sm font-medium px-2.5 py-1 rounded-full border bg-muted/30 text-muted-foreground border-border">
                        {experience.duration}
                    </span>
                    <span className={`text-xs sm:text-body-sm font-medium ${typeColors[experience.type]}`}>
                        {experience.type}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-anton text-body-xl sm:text-heading-sm text-primary leading-tight mb-1.5">
                    {experience.title}
                </h3>

                {/* Company */}
                <p className="text-body-sm sm:text-body-base text-foreground mb-2.5">
                    {experience.company}
                </p>

                {/* Description */}
                {experience.description && (
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                        {experience.description}
                    </p>
                )}

                {/* Hover corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-transparent group-hover:border-primary/40 transition-colors duration-300" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-transparent group-hover:border-primary/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-transparent group-hover:border-primary/40 transition-colors duration-300" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-transparent group-hover:border-primary/40 transition-colors duration-300" />
            </div>
        </div>
    );
};

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                gsap.set('.timeline-item', { opacity: 1, x: 0 });
                return;
            }

            const items = gsap.utils.toArray<HTMLElement>('.timeline-item');

            items.forEach((item, index) => {
                gsap.fromTo(item,
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
                    }
                );
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({
        containerRef,
    });

    return (
        <section className="py-section relative overflow-hidden" id="my-experience">
            <div className="container relative z-10" ref={containerRef}>
                <SectionTitle title="My Experience" />

                {/* Timeline - 2 columns on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0 mx-auto">
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
