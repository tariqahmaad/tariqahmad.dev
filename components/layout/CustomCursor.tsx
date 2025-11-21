'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef } from 'react';

const CustomCursor = () => {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);

    useGSAP((context, contextSafe) => {
        if (window.innerWidth < 768) return;

        const handleMouseMove = contextSafe?.((e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Animate the dot (fast, follows cursor immediately)
            gsap.to(cursorDotRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.1,
                ease: 'power2.out',
            });

            // Animate the outline (slower, creates trailing effect)
            gsap.to(cursorOutlineRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.3,
                ease: 'power2.out',
            });
        }) as any;

        const handleMouseEnter = contextSafe?.(() => {
            gsap.to([cursorDotRef.current, cursorOutlineRef.current], {
                opacity: 1,
                duration: 0.3,
            });
        }) as any;

        const handleMouseLeave = contextSafe?.(() => {
            gsap.to([cursorDotRef.current, cursorOutlineRef.current], {
                opacity: 0,
                duration: 0.3,
            });
        }) as any;

        // Scale up on hover over interactive elements
        const handleLinkHover = contextSafe?.(() => {
            gsap.to(cursorOutlineRef.current, {
                scale: 2,
                duration: 0.3,
                ease: 'power2.out',
            });
            gsap.to(cursorDotRef.current, {
                scale: 0,
                duration: 0.3,
            });
        }) as any;

        const handleLinkLeave = contextSafe?.(() => {
            gsap.to(cursorOutlineRef.current, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
            gsap.to(cursorDotRef.current, {
                scale: 1,
                duration: 0.3,
            });
        }) as any;

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select',
        );
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleLinkHover);
            el.addEventListener('mouseleave', handleLinkLeave);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleLinkHover);
                el.removeEventListener('mouseleave', handleLinkLeave);
            });
        };
    });

    return (
        <>
            {/* Cursor Dot - Inner circle */}
            <div
                ref={cursorDotRef}
                className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-primary rounded-full opacity-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ mixBlendMode: 'difference' }}
            />

            {/* Cursor Outline - Outer circle */}
            <div
                ref={cursorOutlineRef}
                className="hidden md:block fixed top-0 left-0 w-10 h-10 border-2 border-primary rounded-full opacity-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ mixBlendMode: 'difference' }}
            />
        </>
    );
};

export default CustomCursor;
