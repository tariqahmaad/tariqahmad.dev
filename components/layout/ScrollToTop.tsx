'use client';

import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUp, ChevronsUp } from 'lucide-react';

const SCROLL_THRESHOLD = 400;
const SCROLL_TOLERANCE = 5;
const PROGRESS_RING_RADIUS = 18;
const PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS;

const ScrollToTop = () => {
    const containerRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const progressRingRef = useRef<SVGCircleElement>(null);
    
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [clickSuccess, setClickSuccess] = useState(false);
    
    const lastScrollYRef = useRef(0);
    
    const prefersReducedMotion = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateVisibility = useCallback(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;
        
        if (Math.abs(scrollDelta) < SCROLL_TOLERANCE) return;
        
        const isScrollingDown = scrollDelta > 0;
        const pastThreshold = currentScrollY > SCROLL_THRESHOLD;
        const shouldBeVisible = pastThreshold && !isScrollingDown;
        
        setIsVisible(shouldBeVisible);
        lastScrollYRef.current = currentScrollY;
        
        if (progressRingRef.current) {
            const { scrollHeight, clientHeight } = document.documentElement;
            const scrollableHeight = scrollHeight - clientHeight;
            const progress = Math.min(currentScrollY / scrollableHeight, 1);
            const offset = PROGRESS_RING_CIRCUMFERENCE - progress * PROGRESS_RING_CIRCUMFERENCE;
            progressRingRef.current.style.strokeDashoffset = String(offset);
        }
    }, []);

    useEffect(() => {
        lastScrollYRef.current = window.scrollY;
        updateVisibility();
        
        window.addEventListener('scroll', updateVisibility, { passive: true });
        return () => window.removeEventListener('scroll', updateVisibility);
    }, [updateVisibility]);

    useGSAP(() => {
        if (prefersReducedMotion) return;
        
        if (isVisible) {
            gsap.fromTo(
                containerRef.current,
                { y: 100, opacity: 0, scale: 0.8 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                }
            );
            
            gsap.fromTo(
                glowRef.current,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1.5,
                    opacity: 0.6,
                    duration: 0.6,
                    ease: 'power2.out',
                }
            );
        } else if (containerRef.current) {
            gsap.to(containerRef.current, {
                y: 100,
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: 'power2.in',
            });
        }
    }, [isVisible]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (prefersReducedMotion) return;
        
        gsap.to(containerRef.current, { 
            scale: 1.05, 
            duration: 0.3, 
            ease: 'power2.out' 
        });
        gsap.to(iconRef.current, { 
            y: -2, 
            duration: 0.2, 
            ease: 'power2.out' 
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (prefersReducedMotion) return;
        
        gsap.to(containerRef.current, { 
            scale: 1, 
            duration: 0.3, 
            ease: 'power2.out' 
        });
        gsap.to(iconRef.current, { 
            y: 0, 
            duration: 0.2, 
            ease: 'power2.out' 
        });
    };

    const scrollToTop = () => {
        if (clickSuccess) return;
        
        if (!prefersReducedMotion) {
            gsap.to(containerRef.current, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
            });
            
            gsap.to(glowRef.current, {
                scale: 2,
                opacity: 1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
            });
        }
        
        setClickSuccess(true);
        setTimeout(() => setClickSuccess(false), 600);
        
        const lenis = (window as Window & { lenis?: { scrollTo: (target: string | number) => void } }).lenis;
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderIcon = () => {
        if (clickSuccess) {
            return (
                <ChevronsUp
                    className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] animate-bounce"
                    strokeWidth={2.5}
                />
            );
        }
        if (isHovered) {
            return (
                <ChevronsUp
                    className="w-5 h-5 text-primary drop-shadow-[0_0_6px_rgba(0,255,0,0.6)]"
                    strokeWidth={2.5}
                />
            );
        }
        return (
            <ArrowUp
                className="w-5 h-5 text-primary/90 group-hover:text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.4)] transition-all duration-300"
                strokeWidth={2.5}
            />
        );
    };

    if (!isVisible) return null;

    return (
        <button
            ref={containerRef}
            onClick={scrollToTop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-8 right-[2%] z-50 group opacity-0"
            aria-label="Scroll to top"
            role="button"
            tabIndex={isVisible ? 0 : -1}
            data-cursor-hide
        >
            <div
                ref={glowRef}
                className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:bg-primary/40 transition-colors duration-300"
            />

            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background-light/90 border border-primary/30 backdrop-blur-md transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/5 shadow-[0_0_20px_rgba(0,255,0,0.1)] group-hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                
                <svg
                    className="absolute top-0 right-0 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M5 2 H14 M14 2 V11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.5)]"
                    />
                </svg>
                <svg
                    className="absolute bottom-0 left-0 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M11 14 H2 M2 14 V5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary drop-shadow-[0_0_4px_rgba(0,255,0,0.5)]"
                    />
                </svg>

                <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 44 44"
                >
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="hsl(var(--primary) / 0.15)"
                        strokeWidth="1.5"
                    />
                    <circle
                        ref={progressRingRef}
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="hsl(var(--primary) / 0.6)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={PROGRESS_RING_CIRCUMFERENCE}
                        strokeDashoffset={PROGRESS_RING_CIRCUMFERENCE}
                        className="drop-shadow-[0_0_4px_rgba(0,255,0,0.5)] transition-all duration-100"
                    />
                </svg>

                <div ref={iconRef} className="relative z-10">
                    {renderIcon()}
                </div>

                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,255,0,0.05)]" />
                
                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
            </div>

            <style jsx>{`
                @keyframes breathe {
                    0%, 100% { opacity: 0.2; transform: scale(1.5); }
                    50% { opacity: 0.4; transform: scale(1.7); }
                }
                
                button:not(:hover) > div:first-child {
                    animation: breathe 3s ease-in-out infinite;
                }
            `}</style>
        </button>
    );
};

export default ScrollToTop;