'use client';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { scrollToSection } from '@/lib/utils';
import { setPendingSection, splitSectionHref } from '@/lib/section-handoff';
import {
    closeShutter,
    openShutter,
    PAGE_TRANSITION,
    pathOf,
} from '@/lib/page-transition';

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
    replace = false,
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

            // `replace` swaps the current history entry instead of adding one.
            // It is how sibling pages (project -> next project) avoid piling up
            // history, so a single Back still leaves the whole set.
            //
            // A `/#section` target never reaches the address bar: the route is
            // pushed bare and the section is handed to the home page's
            // `HashScroll` (lib/section-handoff). On the page you are already
            // on there is nothing to push, so it just scrolls.
            const navigate = () => {
                if (back) {
                    router.back();
                    return;
                }
                if (!href) return;

                const { path, section } = splitSectionHref(href.toString());
                if (section && path === window.location.pathname) {
                    scrollToSection(section, 0);
                    return;
                }
                if (section) setPendingSection(section);

                if (replace) {
                    router.replace(path);
                } else {
                    router.push(path);
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

            const cover = gsap.utils
                .selector(getTransitionScope(e.currentTarget))('.page-transition')
                .at(0) as HTMLElement | undefined;

            // Nothing to close (the template is not on this route): navigate
            // rather than waiting out an empty timeline.
            if (!cover) {
                navigate();
                return;
            }

            const startPath = window.location.pathname;
            const destination = pathOf(href.toString());

            // Same page (a hash link on the page you are already on): there is
            // no route change to hide, and a closed shutter would never be
            // replaced by a new template. Just move.
            if (!back && destination === startPath) {
                navigate();
                return;
            }

            isTransitioningRef.current = true;

            const tl = closeShutter(cover, destination);
            tl.eventCallback('onComplete', () => {
                navigate();
                isTransitioningRef.current = false;

                // Last resort for a navigation that never lands (network
                // failure). It must NOT fire while a slow navigation is still
                // in flight - a dev server compiling a route, a slow
                // connection - or it would reopen the OLD page, and the real
                // one would then play a second transition on arrival. So it
                // only acts if the URL still has not changed after a long wait.
                window.setTimeout(() => {
                    if (
                        cover.isConnected &&
                        window.location.pathname === startPath &&
                        Number(gsap.getProperty(cover, 'autoAlpha')) > 0
                    ) {
                        openShutter(cover, 0);
                    }
                }, PAGE_TRANSITION.stuckAfter * 1000);
            });
        },
    );

    return (
        <Link href={href} replace={replace} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;
