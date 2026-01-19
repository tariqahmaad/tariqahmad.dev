'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef, useState, useEffect, memo } from 'react';

const ParticleBackground = memo(function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [particleCount, setParticleCount] = useState(100);
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
            setParticleCount(window.innerWidth < 768 ? 40 : 100);
        };

        updateParticleCount();
        window.addEventListener('resize', updateParticleCount);
        return () => window.removeEventListener('resize', updateParticleCount);
    }, [prefersReducedMotion]);

    // Reset refs array when particle count changes to prevent accumulation
    useEffect(() => {
        particlesRef.current = [];
    }, [particleCount]);

    useGSAP(() => {
        if (prefersReducedMotion || particleCount === 0) return;

        particlesRef.current.forEach((particle) => {
            if (!particle) return;

            gsap.set(particle, {
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random(),
                left: Math.random() * window.innerWidth,
                top: Math.random() * (window.innerHeight + 1),
            });

            gsap.to(particle, {
                y: window.innerHeight,
                duration: Math.random() * 10 + 10,
                opacity: 0,
                repeat: -1,
                ease: 'none',
            });
        });
    }, [particleCount, prefersReducedMotion]);

    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
        >
            {[...Array(particleCount)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current[i] = el;
                    }}
                    className="absolute rounded-full bg-white"
                />
            ))}
        </div>
    );
});

export default ParticleBackground;
