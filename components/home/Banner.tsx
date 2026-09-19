'use client';
import ArrowAnimation from '@/components/shared/ArrowAnimation';
import ConnectButton from '@/components/home/ConnectButton';
import CvDownloadButton from '@/components/home/CvDownloadButton';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useGlitchText, useLookalikeFlicker, useLaggedValue, AnimationPhase } from '@/hooks/useGlitchText';
import { BANNER_ROLES, BANNER_STATS } from '@/lib/data';
import React from 'react';

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<AnimationPhase>('entering');
    const [showCursor, setShowCursor] = React.useState(true);
    // Driven by the lookalike flicker: true exactly while mutated
    // characters are on screen.
    const [burst, setBurst] = React.useState(false);
    // Rare violent flicker windows upgrade the shake to a full surge.
    const [surge, setSurge] = React.useState(false);

    const isGlitching = phase !== 'stable' || burst;

    const currentRole = BANNER_ROLES[currentRoleIndex];
    const firstWord = useGlitchText(currentRole.first, phase, 0);
    const secondWord = useGlitchText(currentRole.second, phase, 150);

    // Lookalike flicker runs only while stable. Its `active` flag is the
    // single driver of the shake, so mutated characters and the RGB
    // slice/jitter always coincide — never one without the other.
    const isStable = phase === 'stable';
    const flickFirst = useLookalikeFlicker(currentRole.first, isStable, 0);
    const flickSecond = useLookalikeFlicker(currentRole.second, isStable, 350);

    const firstText = isStable ? flickFirst.text : firstWord.displayText;
    const secondText = isStable ? flickSecond.text : secondWord.displayText;

    // Ghost trails: the RGB split lags ~90ms behind the live glyphs while
    // stable, so churn smears into chromatic motion trails. Instant during
    // scrambles (no render doubling at 40fps).
    const ghostFirst = useLaggedValue(firstText, 90, isStable);
    const ghostSecond = useLaggedValue(secondText, 90, isStable);

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

    // The shake follows the flicker: CSS slices/jitter fire exactly while
    // mutated characters are on screen. Surges upgrade shake to surge.
    React.useEffect(() => {
        setBurst(flickFirst.active || flickSecond.active);
        setSurge(flickFirst.surge || flickSecond.surge);
    }, [flickFirst.active, flickFirst.surge, flickSecond.active, flickSecond.surge]);

    // Main animation cycle
    React.useEffect(() => {
        const STABLE_DURATION = 5000;
        const EXIT_DURATION = 800;
        const ENTER_DURATION = 1200;

        const timeoutIds: NodeJS.Timeout[] = [];
        let isMounted = true;

        const schedule = (callback: () => void, delay: number) => {
            const id = setTimeout(() => {
                if (!isMounted) return;
                callback();
            }, delay);
            timeoutIds.push(id);
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
            timeoutIds.forEach(clearTimeout);
        };
    }, []);

    // move the content a little up on scroll
    useGSAP(
        () => {
            // `gsap.matchMedia` rather than a one-shot `matchMedia().matches`
            // read, so the scrub is genuinely built and torn down as the
            // preference changes. globals.css pins `.slide-up-and-fade` to its
            // final state under reduced motion, but that CSS only neutralises
            // transforms CSS knows about — a Scrubbed GSAP tween writes inline
            // styles every frame and would otherwise ignore the preference
            // entirely.
            const mm = gsap.matchMedia();

            mm.add('(prefers-reduced-motion: no-preference)', () => {
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
            });

            return () => mm.revert();
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
                        {/* Screen readers get the resolved role once; the
                            animated scramble below is decorative. */}
                        <span className="sr-only">
                            {currentRole.first} {currentRole.second}
                        </span>
                        <span
                            className="block relative"
                            aria-hidden="true"
                            style={{ minHeight: 'clamp(80px, 20vw, 100px)' }}
                        >
                            <span
                                className={`text-primary inline-block glitch-text glitch-primary ${
                                    isGlitching ? 'glitch-active' : ''
                                }${surge ? ' glitch-surge' : ''}`}
                                data-text={ghostFirst}
                                style={{ opacity: firstWord.opacity }}
                            >
                                {firstText}
                            </span>
                            <br />
                            <span
                                className={`ml-2 xs:ml-4 text-foreground inline-block glitch-text glitch-secondary ${
                                    isGlitching ? 'glitch-active' : ''
                                }${surge ? ' glitch-surge' : ''}`}
                                data-text={ghostSecond}
                                style={{ opacity: secondWord.opacity }}
                            >
                                {secondText}
                                <span
                                    className="text-primary ml-1 transition-opacity duration-100"
                                    aria-hidden="true"
                                    style={{ opacity: showCursor ? 1 : 0 }}
                                >
                                    _
                                </span>
                            </span>
                        </span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-6 max-w-[90vw] xs:max-w-[52ch] text-balance text-body-lg sm:text-body-xl leading-relaxed text-muted-foreground">
                        <span
                            aria-hidden="true"
                            className="font-mono text-primary"
                        >
                            {'> '}
                        </span>
                        Hi! I&apos;m{' '}
                        <span className="font-semibold text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.35)]">
                            Tariq Ahmad
                        </span>
                        . I believe the best software disappears, leaving only
                        the feeling that something{' '}
                        <span className="text-foreground">
                            just worked exactly as it should.
                        </span>
                    </p>
                    <ConnectButton />
                </div>

                <div className="mt-8 md:mt-0 md:absolute bottom-[10%] right-0 md:right-[4%] flex flex-col md:flex-col gap-6 md:gap-8 text-center md:text-right w-full md:w-auto items-center md:items-end">
                    <div className="slide-up-and-fade w-full px-6 xs:px-10 sm:px-0 flex justify-center md:block md:w-auto">
                        <CvDownloadButton />
                    </div>

                    <div className="flex w-full justify-around md:flex-col md:w-auto md:gap-8 items-center md:items-end">
                        {/* Stats are data, not headings — an <h5> under the <h1>
                            skipped h2-h4 for screen-reader users. */}
                        <div className="slide-up-and-fade">
                            <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.cgpa}
                            </p>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                CGPA / 4.0
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.projects}
                            </p>
                            <p className="text-body-sm md:text-body-base text-muted-foreground">
                                Projects
                            </p>
                        </div>
                        <div className="slide-up-and-fade">
                            <p className="text-heading-sm sm:text-heading-md md:text-heading-lg font-anton text-primary mb-1.5">
                                {BANNER_STATS.certifications}
                            </p>
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
