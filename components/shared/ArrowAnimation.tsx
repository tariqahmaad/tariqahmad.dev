'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useId, useRef } from 'react';

interface ArrowAnimationProps {
    className?: string;
}

const ArrowAnimation = ({ className = '' }: ArrowAnimationProps) => {
    // Two instances are mounted at once (Banner + ProjectDetails), so the id and
    // every selector must be unique per instance.
    const svgId = useId();
    const svgRef = useRef<SVGSVGElement>(null);
    const arrow1Ref = useRef<SVGPathElement>(null);
    const arrow2Ref = useRef<SVGPathElement>(null);

    useGSAP(
        () => {
            const svg = svgRef.current;
            const arrow1 = arrow1Ref.current;
            const arrow2 = arrow2Ref.current;

            if (!svg || !arrow1 || !arrow2) return;

            // getTotalLength() is 0 until the SVG is laid out; the draw-in would be
            // invisible, so fall back to the resting state instead of animating.
            const length1 = arrow1.getTotalLength();
            const length2 = arrow2.getTotalLength();

            if (!length1 || !length2) {
                gsap.set(svg, { fill: 'transparent', autoAlpha: 1 });
                return;
            }

            // Endless looping is decorative only — reduced-motion users get the
            // arrow in its final state with no timeline at all.
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set(svg, { fill: 'transparent', autoAlpha: 1, y: 0 });
                gsap.set([arrow1, arrow2], {
                    strokeDasharray: 'none',
                    strokeDashoffset: 0,
                });
                return;
            }

            gsap.set(svg, { fill: 'transparent', autoAlpha: 0 });
            gsap.set(arrow1, {
                strokeDasharray: length1,
                strokeDashoffset: length1,
            });
            gsap.set(arrow2, {
                strokeDasharray: length2,
                strokeDashoffset: length2,
            });

            const tl = gsap.timeline({ repeat: -1 });

            tl.to(svg, { autoAlpha: 1, duration: 0.1 });
            tl.to([arrow1, arrow2], {
                duration: 2,
                delay: 1,
                strokeDashoffset: 0,
            });
            tl.to(svg, {
                duration: 0.5,
                delay: 0.5,
                fill: 'rgba(0, 255, 60, 0.06)',
            });
            tl.to(svg, {
                duration: 0.8,
                y: 300,
                opacity: 0,
            });
            tl.set(svg, {
                fill: 'transparent',
                y: 0,
                autoAlpha: 0,
            });
        },
        { scope: svgRef },
    );

    return (
        <svg
            id={svgId}
            aria-hidden="true"
            width="376"
            height="111"
            viewBox="0 0 376 111"
            fill="transparent"
            xmlns="http://www.w3.org/2000/svg"
            className={`block left-1/2 -translate-x-1/2 z-10 pointer-events-none ${className || 'absolute bottom-52 md:bottom-20'}`}
            style={{ overflow: 'hidden' }}
            ref={svgRef}
        >
            <path
                className="svg-arrow svg-arrow-1"
                d="M1 1V39.9286L188 110V70.6822L1 1Z"
                style={{ stroke: 'hsl(var(--primary) / 0.4)' }}
                ref={arrow1Ref}
            />
            <path
                className="svg-arrow svg-arrow-2"
                d="M375 1V39.9286L188 110V70.6822L375 1Z"
                style={{ stroke: 'hsl(var(--secondary) / 0.4)' }}
                ref={arrow2Ref}
            />
        </svg>
    );
};

export default ArrowAnimation;
