'use client';
import ArrowAnimation from '@/components/shared/ArrowAnimation';
import Button from '@/components/shared/Button';
import { GENERAL_INFO } from '@/lib/data';
import CvDownloadButton from '@/components/home/CvDownloadButton';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useGlitchText, AnimationPhase } from '@/hooks/useGlitchText';
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
    const [phase, setPhase] = React.useState<AnimationPhase>('entering');
    const [showCursor, setShowCursor] = React.useState(true);

    const currentRole = ROLES[currentRoleIndex];
    const firstWord = useGlitchText(currentRole.first, phase, 0);
    const secondWord = useGlitchText(currentRole.second, phase, 150);

    // Blinking cursor
    React.useEffect(() => {
        if (phase !== 'stable') {
            setShowCursor(false);
            return;
        }

        setShowCursor(true);
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);

        return () => clearInterval(interval);
    }, [phase]);

    // Main animation cycle - using interval-based approach for better memory management
    React.useEffect(() => {
        // Total cycle duration: 5000ms stable + 800ms exit + 150ms pause + 1200ms enter = 7150ms
        const STABLE_DURATION = 5000;
        const EXIT_DURATION = 800;
        const PAUSE_DURATION = 150;
        const ENTER_DURATION = 1200;
        const TOTAL_CYCLE =
            STABLE_DURATION + EXIT_DURATION + PAUSE_DURATION + ENTER_DURATION;

        let cycleStartTime = Date.now();
        let animationFrameId: number;
        let initialTimeoutId: NodeJS.Timeout;

        const tick = () => {
            const elapsed = Date.now() - cycleStartTime;
            const cyclePosition = elapsed % TOTAL_CYCLE;

            if (cyclePosition < STABLE_DURATION) {
                // Stable phase
                setPhase('stable');
            } else if (cyclePosition < STABLE_DURATION + EXIT_DURATION) {
                // Exit phase
                setPhase('exiting');
            } else if (
                cyclePosition <
                STABLE_DURATION + EXIT_DURATION + PAUSE_DURATION
            ) {
                // Pause - change role at start of pause
                if (cyclePosition - (STABLE_DURATION + EXIT_DURATION) < 50) {
                    setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
                }
            } else {
                // Enter phase
                setPhase('entering');
            }

            animationFrameId = requestAnimationFrame(tick);
        };

        // Initial entering animation, then start cycle
        initialTimeoutId = setTimeout(() => {
            setPhase('stable');
            cycleStartTime = Date.now();
            animationFrameId = requestAnimationFrame(tick);
        }, ENTER_DURATION);

        return () => {
            clearTimeout(initialTimeoutId);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // GSAP animation on role change
    React.useEffect(() => {
        if (roleRef.current && phase === 'entering') {
            gsap.fromTo(
                roleRef.current,
                {
                    y: 10,
                    filter: 'blur(4px)',
                },
                {
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power2.out',
                },
            );
        }
    }, [currentRoleIndex, phase]);

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
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-display-sm sm:text-display-md md:text-display-lg xl:text-display-xl font-anton mb-4 w-[95vw] xs:w-[85vw] sm:w-[500px] md:w-[600px] max-w-[900px] overflow-hidden">
                        <span
                            ref={roleRef}
                            className="block relative"
                            style={{ minHeight: 'clamp(80px, 20vw, 100px)' }}
                        >
                            <span
                                className="text-primary inline-block transition-all duration-300 will-change-transform"
                                style={{
                                    opacity: firstWord.opacity,
                                    textShadow:
                                        phase !== 'stable'
                                            ? '0 0 1px rgba(0, 255, 0, 0.2)'
                                            : 'none',
                                    transform:
                                        phase !== 'stable'
                                            ? 'translate3d(-1px, 0, 0)'
                                            : 'translate3d(0, 0, 0)',
                                }}
                            >
                                {firstWord.displayText}
                            </span>
                            <br />
                            <span
                                className="ml-2 xs:ml-4 text-foreground inline-block transition-all duration-300 will-change-transform"
                                style={{
                                    opacity: secondWord.opacity,
                                    textShadow:
                                        phase !== 'stable'
                                            ? '0 0 1px rgba(255, 255, 255, 0.15)'
                                            : 'none',
                                    transform:
                                        phase !== 'stable'
                                            ? 'translate3d(1px, 0, 0)'
                                            : 'translate3d(0, 0, 0)',
                                }}
                            >
                                {secondWord.displayText}
                                <span
                                    className="text-primary ml-1 transition-opacity duration-100"
                                    style={{ opacity: showCursor ? 1 : 0 }}
                                >
                                    _
                                </span>
                            </span>
                        </span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 text-body-lg sm:text-body-xl md:text-2xl text-muted-foreground max-w-[90vw] xs:max-w-none">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
                            Tariq Ahmad
                        </span>
                        . Computer engineer with expertise in full-stack
                        development, networking, and system architecture.
                        Building innovative solutions with modern technologies.
                    </p>
                    <Button
                        as="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={GENERAL_INFO.linkedIn}
                        variant="primary"
                        className="mt-9 banner-button slide-up-and-fade"
                    >
                        Let&apos;s Connect on LinkedIn
                    </Button>
                </div>

                <div className="mt-8 md:mt-0 md:absolute bottom-[10%] right-0 md:right-[4%] flex flex-col md:flex-col gap-6 md:gap-8 text-center md:text-right w-full md:w-auto items-center md:items-end">
                    <div className="slide-up-and-fade w-full px-6 xs:px-10 sm:px-0 flex justify-center md:block md:w-auto">
                        <CvDownloadButton />
                    </div>

                    <div className="flex w-full justify-around md:flex-col md:w-auto md:gap-8 items-center md:items-end">
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                3.36
                            </h5>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                CGPA / 4.0
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                10+
                            </h5>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                Major Projects
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                15+
                            </h5>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                Certifications
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
