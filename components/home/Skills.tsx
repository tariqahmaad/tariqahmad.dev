'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { gradientTextClass, shouldSkipAnimation } from '@/lib/utils';
import Image from 'next/image';
import React, { useRef } from 'react';

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const categories = containerRef.current?.querySelectorAll('.stack-category');

            if (!categories?.length) return;

            const skipAnimation = shouldSkipAnimation();

            categories.forEach((category) => {
                const categoryTitle = category.querySelector('.category-title');
                const categoryItems = category.querySelectorAll('.category-item');

                // Skip animations on very small screens or if user prefers reduced motion
                if (skipAnimation) {
                    gsap.set([categoryTitle, categoryItems], { opacity: 1, x: 0, y: 0 });
                    return;
                }

                // Set initial state immediately (prevents race condition with ScrollTrigger)
                gsap.set(categoryTitle, { opacity: 0, x: -20 });
                gsap.set(categoryItems, { opacity: 0, y: 20 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: category,
                        start: 'top 95%', // Trigger earlier for quicker reveal
                        // 'reverse' re-hides the chips on scroll-up, which reads
                        // as flicker — see the note in Experiences.tsx.
                        toggleActions: 'play none none none',
                    },
                });

                // Animate title first
                tl.to(categoryTitle, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                });

                // Then animate items with stagger
                tl.to(
                    categoryItems,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({ containerRef });

    return (
        <section id="my-stack" className="py-section">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Stack" />

                <div className="space-y-8 xs:space-y-12 md:space-y-20">
                    {/* `sm:gap-[25px]` replaces the old global
                        `.grid { gap: 25px }` override, which was removed
                        because it silently restyled every grid. */}
                    {Object.entries(MY_STACK).map(([key, value]) => (
                        <div
                            className="grid sm:grid-cols-12 sm:gap-[25px] stack-category"
                            key={key}
                        >
                            <div className="sm:col-span-5 mb-4 xs:mb-6 sm:mb-0">
                                <h3 className={`category-title ${gradientTextClass} text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-none uppercase`}>
                                    {key}
                                </h3>
                            </div>
                            {/* A list, not divs: the chips are one group of peers per
                                category, so assistive tech should announce how many
                                there are. `ul`/`li` are preflight-reset, so the flex
                                layout and spacing are unchanged. */}
                            <ul className="sm:col-span-7 flex gap-x-4 xs:gap-x-6 md:gap-x-8 xl:gap-x-11 gap-y-4 xs:gap-y-6 md:gap-y-9 flex-wrap">
                                {value.map((item) => (
                                    <li
                                        className="category-item group/item flex gap-2 xs:gap-3 md:gap-4 items-center leading-none"
                                        key={`${key}-${item.name}`}
                                    >
                                        <div className="relative flex items-center justify-center h-10 w-10 xs:h-12 xs:w-12 md:h-14 md:w-14 border border-foreground/10 bg-background-light/40 transition-colors duration-300 group-hover/item:border-primary/50">
                                            {/* Decorative: the name is announced by the text beside it. */}
                                            <Image
                                                src={item.icon}
                                                alt=""
                                                width={56}
                                                height={56}
                                                sizes="56px"
                                                className="h-7 w-7 xs:h-9 xs:w-9 md:h-11 md:w-11 object-contain transition-transform duration-300 group-hover/item:scale-110"
                                            />
                                            <span aria-hidden className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-primary/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <span className="text-body-base sm:text-body-lg md:text-body-xl text-foreground/90 font-mono lowercase tracking-wide transition-colors duration-300 group-hover/item:text-primary">
                                            {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
