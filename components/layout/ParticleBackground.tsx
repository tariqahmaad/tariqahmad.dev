'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef, useState, useEffect, memo } from 'react';

const PARTICLE_COUNT = 40;
const MOBILE_PARTICLE_COUNT = 16;
// Extra distance past the viewport edges so a cycle wraps fully off-screen.
const PARTICLE_TRAVEL_MARGIN = 60;

const ParticleBackground = memo(function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [particleCount, setParticleCount] = useState(PARTICLE_COUNT);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Adjust particle count based on screen size and motion preference
    useEffect(() => {
        if (prefersReducedMotion) {
            setParticleCount(0);
            return;
        }

        const updateParticleCount = () => {
            setParticleCount(window.innerWidth < 768 ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT);
        };

        updateParticleCount();
        window.addEventListener('resize', updateParticleCount);
        return () => window.removeEventListener('resize', updateParticleCount);
    }, [prefersReducedMotion]);

    useGSAP(
        () => {
            if (prefersReducedMotion || particleCount === 0) return;

            // One read for the whole batch instead of one per particle.
            const { innerWidth, innerHeight } = window;
            const travel = innerHeight + PARTICLE_TRAVEL_MARGIN;

            const animations = particlesRef.current.map((particle) => {
                if (!particle) return;

                // Start above the viewport and travel past the bottom edge, so the
                // repeat wraps off-screen instead of teleporting back into view.
                const startY = -Math.random() * travel;

                gsap.set(particle, {
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    opacity: Math.random(),
                    x: Math.random() * innerWidth,
                    y: startY,
                });

                return gsap.to(particle, {
                    y: startY + travel,
                    duration: Math.random() * 10 + 10,
                    opacity: 0,
                    repeat: -1,
                    ease: 'none',
                });
            });

            return () => {
                animations.forEach((animation) => animation?.kill());
            };
        },
        { dependencies: [particleCount, prefersReducedMotion], revertOnUpdate: true },
    );

    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none"
        >
            {[...Array(particleCount)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current[i] = el;
                    }}
                    className={`absolute ${i % 5 === 0 ? 'bg-secondary' : 'bg-primary'} shadow-[0_0_6px_rgba(0,255,0,0.45)]`}
                />
            ))}
        </div>
    );
});

export default ParticleBackground;
