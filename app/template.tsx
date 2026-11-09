'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import {
    openShutter,
    SLAT_COUNT,
    transitionLabel,
} from '@/lib/page-transition';

export default function Template({ children }: { children: React.ReactNode }) {
    const coverRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useGSAP(
        () => {
            const cover = coverRef.current;
            if (!cover) return;

            // The shutter is a server-rendered, fully closed cover that only
            // GSAP opens. Under reduced motion, hide it immediately instead of
            // playing the transition.
            if (
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                gsap.set(cover, { autoAlpha: 0 });
                return;
            }

            // A route that just mounted is always arrived at closed: either
            // `TransitionLink` closed the old page's shutter first, or this is a
            // direct load / back-forward, where cutting to a closed wall and
            // opening it is the same motion. The short hold keeps the label
            // readable. Timing lives in lib/page-transition.ts.
            openShutter(cover);
        },
        { scope: coverRef },
    );

    return (
        <div>
            {/* The preloader's slat shutter, as the site-wide page transition.
                Decorative only: `pointer-events-none` keeps it from swallowing
                clicks while it moves. `app/layout.tsx` hides it via <noscript>
                so a JS failure cannot leave the page covered. */}
            <div
                ref={coverRef}
                aria-hidden="true"
                className="page-transition pointer-events-none fixed inset-0 z-[9000] flex overflow-hidden"
            >
                {Array.from({ length: SLAT_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        // 1px wider than a tenth and pulled back by the same
                        // amount, so fractional widths never leave a hairline
                        // seam between slats.
                        className="page-slat relative -mr-px h-full w-[calc(10%+1px)] flex-none bg-black will-change-transform"
                    >
                        {/* Light edge on the slat's leading side: even slats
                            travel up (edge at the bottom), odd ones down. */}
                        <span
                            className={`page-slat-edge absolute inset-x-0 h-[2px] bg-primary/50 opacity-0 shadow-[0_0_14px_hsl(var(--primary)/0.6)] ${i % 2 ? 'top-0' : 'bottom-0'}`}
                        />
                    </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <p className="page-label whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-primary/80 sm:text-xs">
                        <span className="text-primary">$</span>{' '}
                        <span className="page-label-text">
                            cd {transitionLabel(pathname)}
                        </span>
                        <span className="preloader-cursor ml-1 inline-block h-3 w-1.5 translate-y-[2px] bg-primary" />
                    </p>
                </div>
            </div>

            {children}
        </div>
    );
}
