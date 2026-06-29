'use client';
import ArrowAnimation from '@/components/shared/ArrowAnimation';
import ConnectButton from '@/components/home/ConnectButton';
import CvDownloadButton from '@/components/home/CvDownloadButton';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useGlitchText, AnimationPhase } from '@/hooks/useGlitchText';
import { BANNER_ROLES, BANNER_STATS } from '@/lib/data';
import React from 'react';

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<AnimationPhase>('entering');
    const [showCursor, setShowCursor] = React.useState(true);

    const currentRole = BANNER_ROLES[currentRoleIndex];
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

    // Main animation cycle
    React.useEffect(() => {
        const STABLE_DURATION = 5000;
        const EXIT_DURATION = 800;
        const ENTER_DURATION = 1200;

        let timeoutId: NodeJS.Timeout;
        let isMounted = true;

        const schedule = (callback: () => void, delay: number) => {
            timeoutId = setTimeout(() => {
                if (!isMounted) return;
                callback();
            }, delay);
        };

        const runCycle = () => {
            setPhase('stable');

            schedule(() => {
                setPhase('exiting');

                schedule(() => {
                    // Advance the role and start entering in the same render so
                    // the next text is only ever shown during 'entering'.
                    // Swapping the index while still 'exiting' re-ran the exit
                    // scramble against the new word, whose early frames show
                    // real characters — flashing the full next role before
                    // scrambling it back out.
                    setCurrentRoleIndex((prev) => (prev + 1) % BANNER_ROLES.length);
                    setPhase('entering');
                    schedule(runCycle, ENTER_DURATION);
                }, EXIT_DURATION);
            }, STABLE_DURATION);
        };

        schedule(runCycle, ENTER_DURATION);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

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
                    <h1 className="banner-title slide-up-and-fade leading-[.95] font-anton mb-4 w-[95vw] xs:w-[85vw] sm:w-[500px] md:w-[600px] max-w-[900px] overflow-hidden">
                        <span
                            className="block relative"
                            style={{ minHeight: 'clamp(80px, 20vw, 100px)' }}
                        >
                            <span
                                className={`text-primary inline-block ${
                                    phase !== 'stable'
                                        ? 'glitch-text glitch-primary'
                                        : ''
                                }`}
                                data-text={firstWord.displayText}
                                style={{ opacity: firstWord.opacity }}
                            >
                                {firstWord.displayText}
                            </span>
                            <br />
                            <span
                                className={`ml-2 xs:ml-4 text-foreground inline-block ${
                                    phase !== 'stable'
                                        ? 'glitch-text glitch-secondary'
                                        : ''
                                }`}
                                data-text={secondWord.displayText}
                                style={{ opacity: secondWord.opacity }}
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
                        . I architect robust systems and craft seamless digital
                        experiences from infrastructure to interface.
                    </p>
                    <ConnectButton />
                </div>

                <div className="mt-8 md:mt-0 md:absolute bottom-[10%] right-0 md:right-[4%] flex flex-col md:flex-col gap-6 md:gap-8 text-center md:text-right w-full md:w-auto items-center md:items-end">
                    <div className="slide-up-and-fade w-full px-6 xs:px-10 sm:px-0 flex justify-center md:block md:w-auto">
                        <CvDownloadButton />
                    </div>

                    <div className="flex w-full justify-around md:flex-col md:w-auto md:gap-8 items-center md:items-end">
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.cgpa}
                            </h5>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                CGPA / 4.0
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.projects}
                            </h5>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                Projects
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <h5 className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.certifications}
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
