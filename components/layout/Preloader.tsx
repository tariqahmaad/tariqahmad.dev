'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import React, { useRef } from 'react';

const SEEN_KEY = 'tariq-preloader-seen';
const SLAT_COUNT = 10;

const readSeen = (): boolean => {
    try {
        return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
        return false;
    }
};

const markSeen = (): void => {
    try {
        sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
        // Private mode etc. — preloader just shows every time. Harmless.
    }
};

// The accent half of the name: brand green glyphs plus the drop-shadow owned
// by `.name-glow` (globals.css), whose blur/alpha are custom properties so the
// landing flare can be tweened.
const GLOW_CLASS = 'name-glow text-primary';

type BracketPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const BRACKET_POSITIONS: Record<BracketPosition, string> = {
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8',
    'bottom-left':
        'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8',
    'bottom-right':
        'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
};

/**
 * Screen-corner bracket, the same language the menu panel uses, so the boot
 * screen reads as part of the same HUD rather than a separate splash.
 */
const Bracket = ({ position }: { position: BracketPosition }) => {
    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');

    const horizontal = isLeft
        ? 'bg-gradient-to-r from-primary/40 to-transparent'
        : 'bg-gradient-to-l from-primary/40 to-transparent';
    const vertical = isTop
        ? 'bg-gradient-to-b from-primary/40 to-transparent'
        : 'bg-gradient-to-t from-primary/40 to-transparent';

    return (
        <div
            className={`absolute ${BRACKET_POSITIONS[position]} w-10 h-10 md:w-12 md:h-12`}
        >
            <div
                className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full h-[1px] ${horizontal}`}
            />
            <div
                className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} h-full w-[1px] ${vertical}`}
            />
        </div>
    );
};

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const railRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = preloaderRef.current;
            if (!el || typeof window === 'undefined') return;

            // Single owner for the boot readout. Both the full show and the
            // encore count up from 0 through this, so the bar can never snap
            // straight to full.
            const setReadout = (value: number) => {
                const clamped = Math.min(Math.max(value, 0), 100);
                if (counterRef.current) {
                    counterRef.current.textContent = String(
                        Math.round(clamped),
                    ).padStart(3, '0');
                }
                if (railRef.current) {
                    railRef.current.style.width = `${clamped}%`;
                }
            };

            // The moment the name lands: the accent half flares and locks on
            // with a short signal jitter — the same CRT language the hero uses.
            const land = () => {
                gsap.timeline()
                    .to('.name-glow', {
                        '--name-glow-size': '40px',
                        '--name-glow-alpha': 0.9,
                        duration: 0.22,
                        stagger: 0.05,
                    })
                    .to('.name-glow', {
                        '--name-glow-size': '25px',
                        '--name-glow-alpha': 0.5,
                        duration: 0.7,
                        ease: 'power2.out',
                        stagger: 0.05,
                    });

                gsap.to('.name-glow', {
                    x: 1.5,
                    duration: 0.05,
                    repeat: 3,
                    yoyo: true,
                    ease: 'none',
                    stagger: 0.04,
                });
            };

            // ?loader=full forces the full show (preview/testing),
            // ?loader=off skips it entirely.
            const force = new URLSearchParams(window.location.search).get(
                'loader',
            );
            const reduced =
                force !== 'full' &&
                window.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                ).matches;

            // Reduced-motion (and explicit opt-out) skip the show: the slats
            // start opaque and would otherwise block paint.
            if (reduced || force === 'off') {
                gsap.set(el, { autoAlpha: 0 });
                markSeen();
                return;
            }

            const bootHudIn = (tl: gsap.core.Timeline, at: number | string) =>
                tl.fromTo(
                    '.preloader-hud',
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.6, ease: 'power1.out' },
                    at,
                );

            // Repeat visits get a readable encore — quick rise, brief hold,
            // fast wipe — instead of a blackout, so refreshes never look broken.
            // The readout still counts up rather than snapping to 100: the
            // server paints `000`/empty, and hydration used to jump it.
            if (readSeen() && force !== 'full') {
                const encoreCount = { v: 0 };
                setReadout(0);

                const encore = gsap.timeline({
                    defaults: { ease: 'power1.inOut' },
                });
                bootHudIn(encore, 0);
                encore
                    .to(
                        encoreCount,
                        {
                            v: 100,
                            duration: 0.6,
                            ease: 'none',
                            onUpdate: () => setReadout(encoreCount.v),
                        },
                        0.1,
                    )
                    .to(
                        '.name-text span',
                        {
                            y: 0,
                            duration: 0.4,
                            stagger: 0.04,
                            onComplete: land,
                        },
                        0.1,
                    )
                    .to(
                        '.preloader-item',
                        { y: '100%', duration: 0.5, stagger: 0.08 },
                        '+=0.35',
                    )
                    .to(
                        '.slat-edge',
                        { opacity: 1, duration: 0.2, stagger: 0.08 },
                        '<',
                    )
                    .to(
                        '.name-text span, .boot-hud, .preloader-hud',
                        { autoAlpha: 0, duration: 0.3 },
                        '<',
                    )
                    .to(el, { autoAlpha: 0, duration: 0.4 }, '+=0.5');
                return;
            }

            const counter = { v: 0 };
            // Guarantees a clean 0 start even if this effect re-runs against a
            // readout a previous run already finished.
            setReadout(0);
            const tl = gsap.timeline({
                defaults: {
                    ease: 'power1.inOut',
                },
            });

            bootHudIn(tl, 0);

            // Name rises letter by letter while the boot counter runs.
            // Deliberately paced: HUD → rise → count → beat → wipe. The long
            // travel (2em) is what keeps the letters hidden behind the mask
            // before the rise starts.
            tl.to(
                '.name-text span',
                {
                    y: 0,
                    stagger: 0.08,
                    duration: 0.5,
                    onComplete: land,
                },
                0.15,
            );
            tl.to(
                counter,
                {
                    v: 100,
                    duration: 1.9,
                    ease: 'none',
                    onUpdate: () => setReadout(counter.v),
                },
                '<',
            );

            tl.call(() => markSeen());

            // Slats wipe up in cascade, each carrying a light edge; the HUD,
            // name and boot readout dissolve first, container fades as the
            // wipe lands.
            tl.to(
                '.preloader-item',
                {
                    y: '100%',
                    duration: 0.6,
                    stagger: 0.12,
                },
                '+=0.6',
            );
            tl.to(
                '.slat-edge',
                { opacity: 1, duration: 0.2, stagger: 0.12 },
                '<',
            );
            tl.to(
                '.name-text span, .boot-hud, .preloader-hud',
                { autoAlpha: 0, duration: 0.4 },
                '<',
            );
            tl.to(el, { autoAlpha: 0, duration: 0.6 }, '+=0.7');
        },
        { scope: preloaderRef },
    );

    return (
        <div
            className="preloader-shell fixed inset-0 z-[9999] flex"
            ref={preloaderRef}
            role="status"
            aria-label="Loading portfolio"
        >
            {Array.from({ length: SLAT_COUNT }).map((_, i) => (
                <div
                    aria-hidden="true"
                    key={i}
                    className="preloader-item relative h-full w-[10%] bg-black"
                >
                    {/* Light edge the slat carries as it wipes away. */}
                    <span className="slat-edge absolute inset-x-0 top-0 h-[2px] bg-primary/40 opacity-0 shadow-[0_0_14px_hsl(var(--primary)/0.6)]" />
                </div>
            ))}

            {/* HUD texture + frame: the same grid, scanlines and corner
                brackets as the menu panel. */}
            <div
                aria-hidden="true"
                className="preloader-hud pointer-events-none absolute inset-0"
            >
                <div className="absolute inset-0 bg-menu-grid opacity-[0.03]" />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.05) 2px, rgba(0,255,0,0.05) 4px)',
                    }}
                />
                <Bracket position="top-left" />
                <Bracket position="top-right" />
                <Bracket position="bottom-left" />
                <Bracket position="bottom-right" />
            </div>

            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-12 px-4"
            >
                {/* `translate-y-[200%]` must clear `.name-mask`'s opaque band
                    (1em + 3rem) or the letters would sit visible below the
                    name before rising. */}
                <p className="name-text name-mask flex whitespace-nowrap text-[clamp(3rem,14vw,12.5rem)] font-anton leading-none">
                    <span className="inline-block translate-y-[200%]">T</span>
                    <span className="inline-block translate-y-[200%]">A</span>
                    <span className="inline-block translate-y-[200%]">R</span>
                    <span className="inline-block translate-y-[200%]">I</span>
                    <span className="inline-block translate-y-[200%]">Q</span>
                    <span className="inline-block translate-y-[200%]">
                        &nbsp;
                    </span>
                    <span
                        className={`inline-block translate-y-[200%] ${GLOW_CLASS}`}
                    >
                        A
                    </span>
                    <span
                        className={`inline-block translate-y-[200%] ${GLOW_CLASS}`}
                    >
                        H
                    </span>
                    <span
                        className={`inline-block translate-y-[200%] ${GLOW_CLASS}`}
                    >
                        M
                    </span>
                    <span
                        className={`inline-block translate-y-[200%] ${GLOW_CLASS}`}
                    >
                        A
                    </span>
                    <span
                        className={`inline-block translate-y-[200%] ${GLOW_CLASS}`}
                    >
                        D
                    </span>
                </p>

                {/* Boot readout: `$` prompt and right-aligned counter across
                    the rail, mirroring the menu's `$ Section ... 07 items`
                    header row. */}
                <div className="boot-hud flex w-[min(80vw,26rem)] flex-col gap-2">
                    <div className="boot-line flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary/70 sm:text-xs">
                        <span className="truncate">
                            <span className="text-primary">$</span> LOADING
                            PORTFOLIO
                        </span>
                        <span className="flex-shrink-0 tabular-nums tracking-normal">
                            <span ref={counterRef} className="text-primary">
                                000
                            </span>
                            %
                        </span>
                    </div>
                    <div
                        className="boot-rail relative h-[2px] w-full bg-primary/15"
                        aria-hidden="true"
                    >
                        <div
                            ref={railRef}
                            className="relative h-full w-0 bg-primary/80 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                        >
                            {/* Scan head riding the leading edge of the fill. */}
                            <span className="absolute top-1/2 -right-px h-3 w-3 -translate-y-1/2 rounded-full bg-primary blur-[2px] shadow-[0_0_12px_hsl(var(--primary)/0.9)]" />
                        </div>
                        {/* HUD ticks, painted over the fill. */}
                        <span className="absolute top-1/2 left-1/4 h-[6px] w-px -translate-y-1/2 bg-primary/25" />
                        <span className="absolute top-1/2 left-1/2 h-[6px] w-px -translate-y-1/2 bg-primary/25" />
                        <span className="absolute top-1/2 left-3/4 h-[6px] w-px -translate-y-1/2 bg-primary/25" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
