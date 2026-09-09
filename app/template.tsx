'use client';

import { gsap, useGSAP } from '@/lib/gsap-setup';

export default function Template({ children }: { children: React.ReactNode }) {
    useGSAP(() => {
        // The wipe is a server-rendered full-screen cover that only GSAP
        // removes. Under reduced motion, hide it immediately instead of
        // playing the transition.
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            gsap.set('.page-transition', { autoAlpha: 0 });
            return;
        }

        const tl = gsap.timeline();

        tl.to('.page-transition--inner', {
            yPercent: 0,
            duration: 0.2,
        })
            .to('.page-transition--inner', {
                yPercent: -100,
                duration: 0.2,
            })
            .to('.page-transition', {
                yPercent: -100,
            });
    });

    return (
        <div>
            {/* Decorative only: `pointer-events-none` keeps it from swallowing
                clicks during the ~0.4s wipe. `app/layout.tsx` hides it via
                <noscript> so a JS failure cannot leave the page covered. */}
            <div
                aria-hidden="true"
                className="page-transition pointer-events-none w-screen h-screen fixed top-0 left-0 bg-background-light z-[5]"
            >
                <div className="page-transition--inner w-screen h-screen fixed top-0 left-0 bg-primary z-[5] translate-y-full"></div>
            </div>

            {children}
        </div>
    );
}
