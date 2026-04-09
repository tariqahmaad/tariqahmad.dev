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
    const [intensity, setIntensity] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const burstTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Validate inputs - handle edge cases gracefully
        if (typeof targetText !== 'string' || !targetText) {
            setDisplayText(typeof targetText === 'string' ? targetText : '');
            setOpacity(1);
            setIntensity(0);
            return;
        }

        // Clear any existing intervals/timeouts
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);

        setIntensity(0);

        if (phase === 'stable') {
            setDisplayText(targetText);
            setOpacity(1);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            const textLength = targetText.length;
            let iteration = 0;

            // Random burst effect - occasionally spike intensity
            // Note: We already returned early if phase === 'stable', so phase is 'exiting' | 'entering'
            const triggerBurst = () => {
                setIntensity(1);
                burstTimeoutRef.current = setTimeout(() => {
                    setIntensity(0);
                    // Schedule next potential burst
                    const nextBurstDelay = 100 + Math.random() * 200;
                    burstTimeoutRef.current = setTimeout(triggerBurst, nextBurstDelay);
                }, 80 + Math.random() * 40);
            };

            // Initial burst trigger
            const initialBurstDelay = 50 + Math.random() * 100;
            burstTimeoutRef.current = setTimeout(triggerBurst, initialBurstDelay);

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
                        if (burstTimeoutRef.current) {
                            clearTimeout(burstTimeoutRef.current);
                            burstTimeoutRef.current = null;
                        }
                    }
                }, 25);
            } else { // phase === 'entering'
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
                        if (burstTimeoutRef.current) {
                            clearTimeout(burstTimeoutRef.current);
                            burstTimeoutRef.current = null;
                        }
                        setDisplayText(targetText);
                        setOpacity(1);
                        setIntensity(0);
                    }
                }, 28);
            }
        }, delay);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
        };
    }, [targetText, phase, delay]);

    return { displayText, opacity, intensity };
};
