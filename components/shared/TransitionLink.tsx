'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Props extends ComponentProps<typeof Link> {
    back?: boolean;
}

// The wipe is rendered by app/template.tsx, which puts it next to the page
// content rather than inside this link, so the link's own element cannot be the
// scope. Climb to the closest ancestor that actually holds the overlay and scope
// the lookup there: unlike a document-wide selector, the tweens can then never
// reach a `.page-transition` belonging to something else.
const getTransitionScope = (element: HTMLElement): HTMLElement => {
    let branch: HTMLElement | null = element.parentElement;

    while (branch && branch !== document.body) {
        if (branch.querySelector('.page-transition')) return branch;
        branch = branch.parentElement;
    }

    return document.body;
};

const TransitionLink = ({
    href,
    onClick,
    children,
    back = false,
    ...rest
}: Props) => {
    const router = useRouter();
    const isTransitioningRef = useRef(false);

    // Subscribed instead of read once: the GSAP tweens are untouched by the
    // `transition-duration: 0.01ms !important` reduced-motion fallback in
    // globals.css, so a preference set after mount has to be honoured too.
    const prefersReducedMotion = useMediaQuery(
        '(prefers-reduced-motion: reduce)',
    );

    // The handler's timeline must belong to a context so it is reverted if the
    // link unmounts mid-transition, hence the (otherwise empty) useGSAP call.
    const { contextSafe } = useGSAP();

    const handleLinkClick = contextSafe(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            // Let the browser handle modified, middle and new-tab clicks so
            // "open in new tab" isn't hijacked into a client-side push.
            if (
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                e.button !== 0 ||
                e.currentTarget.target === '_blank'
            ) {
                return;
            }

            // The caller's handler always runs; if it prevents the default we
            // hand control over to it and skip the page transition.
            if (onClick) {
                onClick(e);
                if (e.defaultPrevented) return;
            }

            e.preventDefault();

            // app/template.tsx owns the .page-transition nodes; ignore re-entry so
            // rapid clicks can't stack timelines on the same elements.
            if (isTransitioningRef.current) return;

            const navigate = () => {
                if (back) {
                    router.back();
                } else if (href) {
                    router.push(href.toString());
                }
            };

            // app/template.tsx skips the wipe under reduced motion (it only fades
            // the cover out), so playing it here would hand those users a 0.3s
            // full-screen cover on every internal navigation. The re-entry flag
            // stays untouched on this path: with no timeline to protect it would
            // never be reset, and a link to the current route stays mounted.
            if (prefersReducedMotion) {
                navigate();
                return;
            }

            const select = gsap.utils.selector(
                getTransitionScope(e.currentTarget),
            );
            const cover = select('.page-transition');
            const inner = select('.page-transition--inner');

            // Nothing to wipe (the template is not on this route): navigate
            // rather than waiting out an empty timeline.
            if (!cover.length) {
                navigate();
                return;
            }

            isTransitioningRef.current = true;

            gsap.set(cover, { yPercent: 100 });
            gsap.set(inner, { yPercent: 100 });

            const tl = gsap.timeline({
                onComplete: () => {
                    navigate();

                    isTransitioningRef.current = false;
                },
            });

            tl.to(cover, {
                yPercent: 0,
                duration: 0.3,
            });
        },
    );

    return (
        <Link href={href} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;
