import { useState, useEffect, useRef } from 'react';

// Tech-focused glitch characters
export const GLITCH_CHARS = '01█▓▒░<>{}[]|/\\';

export type AnimationPhase = 'stable' | 'exiting' | 'entering';

export interface GlitchTextValue {
    displayText: string;
    opacity: number;
}

// Reduced-motion users get an instant text swap with no scramble.
const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const randomGlitchChar = (): string =>
    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

// ~40 character swaps per second. Driven by requestAnimationFrame so the
// cadence stays aligned with paint and pauses when the tab is hidden.
const SCRAMBLE_TICK_MS = 25;

export const useGlitchText = (
    targetText: string,
    phase: AnimationPhase,
    delay: number = 0,
): GlitchTextValue => {
    const [value, setValue] = useState<GlitchTextValue>({
        displayText: targetText,
        opacity: 1,
    });
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        // Stable phase, empty input, or reduced motion: show the resolved
        // word with no animation.
        if (
            typeof targetText !== 'string' ||
            !targetText ||
            phase === 'stable' ||
            prefersReducedMotion()
        ) {
            setValue({ displayText: targetText ?? '', opacity: 1 });
            return;
        }

        const textLength = targetText.length;
        const isExiting = phase === 'exiting';
        const maxIterations = isExiting ? textLength * 2.5 : textLength * 3;

        // Build one frame of the scramble for a given iteration count.
        //  - exiting: corruption sweeps in from the right edge.
        //  - entering: real characters resolve from the left edge.
        const buildFrame = (iteration: number): GlitchTextValue => {
            let display = '';

            if (isExiting) {
                const boundary = textLength - iteration / 2.5;
                for (let i = 0; i < textLength; i++) {
                    const ch = targetText[i];
                    if (ch === ' ' || ch === '-') {
                        display += ch;
                    } else {
                        display += i > boundary ? randomGlitchChar() : ch;
                    }
                }
                const opacity = Math.max(
                    0.3,
                    1 - (iteration / maxIterations) * 0.7,
                );
                return { displayText: display, opacity };
            }

            const boundary = iteration / 3;
            for (let i = 0; i < textLength; i++) {
                const ch = targetText[i];
                if (ch === ' ' || ch === '-') {
                    display += ch;
                } else {
                    display += i < boundary ? ch : randomGlitchChar();
                }
            }
            const opacity = Math.min(1, 0.3 + (iteration / maxIterations) * 0.7);
            return { displayText: display, opacity };
        };

        let iteration = 0;
        let startTime = 0;

        const step = (now: number) => {
            if (startTime === 0) startTime = now;
            // Account for the per-word start delay (staggered entrance/exit).
            const scrambleElapsed = now - startTime - delay;

            if (scrambleElapsed >= 0) {
                const nextIteration = Math.floor(
                    scrambleElapsed / SCRAMBLE_TICK_MS,
                );
                if (nextIteration !== iteration) {
                    iteration = nextIteration;

                    if (iteration >= maxIterations) {
                        // Resolve cleanly on enter; leave the final corrupted
                        // frame in place on exit (it gets swapped shortly).
                        setValue(
                            isExiting
                                ? buildFrame(maxIterations)
                                : { displayText: targetText, opacity: 1 },
                        );
                        frameRef.current = null;
                        return;
                    }
                    setValue(buildFrame(iteration));
                }
            }

            frameRef.current = requestAnimationFrame(step);
        };

        frameRef.current = requestAnimationFrame(step);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [targetText, phase, delay]);

    return value;
};

// ── Lookalike flicker ─────────────────────────────────────────────────────
// While a word sits resolved (Banner stable phase), random characters briefly
// morph into visually similar glyphs (I → ! / |, E → 3 €, R → ® Я …).
// Single characters only, so string length — and layout — never shifts.
// Letters with no good single-char twin have no entry and act as stable
// anchors, keeping flickered words readable.

export const LOOKALIKE_MAP: Record<string, string[]> = {
    A: ['4', '@'],
    B: ['8', 'ß'],
    C: ['(', '<'],
    D: ['Ð'],
    E: ['3', '€', '∃'],
    G: ['6'],
    H: ['#'],
    I: ['!', '!', '/', '/', '|', '1'],
    L: ['1', '£'],
    O: ['0'],
    P: ['¶'],
    R: ['®', 'Я'],
    S: ['5', '$', '§'],
    T: ['7', '+'],
    X: ['×'],
    Y: ['¥'],
    Z: ['2'],
    '0': ['O'],
    '1': ['I', '|'],
    '3': ['E'],
    '4': ['A'],
    '5': ['S'],
    '6': ['G'],
    '7': ['T'],
    '8': ['B'],
    '/': ['\\', '|'],
};

// Flicker pacing — tunable without touching logic.
const FLICKER_WAIT_MIN_MS = 900;
const FLICKER_WAIT_MAX_MS = 2200;
const FLICKER_LEN_MIN_MS = 120;
const FLICKER_LEN_MAX_MS = 280;
const MAX_MUTATIONS = 3;
// Small screens get a calmer flicker: no surges, no churn re-rolls, wider
// gaps. Clip-path slices + stepped jitter are paint-heavy on low-end GPUs,
// and the hero already competes with particles for the frame budget.
const SMALL_SCREEN_PX = 640;
const SMALL_SCREEN_WAIT_MULT = 1.5;
// Surge events: rarer, violent, longer. The shake upgrades to match.
const SURGE_ODDS = 0.15;
const SURGE_LEN_MIN_MS = 350;
const SURGE_LEN_MAX_MS = 550;
const SURGE_MAX_MUTATIONS = 5;
// While a window is open the corruption re-rolls this often, so glyphs
// churn instead of sitting frozen mid-shake.
const CHURN_TICK_MS = 70;
// Chance a chosen position corrupts to a block char instead of a lookalike,
// tying the flicker alphabet back to the scramble one.
const BLOCK_CHAR_ODDS = 0.1;
const BLOCK_CHARS = '█▓▒░';

const rand = (min: number, max: number): number =>
    min + Math.random() * (max - min);

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export interface LookalikeFlickerValue {
    text: string;
    active: boolean;
    surge: boolean;
}

export const useLookalikeFlicker = (
    targetText: string,
    enabled: boolean,
    seedDelay: number = 0,
): LookalikeFlickerValue => {
    const [value, setValue] = useState<LookalikeFlickerValue>({
        text: targetText ?? '',
        active: false,
        surge: false,
    });

    useEffect(() => {
        // Disabled, empty, or reduced motion: resolved word, no timers.
        if (
            typeof targetText !== 'string' ||
            !targetText ||
            !enabled ||
            prefersReducedMotion()
        ) {
            setValue({ text: targetText ?? '', active: false, surge: false });
            return;
        }

        // Positions eligible for mutation (have lookalikes; skip structural
        // space/hyphen even if a map entry ever appears for them).
        const eligible = [...targetText]
            .map((ch, i) => ({ ch, i }))
            .filter(
                ({ ch }) =>
                    ch !== ' ' && ch !== '-' && LOOKALIKE_MAP[ch] !== undefined,
            );
        if (eligible.length === 0) {
            setValue({ text: targetText, active: false, surge: false });
            return;
        }

        const ids: NodeJS.Timeout[] = [];
        let churnId: NodeJS.Timeout | null = null;
        let cancelled = false;
        let lastIndexes: number[] = [];
        const smallScreen = window.innerWidth < SMALL_SCREEN_PX;

        const mutate = (count: number): string => {
            // Prefer positions untouched by the previous roll for variety.
            const fresh = eligible.filter(({ i }) => !lastIndexes.includes(i));
            const pool = fresh.length > 0 ? fresh : eligible;
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const chosen = shuffled.slice(0, count);
            lastIndexes = chosen.map(({ i }) => i);

            const chars = [...targetText];
            for (const { ch, i } of chosen) {
                chars[i] =
                    Math.random() < BLOCK_CHAR_ODDS
                        ? pick([...BLOCK_CHARS])
                        : pick(LOOKALIKE_MAP[ch]);
            }
            return chars.join('');
        };

        const stopChurn = () => {
            if (churnId !== null) {
                clearInterval(churnId);
                churnId = null;
            }
        };

        const runWindow = () => {
            const surge = !smallScreen && Math.random() < SURGE_ODDS;
            const ceiling = Math.min(
                surge ? SURGE_MAX_MUTATIONS : MAX_MUTATIONS,
                eligible.length,
            );
            const count = 1 + Math.floor(Math.random() * ceiling);
            const len = surge
                ? rand(SURGE_LEN_MIN_MS, SURGE_LEN_MAX_MS)
                : rand(FLICKER_LEN_MIN_MS, FLICKER_LEN_MAX_MS);

            if (cancelled) return;
            setValue({ text: mutate(count), active: true, surge });
            // Desktop only: re-roll the corruption mid-window so glyphs
            // churn. Small screens hold one static mutation per window.
            if (!smallScreen) {
                churnId = setInterval(() => {
                    if (cancelled) return;
                    setValue({ text: mutate(count), active: true, surge });
                }, CHURN_TICK_MS);
            }

            ids.push(
                setTimeout(() => {
                    stopChurn();
                    if (cancelled) return;
                    setValue({ text: targetText, active: false, surge: false });
                    scheduleNext();
                }, len),
            );
        };

        const scheduleNext = () => {
            ids.push(
                setTimeout(
                    () => {
                        if (cancelled) return;
                        runWindow();
                    },
                    rand(FLICKER_WAIT_MIN_MS, FLICKER_WAIT_MAX_MS) *
                        (smallScreen ? SMALL_SCREEN_WAIT_MULT : 1),
                ),
            );
        };

        ids.push(setTimeout(scheduleNext, seedDelay));

        return () => {
            cancelled = true;
            stopChurn();
            ids.forEach(clearTimeout);
            setValue({ text: targetText, active: false, surge: false });
        };
    }, [targetText, enabled, seedDelay]);

    return value;
};

// ── Lagged value (RGB trails) ─────────────────────────────────────────────
// Returns `value` instantly while `lagging` is false; once enabled, trails
// `delayMs` behind. Snaps on the false→true transition so no stale frame
// leaks through at the switchover.
export const useLaggedValue = (
    value: string,
    delayMs: number,
    lagging: boolean,
): string => {
    const [lagged, setLagged] = useState(value);
    const prevLagging = useRef(lagging);

    useEffect(() => {
        if (!lagging) {
            prevLagging.current = false;
            return;
        }
        if (!prevLagging.current) {
            // Fresh switchover: snap, then trail from here.
            prevLagging.current = true;
            setLagged(value);
            return;
        }
        const id = setTimeout(() => setLagged(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs, lagging]);

    return lagging ? lagged : value;
};
