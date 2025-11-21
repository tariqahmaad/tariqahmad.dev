'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import Image from 'next/image';
import React, { useRef } from 'react';

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const categories = containerRef.current?.querySelectorAll('.stack-category');

            if (!categories?.length) return;

            categories.forEach((category) => {
                const categoryTitle = category.querySelector('.category-title');
                const categoryItems = category.querySelectorAll('.category-item');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: category,
                        start: 'top 90%',
                        end: 'top 60%',
                        scrub: 1,
                    },
                });

                // Animate title first
                tl.from(categoryTitle, {
                    opacity: 0,
                    x: -50,
                    ease: 'power2.out',
                });

                // Then animate items with stagger
                tl.from(
                    categoryItems,
                    {
                        opacity: 0,
                        y: 30,
                        stagger: 0.08,
                        ease: 'power2.out',
                    },
                    '-=0.3',
                );
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({ containerRef });

    return (
        <section id="my-stack" ref={containerRef}>
            <div className="container">
                <SectionTitle title="My Stack" />

                <div className="space-y-20">
                    {Object.entries(MY_STACK).map(([key, value]) => (
                        <div className="grid sm:grid-cols-12 stack-category" key={key}>
                            <div className="sm:col-span-5">
                                <p className="category-title text-5xl font-anton leading-none text-muted-foreground uppercase">
                                    {key}
                                </p>
                            </div>
                            <div className="sm:col-span-7 flex gap-x-11 gap-y-9 flex-wrap">
                                {value.map((item) => (
                                    <div
                                        className="category-item flex gap-4 items-center leading-none"
                                        key={item.name}
                                    >
                                        <Image
                                            src={item.icon}
                                            alt={item.name}
                                            width="56"
                                            height="56"
                                            className="h-14 w-14 object-contain"
                                        />
                                        <span className="text-2xl capitalize">
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
