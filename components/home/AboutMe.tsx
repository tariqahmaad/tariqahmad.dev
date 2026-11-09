'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import SectionTitle from '@/components/shared/SectionTitle';
import { ABOUT_ME } from '@/lib/data';
import { shouldSkipAnimation } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (shouldSkipAnimation()) {
                // Set elements to visible immediately on small screens or reduced motion
                gsap.set('.slide-up-and-fade', { opacity: 1, y: 0 });
                return;
            }

            gsap.from('.slide-up-and-fade', {
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out',
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton mb-8 xs:mb-12 md:mb-20 slide-up-and-fade leading-tight">
                    {ABOUT_ME.tagline}
                </h2>

                <SectionTitle title="ABOUT ME" className="slide-up-and-fade" />

                {/* Text column keeps its original width (400px md / 540px lg /
                    612px xl). The 48px gutter is trimmed to 32px and every
                    saved pixel goes to the portrait, which fills its column
                    edge to edge with no inset. */}
                <div className="grid gap-y-8 md:grid-cols-[272px_minmax(0,1fr)] md:gap-x-8 lg:grid-cols-[388px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)] items-start xl:items-end">
                    <div className="mb-6 md:mb-0 flex flex-col items-center text-center md:items-end md:text-right">
                        <p className="slide-up-and-fade font-mono uppercase tracking-[0.25em] text-primary/70 text-body-sm sm:text-body-base">
                            {'// behind the code'}
                        </p>
                        <div className="mt-6 flex w-full justify-center md:justify-end">
                            <div className="slide-up-and-fade relative w-full max-w-[320px] sm:max-w-[350px] md:max-w-none aspect-square group">
                                {/* Neon halo on hover */}
                                <div className="absolute -inset-2 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                                <Image
                                    src="/personal/profile.jpg"
                                    alt="Tariq Ahmad"
                                    fill
                                    sizes="(min-width: 1280px) 440px, (min-width: 1024px) 388px, (min-width: 768px) 272px, (min-width: 640px) 350px, 320px"
                                    className="object-cover rounded-none border border-primary/30 transition-all duration-500 z-10 group-hover:border-primary/70 group-hover:shadow-[0_0_40px_-5px_rgba(0,255,0,0.45)]"
                                />
                                {/* Corner brackets */}
                                <span aria-hidden className="pointer-events-none absolute top-0 left-0 z-20 w-6 h-6 border-t-2 border-l-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 z-20 w-6 h-6 border-b-2 border-r-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {/* Status badge */}
                        <div className="slide-up-and-fade flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 bg-primary/[0.06] rounded-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                </span>
                                <span className="font-mono text-ui-sm uppercase tracking-wider text-primary/90">
                                    {ABOUT_ME.currently}
                                </span>
                            </span>
                        </div>

                        <div className="text-body-lg sm:text-body-xl text-muted-foreground max-w-[450px] md:max-w-none">
                            {ABOUT_ME.bio.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className={`slide-up-and-fade${i > 0 ? ' mt-3' : ''}`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
