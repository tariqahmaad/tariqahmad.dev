'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { MY_CERTIFICATIONS } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { useRef } from 'react';

const Certifications = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Check if user prefers reduced motion or screen is very small
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isVerySmallScreen = window.innerWidth < 400;

            if (isVerySmallScreen || prefersReducedMotion) {
                // Set elements to visible immediately on small screens or reduced motion
                gsap.set('.certification-item', { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.from('.certification-item', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({
        containerRef,
    });

    return (
        <section className="py-section" id="certifications">
            <div className="container" ref={containerRef}>
                <SectionTitle title="Certifications" />

                <div className="grid gap-6 xs:gap-8 md:gap-10 lg:gap-14">
                    {MY_CERTIFICATIONS.map((category, index) => (
                        <div key={index} className="certification-item">
                            <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-tight mb-4 xs:mb-6 text-muted-foreground uppercase break-words">
                                {category.provider}
                            </p>
                            <div className="grid gap-3 xs:gap-4">
                                {category.certifications.map((cert, certIndex) => (
                                    <div key={certIndex} className="grid sm:grid-cols-12 gap-2">
                                        <p className="sm:col-span-9 text-body-base sm:text-body-lg leading-tight break-words">
                                            {cert.title}
                                        </p>
                                        <p className="sm:col-span-3 text-body-sm sm:text-body-base text-muted-foreground">
                                            {cert.date}
                                        </p>
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

export default Certifications;
