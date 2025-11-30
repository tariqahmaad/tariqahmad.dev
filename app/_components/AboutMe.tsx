'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import Image from 'next/image';
import React from 'react';

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Check if user prefers reduced motion or screen is very small
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;
            const isVerySmallScreen = window.innerWidth < 400;

            if (isVerySmallScreen || prefersReducedMotion) {
                // Set elements to visible immediately on small screens or reduced motion
                gsap.set('.slide-up-and-fade', { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 85%',
                    toggleActions: 'play none play reverse',
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out',
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            // Skip exit animations on very small screens or reduced motion
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;
            const isVerySmallScreen = window.innerWidth < 400;
            if (isVerySmallScreen || prefersReducedMotion) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-thin mb-8 xs:mb-12 md:mb-20 slide-up-and-fade leading-tight">
                    I believe in building robust and efficient software
                    solutions that solve real-world problems through innovative
                    technology and modern development practices.
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade text-body-base">
                    About me.
                </p>

                <div className="grid md:grid-cols-12 mt-6 xs:mt-9 gap-y-8 md:gap-12 items-start">
                    <div className="md:col-span-5 mb-6 md:mb-0 flex flex-col items-center text-center md:items-end md:text-right">
                        <p className="text-heading-sm sm:text-heading-md md:text-heading-lg slide-up-and-fade">
                            Hi, I&apos;m Tariq Ahmad.
                        </p>
                        <div className="mt-6 flex justify-center md:justify-end w-full">
                            <div className="relative w-full max-w-[320px] sm:max-w-[350px] md:max-w-[380px] aspect-square group">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                                <Image
                                    src="/personal/profile.jpg"
                                    alt="Tariq Ahmad"
                                    fill
                                    className="object-cover rounded-2xl border border-primary/10 shadow-xl transition-all duration-500 z-10 group-hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 flex flex-col justify-center">
                        <div className="text-body-lg sm:text-body-xl text-muted-foreground max-w-[450px] md:max-w-none">
                            <p className="slide-up-and-fade">
                                I&apos;m a Computer Engineering graduate from
                                Istanbul Aydin University with a solid grounding
                                in software development, networking, and web
                                technologies. Proven success in managing complex
                                projects and enhancing system performance
                                through innovative solutions. Graduated in July
                                2025 with a CGPA of 3.36/4.0.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                My experience spans full-stack development,
                                research assistance in Industry 4.0
                                technologies, and hands-on work in network
                                infrastructure. I excel in strategic
                                problem-solving, team collaboration, and
                                leadership—consistently delivering projects on
                                time while maintaining high quality standards.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                Fluent in English, native in Dari, and
                                conversational in Hindi, I bring strong
                                cross-cultural communication skills alongside
                                technical expertise in C, C++, Java, Python, and
                                modern web frameworks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
