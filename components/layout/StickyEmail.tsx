'use client';

import { GENERAL_INFO } from '@/lib/data';
import { isProjectDetailPage } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const ORIGINAL_ITEM_COUNT = 3;
const RENDERED_SET_COUNT = 3;
const TOTAL_RENDERED_ITEMS = ORIGINAL_ITEM_COUNT * RENDERED_SET_COUNT;

const StickyEmail = () => {
    const pathname = usePathname();
    const marqueeRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (!marqueeRef.current || prefersReducedMotion) return;

        const marquee = marqueeRef.current;
        const firstItem = marquee.children[0] as HTMLElement | undefined;
        const secondSetFirstItem = marquee.children[
            ORIGINAL_ITEM_COUNT
        ] as HTMLElement | undefined;

        if (!firstItem || !secondSetFirstItem) return;

        const firstRect = firstItem.getBoundingClientRect();
        const secondRect = secondSetFirstItem.getBoundingClientRect();
        const totalDistance = secondRect.top - firstRect.top;

        if (totalDistance <= 0) return;

        const animation = gsap.fromTo(
            marquee,
            { y: 0 },
            {
                y: -totalDistance,
                duration: 20,
                ease: 'none',
                repeat: -1,
            }
        );

        animationRef.current = animation;

        return () => {
            animation.kill();
            gsap.set(marquee, { y: 0 });
        };
    }, [prefersReducedMotion, pathname]);

    useEffect(() => {
        if (isHovered) {
            animationRef.current?.pause();
        } else {
            animationRef.current?.resume();
        }
    }, [isHovered]);

    if (isProjectDetailPage(pathname)) return null;

    return (
        <div
            className="max-xl:hidden fixed top-0 bottom-0 left-0 overflow-hidden
                       before:absolute before:inset-x-0 before:top-0 before:h-32 before:z-10
                       before:bg-gradient-to-b before:from-background before:to-transparent
                       after:absolute after:inset-x-0 after:bottom-0 after:h-32 after:z-10
                       after:bg-gradient-to-t after:from-background after:to-transparent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div ref={marqueeRef} className="flex flex-col" style={{ gap: '120px' }}>
                {Array.from({ length: TOTAL_RENDERED_ITEMS }).map((_, index) => {
                    const isDuplicateSet = index >= ORIGINAL_ITEM_COUNT;

                    return (
                        <a
                            key={index}
                            href={`mailto:${GENERAL_INFO.email}`}
                            aria-hidden={isDuplicateSet ? 'true' : undefined}
                            tabIndex={isDuplicateSet ? -1 : undefined}
                            className="px-3 text-muted-foreground tracking-[1px] transition-all hover:text-primary"
                            style={{
                                textOrientation: 'mixed',
                                writingMode: 'vertical-rl',
                            }}
                        >
                            {GENERAL_INFO.email}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default StickyEmail;
