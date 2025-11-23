'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { useRef } from 'react';

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Check if user prefers reduced motion or screen is very small
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isVerySmallScreen = window.innerWidth < 400;

            if (isVerySmallScreen || prefersReducedMotion) {
                // Set elements to visible immediately on small screens or reduced motion
                gsap.set('.experience-item', { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.from('.experience-item', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({
        containerRef,
    });

    return (
        <section className="py-section" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Experience" />

                <div className="grid gap-8 xs:gap-10 md:gap-14">
                    {MY_EXPERIENCE.map((item) => (
                        <div key={item.title} className="experience-item">
                            <p className="text-body-lg sm:text-body-xl text-muted-foreground">
                                {item.company}
                            </p>
                            <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-none mt-3.5 mb-2.5">
                                {item.title}
                            </p>
                            <p className="text-body-base sm:text-body-lg text-muted-foreground">
                                {item.duration}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experiences;
