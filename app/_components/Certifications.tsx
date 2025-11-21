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
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from('.certification-item', {
                y: 100,
                opacity: 0,
                stagger: 0.1,
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

                <div className="grid gap-14">
                    {MY_CERTIFICATIONS.map((category, index) => (
                        <div key={index} className="certification-item">
                            <p className="text-5xl font-anton leading-none mb-6 text-muted-foreground uppercase">
                                {category.provider}
                            </p>
                            <div className="grid gap-4">
                                {category.certifications.map((cert, certIndex) => (
                                    <div key={certIndex} className="grid sm:grid-cols-12 gap-2">
                                        <p className="sm:col-span-9 text-xl leading-tight">
                                            {cert.title}
                                        </p>
                                        <p className="sm:col-span-3 text-lg text-muted-foreground">
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
