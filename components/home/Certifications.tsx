'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { MY_CERTIFICATIONS } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { useRef, useState, useEffect } from 'react';
import { cn, gradientTextBaseClass, shouldSkipAnimation } from '@/lib/utils';

const Certifications = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const [hoveredCertificate, setHoveredCertificate] = useState<string | null>(
        null,
    );

    useGSAP(
        () => {
            if (shouldSkipAnimation()) {
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

    // Clear hover state on scroll to fix sticky hover on mobile
    const isHovering = hoveredCategory !== null || hoveredCertificate !== null;
    useEffect(() => {
        const handleScroll = () => {
            if (isHovering) {
                setHoveredCategory(null);
                setHoveredCertificate(null);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHovering]);

    const foregroundGradientClass = `${gradientTextBaseClass} from-primary to-foreground leading-tight`;

    return (
        <section className="py-section select-none" id="certifications">
            <div className="container" ref={containerRef}>
                <SectionTitle title="Certifications" />

                <div className="grid gap-6 xs:gap-8 md:gap-10 lg:gap-14">
                    {MY_CERTIFICATIONS.map((category, index) => {
                        const isCategoryDimmed =
                            hoveredCategory !== null &&
                            hoveredCategory !== index;
                        const isCategoryHovered = hoveredCategory === index;

                        return (
                            <div key={index} className="certification-item">
                                <div
                                    className={cn(
                                        'transition-opacity duration-500',
                                        isCategoryDimmed
                                            ? 'opacity-30'
                                            : 'opacity-100',
                                    )}
                                >
                                    <div className="mb-4 xs:mb-6">
                                        <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton uppercase break-words">
                                            <span
                                                className={`${foregroundGradientClass} ${isCategoryHovered ? 'bg-left' : 'bg-right'}`}
                                                onMouseEnter={() =>
                                                    setHoveredCategory(index)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredCategory(null)
                                                }
                                            >
                                                {category.provider}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="grid gap-3 xs:gap-4">
                                        {category.certifications.map(
                                            (cert, certIndex) => {
                                                const certId = `${index}-${certIndex}`;
                                                const isCertDimmed =
                                                    hoveredCertificate !==
                                                        null &&
                                                    hoveredCertificate !==
                                                        certId &&
                                                    hoveredCategory === index;
                                                const isCertHovered =
                                                    hoveredCertificate ===
                                                    certId;

                                                return (
                                                    <div
                                                        key={certIndex}
                                                        className={cn(
                                                            'grid sm:grid-cols-12 gap-2 transition-opacity duration-500',
                                                            isCertDimmed
                                                                ? 'opacity-30'
                                                                : 'opacity-100',
                                                        )}
                                                    >
                                                        <div className="sm:col-span-8">
                                                            <p className="text-body-base sm:text-body-lg break-words">
                                                                <span
                                                                    className={`${foregroundGradientClass} ${isCertHovered ? 'bg-left' : 'bg-right'}`}
                                                                    onMouseEnter={() => {
                                                                        setHoveredCategory(index);
                                                                        setHoveredCertificate(certId);
                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setHoveredCategory(null);
                                                                        setHoveredCertificate(null);
                                                                    }}
                                                                >
                                                                    {cert.title}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="sm:col-span-4">
                                                            <p className="text-body-sm sm:text-body-base text-left sm:text-right">
                                                                <span
                                                                    className={`${foregroundGradientClass} ${isCertHovered ? 'bg-left' : 'bg-right'}`}
                                                                    onMouseEnter={() => {
                                                                        setHoveredCategory(index);
                                                                        setHoveredCertificate(certId);
                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setHoveredCategory(null);
                                                                        setHoveredCertificate(null);
                                                                    }}
                                                                >
                                                                    {cert.date}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
