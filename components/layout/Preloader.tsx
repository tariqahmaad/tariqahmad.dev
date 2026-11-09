'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { MY_CERTIFICATIONS, MY_STACK, PROJECTS } from '@/lib/data';
import React, { useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'tariq-preloader-seen';
const SLAT_COUNT = 10;
const GAUGE_CELLS = 40;
const GLYPHS = '01#$%&<>/\\|=+*?;:';

// Has the boot show already run in THIS document? Deliberately module state,
// not sessionStorage: it survives client-side navigation but resets on a real
// page load. That is exactly the line to draw. Project pages live outside the
// `(site)` layout group, so opening one unmounts this component and coming back
// mounts a fresh instance, which used to replay the whole show (name, loading
// bar) on every return. A refresh, by contrast, still gets its encore, because
// the server paints the opaque slat wall and something has to remove it.
// Set only when a show COMPLETES: a dev-mode strict re-run or an unmount
// mid-show reverts the timeline before it gets there, so neither marks it done.
let bootedThisDocument = false;

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

const NAME_FIRST = 'TARIQ';
const NAME_LAST = 'AHMAD';

const pad = (n: number) => String(n).padStart(2, '0');

// The boot log reports the site's real inventory, derived from the same data
// the page renders, so it can never drift from the content.
const STACK_COUNT = Object.values(MY_STACK).reduce(
    (total, group) => total + group.length,
    0,
);
const CERT_COUNT = MY_CERTIFICATIONS.reduce(
    (total, group) => total + group.certifications.length,
    0,
);
const BOOT_LINES = [
    { cmd: 'mount /projects', res: `${pad(PROJECTS.length)} ok` },
    { cmd: 'load /stack', res: `${pad(STACK_COUNT)} ok` },
    { cmd: 'verify /certs', res: `${pad(CERT_COUNT)} ok` },
    { cmd: 'link tariqahmad.dev', res: 'ok' },
];

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
 * screen reads as part of the same HUD rather than a separate splash. Each arm
 * has a transform origin at the corner so the show can draw it outward.
 */
const Bracket = ({ position }: { position: BracketPosition }) => {
    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');

    const horizontal = isLeft
        ? 'origin-left bg-gradient-to-r from-primary/40 to-transparent'
        : 'origin-right bg-gradient-to-l from-primary/40 to-transparent';
    const vertical = isTop
        ? 'origin-top bg-gradient-to-b from-primary/40 to-transparent'
        : 'origin-bottom bg-gradient-to-t from-primary/40 to-transparent';

    return (
        <div
            className={`absolute ${BRACKET_POSITIONS[position]} w-10 h-10 md:w-12 md:h-12`}
        >
            <div
                className={`bracket-h absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-full h-[1px] ${horizontal}`}
            />
            <div
                className={`bracket-v absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} h-full w-[1px] ${vertical}`}
            />
        </div>
    );
};

const renderLetters = (text: string, extraClass = '') =>
    text.split('').map((char, i) => (
        <span
            key={`${text}-${i}`}
            data-char={char}
            className={`name-char inline-block text-center opacity-0 ${extraClass}`}
        >
            {char}
        </span>
    ));

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const hexRef = useRef<HTMLSpanElement>(null);
    const cellsRef = useRef<Array<HTMLSpanElement | null>>([]);
    // The shell elements this run actually inerted, so the release clears
    // exactly what the preloader set - and never an `inert` the open menu panel
    // owns on the same elements.
    const inertedShellRef = useRef<HTMLElement[]>([]);
    // Read once per instance. On hydration (a real page load) the flag is false
    // on both server and client, so the markup matches; on a client-side
    // navigation back into the site it is true and nothing is rendered at all.
    const [skipShow] = useState(() => bootedThisDocument);

    // Safety net for the inert shell below: the show releases it when its
    // timeline completes, but a killed or thrown animation never gets there and
    // an unmount mid-show would leave the page permanently unreachable. Unmount
    // therefore always clears whatever is still marked.
    useEffect(() => {
        return () => {
            inertedShellRef.current.forEach((element) => {
                element.removeAttribute('inert');
                element.removeAttribute('aria-busy');
            });
            inertedShellRef.current = [];
        };
    }, []);

    useGSAP(
        () => {
            const el = preloaderRef.current;
            if (!el || typeof window === 'undefined') return;

            const one = (selector: string) =>
                el.querySelector<HTMLElement>(selector);
            const all = (selector: string) =>
                gsap.utils.toArray<HTMLElement>(selector, el);

            const chars = all('.name-char');
            const glows = all('.name-glow');
            const slats = all('.preloader-item');
            const edges = all('.slat-edge');
            const bracketsH = all('.bracket-h');
            const bracketsV = all('.bracket-v');
            const bootItems = all('.boot-line-item');
            const hud = one('.preloader-hud');
            const ignite = one('.ignite-line');
            const nameWrap = one('.name-wrap');
            const nameText = one('.name-text');
            const beam = one('.scan-beam');
            const reticle = one('.reticle');
            const ring = one('.lock-ring');
            const bootHud = one('.boot-hud');
            const bootLog = one('.boot-log');
            const bootHex = one('.boot-hex');

            // Single owner for the boot readout (percent, segmented gauge and
            // memory address). Both the full show and the encore count up from
            // 0 through this, so the gauge can never snap straight to full.
            const setReadout = (value: number) => {
                const clamped = Math.min(Math.max(value, 0), 100);
                if (counterRef.current) {
                    counterRef.current.textContent = String(
                        Math.round(clamped),
                    ).padStart(3, '0');
                }
                const filled = Math.floor((clamped / 100) * GAUGE_CELLS);
                cellsRef.current.forEach((cell, i) => {
                    if (!cell) return;
                    // The head cell is its own state (not also "on"): the
                    // compiled `on` rule would otherwise win the cascade and
                    // dull the leading cell.
                    const head = clamped < 100 && i === filled - 1;
                    cell.dataset.head = String(head);
                    cell.dataset.on = String(i < filled && !head);
                });
                if (hexRef.current) {
                    hexRef.current.textContent = `0x${Math.round(
                        clamped * 655.35,
                    )
                        .toString(16)
                        .toUpperCase()
                        .padStart(4, '0')}`;
                }
            };

            const setLabel = (text: string) => {
                if (labelRef.current) labelRef.current.textContent = text;
            };

            // Clean slate: a strict-mode re-run or a re-mount must not start
            // from a half-scrambled name or a finished gauge.
            const resetState = () => {
                chars.forEach((char) => {
                    char.textContent = char.dataset.char ?? '';
                    char.style.width = '';
                });
                setLabel('LOADING PORTFOLIO');
                setReadout(0);
            };
            resetState();

            // The moment the name has fully locked: the accent half flares with
            // a short signal jitter, the same CRT language the hero uses.
            const land = () => {
                gsap.timeline()
                    .to(glows, {
                        '--name-glow-size': '40px',
                        '--name-glow-alpha': 0.9,
                        duration: 0.22,
                        stagger: 0.05,
                    })
                    .to(glows, {
                        '--name-glow-size': '25px',
                        '--name-glow-alpha': 0.5,
                        duration: 0.7,
                        ease: 'power2.out',
                        stagger: 0.05,
                    });

                gsap.to(glows, {
                    x: 1.5,
                    duration: 0.05,
                    repeat: 3,
                    yoyo: true,
                    ease: 'none',
                    stagger: 0.04,
                });
            };

            // The lock-on: reticle snaps in and settles, one square shockwave
            // leaves the name, and the whole line takes a hard signal hit.
            const lockPulse = () => {
                setLabel('READY');
                const pulse = gsap.timeline();
                if (reticle) {
                    pulse.fromTo(
                        reticle,
                        { autoAlpha: 0, scale: 1.35 },
                        {
                            autoAlpha: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: 'power4.out',
                        },
                        0,
                    );
                }
                if (ring) {
                    pulse.fromTo(
                        ring,
                        { autoAlpha: 0.9, width: '6rem', height: '6rem' },
                        {
                            autoAlpha: 0,
                            width: '150vmax',
                            height: '150vmax',
                            duration: 1.1,
                            ease: 'power2.out',
                        },
                        0,
                    );
                }
                if (nameText) {
                    pulse.fromTo(
                        nameText,
                        { x: 14, skewX: -10 },
                        { x: 0, skewX: 0, duration: 0.32, ease: 'steps(5)' },
                        0,
                    );
                }
                if (beam) pulse.to(beam, { autoAlpha: 0, duration: 0.2 }, 0);
                land();
            };

            // Decrypt: every glyph starts as noise; a scan beam crosses the
            // name and locks each letter as it passes, collapsing its chromatic
            // echo. Letters are pinned to their real width first so the line
            // never jitters while the glyphs change.
            const decrypt = { p: 0 };
            let lockPoints: number[] = [];
            let locked: boolean[] = [];
            let frame = 0;
            let beamSpan = 0;
            const setBeamX = beam ? gsap.quickSetter(beam, 'x', 'px') : null;

            const startDecrypt = () => {
                if (!nameWrap) return;
                const wrapRect = nameWrap.getBoundingClientRect();
                beamSpan = wrapRect.width;
                lockPoints = chars.map((char) => {
                    const rect = char.getBoundingClientRect();
                    return (
                        (rect.left + rect.width / 2 - wrapRect.left) /
                        Math.max(beamSpan, 1)
                    );
                });
                chars.forEach((char) => {
                    char.style.width = `${char.getBoundingClientRect().width}px`;
                });
                locked = chars.map(() => false);
                frame = 0;
                gsap.set(chars, { autoAlpha: 0.5, '--echo': '0px' });
                if (beam) gsap.set(beam, { autoAlpha: 1, x: 0 });
            };

            const lockLetter = (char: HTMLElement) => {
                char.textContent = char.dataset.char ?? '';
                char.style.width = '';
                gsap.fromTo(
                    char,
                    { autoAlpha: 1, '--echo': '7px', y: -6 },
                    {
                        '--echo': '0px',
                        y: 0,
                        duration: 0.35,
                        ease: 'power3.out',
                    },
                );
            };

            const tickDecrypt = () => {
                frame += 1;
                setBeamX?.(decrypt.p * beamSpan);
                chars.forEach((char, i) => {
                    if (locked[i]) return;
                    if (decrypt.p >= lockPoints[i]) {
                        locked[i] = true;
                        lockLetter(char);
                        return;
                    }
                    if (frame % 2 === 0) {
                        char.textContent =
                            GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    }
                });
            };

            const endDecrypt = () => {
                chars.forEach((char, i) => {
                    if (!locked[i]) {
                        locked[i] = true;
                        lockLetter(char);
                    }
                });
                lockPulse();
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
            // start opaque and would otherwise block paint. Nothing is inerted
            // on this path either - the page is live immediately.
            if (reduced || force === 'off') {
                gsap.set(el, { autoAlpha: 0 });
                markSeen();
                bootedThisDocument = true;
                return;
            }

            // While the opaque slat wall covers the page, the page behind it
            // must not be reachable: Tab and assistive tech would otherwise walk
            // into content nobody can see. Same house pattern as the open menu
            // panel in Navbar (`inert` on `main`/`footer`), plus `aria-busy` so
            // the covered shell reads as still loading rather than as empty.
            const markShellBusy = () => {
                inertedShellRef.current = Array.from(
                    document.querySelectorAll<HTMLElement>('main, footer'),
                );
                inertedShellRef.current.forEach((element) => {
                    element.setAttribute('inert', '');
                    element.setAttribute('aria-busy', 'true');
                });
            };

            const releaseShell = () => {
                inertedShellRef.current.forEach((element) => {
                    element.removeAttribute('inert');
                    element.removeAttribute('aria-busy');
                });
                inertedShellRef.current = [];
            };

            // The show's `onComplete`: release the page, and record that this
            // document has now had its boot, so a later remount skips it.
            const finishShow = () => {
                releaseShell();
                bootedThisDocument = true;
            };

            // One timeline serves both the full show and the repeat-visit
            // encore; `speed` compresses every duration and offset, so an
            // encore is the same sequence played fast rather than a different
            // (and rotting) copy. Beats: ignite -> HUD + boot log -> gauge and
            // decrypt run together -> lock-on -> centre-out interlaced shutter.
            const speed = readSeen() && force !== 'full' ? 0.6 : 1.4;
            const d = (n: number) => n * speed;

            const tl = gsap.timeline({
                defaults: { ease: 'power1.inOut' },
                onComplete: finishShow,
            });

            // 1. CRT ignite: one hot line across the screen.
            if (ignite) {
                tl.fromTo(
                    ignite,
                    { autoAlpha: 1, scaleX: 0 },
                    { scaleX: 1, duration: d(0.35), ease: 'expo.out' },
                    0,
                );
                tl.to(ignite, { autoAlpha: 0, duration: d(0.3) }, d(0.3));
            }

            // 2. HUD frame draws outward from its corners.
            if (hud) {
                tl.fromTo(
                    hud,
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: d(0.5), ease: 'power1.out' },
                    d(0.25),
                );
            }
            tl.fromTo(
                bracketsH,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: d(0.5),
                    ease: 'power3.out',
                    stagger: d(0.05),
                },
                d(0.25),
            );
            tl.fromTo(
                bracketsV,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: d(0.5),
                    ease: 'power3.out',
                    stagger: d(0.05),
                },
                d(0.25),
            );

            if (bootHud) {
                tl.fromTo(
                    bootHud,
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: d(0.4), ease: 'power1.out' },
                    d(0.4),
                );
            }
            if (bootHex) {
                tl.fromTo(
                    bootHex,
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: d(0.4), ease: 'power1.out' },
                    d(0.5),
                );
            }

            // 3. Boot log types itself line by line (a stepped clip reads as
            // typing without needing a text-swap loop).
            if (bootLog) {
                tl.fromTo(
                    bootLog,
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: d(0.2) },
                    d(0.45),
                );
                tl.fromTo(
                    bootItems,
                    { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' },
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        duration: d(0.3),
                        ease: 'steps(16)',
                        stagger: d(0.4),
                    },
                    d(0.5),
                );
            }

            // 4. Gauge: three uneven bursts, like real loading, ending at 2.5.
            const counter = { v: 0 };
            const burst = (
                to: number,
                duration: number,
                ease: string,
                at: number | string,
            ) =>
                tl.to(
                    counter,
                    {
                        v: to,
                        duration: d(duration),
                        ease,
                        onUpdate: () => setReadout(counter.v),
                    },
                    at,
                );
            burst(34, 0.6, 'power2.out', d(0.5));
            burst(71, 0.7, 'none', '>');
            burst(100, 0.7, 'power2.inOut', '>');

            // 5. Decrypt sweeps the name and lands exactly as the gauge fills.
            tl.to(
                decrypt,
                {
                    p: 1,
                    duration: d(1.65),
                    ease: 'none',
                    onStart: startDecrypt,
                    onUpdate: tickDecrypt,
                    onComplete: endDecrypt,
                },
                d(0.85),
            );

            tl.call(() => markSeen(), [], d(2.5));

            // 6. Shutter: slats leave in alternating directions starting from
            // the centre, each carrying the light edge on its leading side.
            const shutterAt = d(3.1);
            const fromCentre = { each: d(0.07), from: 'center' as const };
            tl.to(
                slats,
                {
                    y: (i: number) => (i % 2 ? '100%' : '-100%'),
                    duration: d(0.6),
                    ease: 'power3.inOut',
                    stagger: fromCentre,
                },
                shutterAt,
            );
            tl.to(
                edges,
                { opacity: 1, duration: d(0.2), stagger: fromCentre },
                shutterAt,
            );
            tl.to(
                [nameWrap, bootHud, bootLog, bootHex, hud].filter(Boolean),
                { autoAlpha: 0, duration: d(0.35) },
                shutterAt,
            );
            tl.to(el, { autoAlpha: 0, duration: d(0.5) }, shutterAt + d(1.05));

            // Armed last, once the timeline is built: anything thrown while
            // building it leaves the page reachable instead of inert.
            markShellBusy();
        },
        { scope: preloaderRef },
    );

    // Already booted in this document (we are back from a project page): render
    // nothing. The effect above finds no element and returns, so the shell is
    // never inerted and no cover ever flashes.
    if (skipShow) return null;

    return (
        <div
            className="preloader-shell fixed inset-0 z-[9999] flex overflow-hidden"
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
                    {/* Light edge on the slat's leading side: even slats leave
                        upward (edge at the bottom), odd ones downward (top). */}
                    <span
                        className={`slat-edge absolute inset-x-0 h-[2px] bg-primary/40 opacity-0 shadow-[0_0_14px_hsl(var(--primary)/0.6)] ${i % 2 ? 'top-0' : 'bottom-0'}`}
                    />
                </div>
            ))}

            {/* CRT ignite: the single hot line the show opens with. */}
            <div
                aria-hidden="true"
                className="ignite-line pointer-events-none absolute inset-x-0 top-1/2 h-px bg-primary opacity-0 shadow-[0_0_24px_4px_hsl(var(--primary)/0.8)]"
            />

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

            {/* Boot log: the site's real inventory, typed out. Desktop only,
                the phone gets the name and gauge. */}
            <div
                aria-hidden="true"
                className="boot-log pointer-events-none absolute bottom-20 left-6 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-primary/60 opacity-0 sm:block md:bottom-24 md:left-12 md:text-xs"
            >
                {BOOT_LINES.map((line) => (
                    <p
                        key={line.cmd}
                        className="boot-line-item flex min-w-[17rem] justify-between gap-6 whitespace-nowrap opacity-0"
                    >
                        <span>
                            <span className="text-primary">$</span> {line.cmd}
                        </span>
                        <span className="text-primary">{line.res}</span>
                    </p>
                ))}
                <p className="boot-line-item whitespace-nowrap opacity-0">
                    <span className="text-primary">$</span>{' '}
                    <span className="preloader-cursor inline-block h-3 w-1.5 translate-y-[2px] bg-primary" />
                </p>
            </div>

            {/* Memory address ticks with the gauge. */}
            <div
                aria-hidden="true"
                className="boot-hex pointer-events-none absolute right-6 top-20 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-primary/60 opacity-0 sm:block md:right-12 md:top-24 md:text-xs"
            >
                MEM{' '}
                <span ref={hexRef} className="tabular-nums text-primary">
                    0x0000
                </span>
            </div>

            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-12 px-4"
            >
                {/* The name decrypts in place: letters start as noise and lock
                    as the scan beam passes. `.name-mask` still gives the glow
                    its room (padding/negative margin) and fades the bottom. */}
                <div className="name-wrap relative">
                    <p className="name-text name-mask flex whitespace-nowrap text-[clamp(3rem,14vw,12.5rem)] font-anton leading-none">
                        {renderLetters(NAME_FIRST)}
                        <span className="inline-block">&nbsp;</span>
                        {renderLetters(NAME_LAST, GLOW_CLASS)}
                    </p>

                    {/* Scan beam that crosses the name during the decrypt. */}
                    <span className="scan-beam pointer-events-none absolute -top-4 -bottom-4 left-0 w-px bg-primary opacity-0 shadow-[0_0_18px_3px_hsl(var(--primary)/0.85)]" />

                    {/* Lock-on reticle: four sharp arms around the name. */}
                    <div className="reticle pointer-events-none absolute -inset-x-4 -inset-y-2 opacity-0">
                        <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-primary" />
                        <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-primary" />
                        <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-primary" />
                        <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-primary" />
                    </div>

                    {/* Shockwave: a single square outline that leaves the name
                        on lock. Sized by GSAP, centred by flex. */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="lock-ring h-24 w-24 flex-shrink-0 border border-primary opacity-0" />
                    </div>
                </div>

                {/* Boot readout: `$` prompt and right-aligned counter above a
                    segmented gauge, mirroring the menu's
                    `$ Section ... 07 items` header row. */}
                <div className="boot-hud flex w-[min(80vw,28rem)] flex-col gap-2 opacity-0">
                    <div className="boot-line flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary/70 sm:text-xs">
                        <span className="truncate">
                            <span className="text-primary">$</span>{' '}
                            <span ref={labelRef}>LOADING PORTFOLIO</span>
                        </span>
                        <span className="flex-shrink-0 tabular-nums tracking-normal">
                            <span ref={counterRef} className="text-primary">
                                000
                            </span>
                            %
                        </span>
                    </div>
                    <div
                        className="flex h-3 w-full gap-[2px]"
                        aria-hidden="true"
                    >
                        {Array.from({ length: GAUGE_CELLS }).map((_, i) => (
                            <span
                                key={i}
                                ref={(node) => {
                                    cellsRef.current[i] = node;
                                }}
                                className="flex-1 bg-primary/15 data-[on=true]:bg-primary/80 data-[head=true]:bg-primary data-[head=true]:shadow-[0_0_10px_hsl(var(--primary)/0.9)]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
