'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef, useState, useEffect } from 'react';

const ParticleBackground = () => {
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const [particleCount, setParticleCount] = useState(100);

    // Adjust particle count based on screen size
    useEffect(() => {
        const updateParticleCount = () => {
            setParticleCount(window.innerWidth < 768 ? 40 : 100);
        };

        updateParticleCount();
        window.addEventListener('resize', updateParticleCount);
        return () => window.removeEventListener('resize', updateParticleCount);
    }, []);

    useGSAP(() => {
        particlesRef.current.forEach((particle) => {
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
                // yoyo: true,
            });
        });
    }, [particleCount]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {[...Array(particleCount)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        particlesRef.current.push(el!);
                    }}
                    className="absolute rounded-full bg-white"
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
