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

// Tech-focused glitch characters
const GLITCH_CHARS = '01█▓▒░<>{}[]|/\\';

type AnimationPhase = 'stable' | 'exiting' | 'entering';

const useEnhancedGlitchText = (
    targetText: string,
    phase: AnimationPhase,
    delay: number = 0
) => {
    const [displayText, setDisplayText] = React.useState(targetText);
    const [opacity, setOpacity] = React.useState(1);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        // Clear any existing intervals/timeouts
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (phase === 'stable') {
            setDisplayText(targetText);
            setOpacity(1);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            const textLength = targetText.length;
            let iteration = 0;

            if (phase === 'exiting') {
                const maxIterations = textLength * 2.5;
                intervalRef.current = setInterval(() => {
                    setDisplayText(
                        targetText
                            .split('')
                            .map((char, index) => {
                                if (char === ' ' || char === '-') return char;
                                if (index > textLength - (iteration / 2.5)) {
                                    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                                }
                                return targetText[index];
                            })
                            .join('')
                    );

                    setOpacity(Math.max(0.3, 1 - (iteration / maxIterations) * 0.7));

                    iteration++;
                    if (iteration >= maxIterations && intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }, 25);
            } else if (phase === 'entering') {
                const maxIterations = textLength * 3;
                intervalRef.current = setInterval(() => {
                    const progress = iteration / maxIterations;

                    setDisplayText(
                        targetText
                            .split('')
                            .map((char, index) => {
                                if (char === ' ' || char === '-') return char;
                                if (index < iteration / 3) {
                                    return targetText[index];
                                }
                                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                            })
                            .join('')
                    );

                    setOpacity(Math.min(1, 0.3 + progress * 0.7));

                    iteration++;
                    if (iteration >= maxIterations) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setDisplayText(targetText);
                        setOpacity(1);
                    }
                }, 28);
            }
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [targetText, phase, delay]);

    return { displayText, opacity };
};

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const roleRef = React.useRef<HTMLSpanElement>(null);
    const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<AnimationPhase>('entering');
    const [showCursor, setShowCursor] = React.useState(true);

    const currentRole = ROLES[currentRoleIndex];
    const firstWord = useEnhancedGlitchText(currentRole.first, phase, 0);
    const secondWord = useEnhancedGlitchText(currentRole.second, phase, 150);

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

    // Main animation cycle
    React.useEffect(() => {
        let isActive = true;
        const timeoutIds: NodeJS.Timeout[] = [];

        const runCycle = async () => {
            if (!isActive) return;

            // Stable display for 5 seconds
            await new Promise((resolve) => {
                const id = setTimeout(resolve, 5000);
                timeoutIds.push(id);
            });
            if (!isActive) return;

            // Exit animation (800ms)
            setPhase('exiting');
            await new Promise((resolve) => {
                const id = setTimeout(resolve, 800);
                timeoutIds.push(id);
            });
            if (!isActive) return;

            // Pause (150ms)
            await new Promise((resolve) => {
                const id = setTimeout(resolve, 150);
                timeoutIds.push(id);
            });
            if (!isActive) return;

            // Change role
            setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);

            // Enter animation (1200ms)
            setPhase('entering');
            await new Promise((resolve) => {
                const id = setTimeout(resolve, 1200);
                timeoutIds.push(id);
            });
            if (!isActive) return;

            // Back to stable and schedule next cycle
            setPhase('stable');
            runCycle();
        };

        // Initial animation then start cycle
        const initialTimeout = setTimeout(() => {
            setPhase('stable');
            runCycle();
        }, 1200);
        timeoutIds.push(initialTimeout);

        return () => {
            isActive = false;
            timeoutIds.forEach(clearTimeout);
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
                    ease: 'power2.out'
                }
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
                        . Computer Engineering graduate from Istanbul Aydin
                        University with expertise in full-stack development,
                        networking, and system architecture. Building innovative
                        solutions with modern technologies.
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

                <div className="mt-8 md:mt-0 md:absolute bottom-[10%] right-0 md:right-[4%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right w-full md:w-auto justify-around md:justify-start md:pr-4">
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
        </section>
    );
};

export default Banner;
