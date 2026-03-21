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
                        toggleActions: 'play none none reverse',
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
                    {Object.entries(MY_STACK).map(([key, value]) => (
                        <div className="grid sm:grid-cols-12 stack-category" key={key}>
                            <div className="sm:col-span-5 mb-4 xs:mb-6 sm:mb-0">
                                <p className={`category-title ${gradientTextClass} text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-none uppercase`}>
                                    {key}
                                </p>
                            </div>
                            <div className="sm:col-span-7 flex gap-x-4 xs:gap-x-6 md:gap-x-8 xl:gap-x-11 gap-y-4 xs:gap-y-6 md:gap-y-9 flex-wrap">
                                {value.map((item) => (
                                    <div
                                        className="category-item flex gap-2 xs:gap-3 md:gap-4 items-center leading-none"
                                        key={item.name}
                                    >
                                        <Image
                                            src={item.icon}
                                            alt={item.name}
                                            width="56"
                                            height="56"
                                            className="h-8 w-8 xs:h-10 xs:w-10 md:h-14 md:w-14 object-contain"
                                        />
                                        <span className="text-body-base sm:text-body-lg md:text-body-xl text-foreground capitalize">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
