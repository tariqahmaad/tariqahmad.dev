'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useRef, useEffect } from 'react';

const CustomCursor = () => {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);

    useGSAP((context, contextSafe) => {
        if (window.innerWidth < 768) return;

        const handleMouseMove = (e: MouseEvent) => {
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
        };

        const handleMouseEnter = () => {
            gsap.to([cursorDotRef.current, cursorOutlineRef.current], {
                opacity: 1,
                duration: 0.3,
            });
        };

        const handleMouseLeave = () => {
            gsap.to([cursorDotRef.current, cursorOutlineRef.current], {
                opacity: 0,
                duration: 0.3,
            });
        };

        // Scale up on hover over interactive elements
        const handleLinkHover = () => {
            gsap.to(cursorOutlineRef.current, {
                scale: 2,
                duration: 0.3,
                ease: 'power2.out',
            });
            gsap.to(cursorDotRef.current, {
                scale: 0,
                duration: 0.3,
            });
        };

        const handleLinkLeave = () => {
            gsap.to(cursorOutlineRef.current, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
            gsap.to(cursorDotRef.current, {
                scale: 1,
                duration: 0.3,
            });
        };

        // Wrap handlers with contextSafe for proper cleanup
        const safeMouseMove = contextSafe?.(handleMouseMove) ?? handleMouseMove;
        const safeMouseEnter = contextSafe?.(handleMouseEnter) ?? handleMouseEnter;
        const safeMouseLeave = contextSafe?.(handleMouseLeave) ?? handleMouseLeave;
        const safeLinkHover = contextSafe?.(handleLinkHover) ?? handleLinkHover;
        const safeLinkLeave = contextSafe?.(handleLinkLeave) ?? handleLinkLeave;

        window.addEventListener('mousemove', safeMouseMove);
        document.body.addEventListener('mouseenter', safeMouseEnter);
        document.body.addEventListener('mouseleave', safeMouseLeave);

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select',
        );
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', safeLinkHover);
            el.addEventListener('mouseleave', safeLinkLeave);
        });

        return () => {
            window.removeEventListener('mousemove', safeMouseMove);
            document.body.removeEventListener('mouseenter', safeMouseEnter);
            document.body.removeEventListener('mouseleave', safeMouseLeave);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', safeLinkHover);
                el.removeEventListener('mouseleave', safeLinkLeave);
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
