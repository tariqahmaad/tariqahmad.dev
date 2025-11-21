'use client';
import ArrowAnimation from '@/components/shared/ArrowAnimation';
import Button from '@/components/shared/Button';
import { GENERAL_INFO } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import React from 'react';

const ROLES = [
    { first: 'COMPUTER', second: 'ENGINEER' },
    { first: 'CYBERSECURITY', second: 'ANALYST' },
    { first: 'SOFTWARE', second: 'DEVELOPER' },
    { first: 'FULL-STACK', second: 'DEVELOPER' },
    { first: 'NETWORK', second: 'ENGINEER' },
    { first: 'AI', second: 'ENTHUSIAST' },
];

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const roleRef = React.useRef<HTMLSpanElement>(null);
    const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);

    // Rotate through roles
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Animate role change
    React.useEffect(() => {
        if (roleRef.current) {
            gsap.fromTo(
                roleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, [currentRoleIndex]);

    // move the content a little up on scroll
    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.fromTo(
                '.slide-up-and-fade',
                { y: 0 },
                { y: -150, opacity: 0, stagger: 0.05 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ArrowAnimation />
            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px] font-anton">
                        <span
                            ref={roleRef}
                            className="block"
                        >
                            <span className="text-primary">
                                {ROLES[currentRoleIndex].first}
                            </span>
                            <br />
                            <span className="ml-4 text-foreground">
                                {ROLES[currentRoleIndex].second}
                            </span>
                        </span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
                            Tariq Ahmad
                        </span>
                        . Computer Engineering graduate from Istanbul Aydin University
                        with expertise in full-stack development, networking, and
                        system architecture. Building innovative solutions with
                        modern technologies.
                    </p>
                    <Button
                        as="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={GENERAL_INFO.linkedIn}
                        variant="primary"
                        className="mt-9 banner-button slide-up-and-fade"
                    >
                        Connect with Me
                    </Button>
                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right">
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            3.36
                        </h5>
                        <p className="text-muted-foreground">
                            CGPA / 4.0
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            10+
                        </h5>
                        <p className="text-muted-foreground">
                            Major Projects
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            15+
                        </h5>
                        <p className="text-muted-foreground">Certifications</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
