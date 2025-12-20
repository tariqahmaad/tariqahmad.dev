import { useState, useEffect, useRef } from 'react';

// Tech-focused glitch characters
export const GLITCH_CHARS = '01█▓▒░<>{}[]|/\\';

export type AnimationPhase = 'stable' | 'exiting' | 'entering';

export const useGlitchText = (
    targetText: string,
    phase: AnimationPhase,
    delay: number = 0,
) => {
    const [displayText, setDisplayText] = useState(targetText);
    const [opacity, setOpacity] = useState(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
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
                                if (index > textLength - iteration / 2.5) {
                                    return GLITCH_CHARS[
                                        Math.floor(
                                            Math.random() * GLITCH_CHARS.length,
                                        )
                                    ];
                                }
                                return targetText[index];
                            })
                            .join(''),
                    );

                    setOpacity(
                        Math.max(0.3, 1 - (iteration / maxIterations) * 0.7),
                    );

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
                                return GLITCH_CHARS[
                                    Math.floor(
                                        Math.random() * GLITCH_CHARS.length,
                                    )
                                ];
                            })
                            .join(''),
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
