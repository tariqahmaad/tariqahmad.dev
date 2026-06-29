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
