'use client';

import { useEffect, useState } from 'react';
import { LaunchArrow } from '@/components/shared/hud/LaunchArrow';
import TransitionLink from '@/components/shared/TransitionLink';
import { cn } from '@/lib/utils';

interface Props {
    /** Where to go when there is no in-app history to step back into. */
    href: string;
    label?: string;
    className?: string;
    /**
     * Always navigate to `href`, never pop history. For routes where "the
     * previous entry" is not a reliable "one level up": 404s (the previous entry
     * is the broken URL the visitor just came from) and project pages (a visitor
     * can hop project to project, and one click must leave the whole run).
     */
    alwaysHref?: boolean;
}

// The one back affordance for the whole site, so every page reads the same.
//
// `TransitionLink`'s `back` prop calls `router.back()`, which is a silent no-op
// when there is no history to pop - a project page opened from a search result,
// a shared link, or a new tab would otherwise get a dead button. This component
// picks the destination once after mount:
//
//   - history exists and is same-origin -> real back (restores scroll position
//     and any state the visitor arrived with)
//   - otherwise                         -> navigate to `href`
//
// The choice is delegated to `TransitionLink` through its `back` prop rather
// than by navigating here, so the page-transition wipe still plays and the two
// destinations cannot race.
const BackLink = ({
    href,
    label = 'Back',
    className,
    alwaysHref = false,
}: Props) => {
    const [canGoBack, setCanGoBack] = useState(false);

    // `history.length > 1` alone is not enough: the previous entry can be
    // another origin, where `router.back()` would leave the site entirely.
    // `next/navigation` exposes no history state, so ask the Navigation API
    // where available and fall back to the length check.
    useEffect(() => {
        if (alwaysHref) return;

        const nav = (
            window as Window & {
                navigation?: {
                    canGoBack?: boolean;
                    currentEntry?: { index?: number };
                };
            }
        ).navigation;

        const index = nav?.currentEntry?.index;

        let resolved: boolean;
        if (typeof index === 'number') {
            resolved = index > 0;
        } else if (typeof nav?.canGoBack === 'boolean') {
            resolved = nav.canGoBack;
        } else {
            // No Navigation API (Firefox, older Safari). `history.length` also
            // counts entries from other sites, so a visitor who opened this
            // page straight from a search result in the same tab would be sent
            // back OUT of the site. `document.referrer` names that site for a
            // direct arrival; require it to be empty or same-origin. (It keeps
            // naming the first external page after in-app navigation too, so
            // those visitors take the `href` fallback instead of a real back -
            // same destination, minus scroll restoration.)
            let crossOriginReferrer = false;
            try {
                crossOriginReferrer =
                    document.referrer !== '' &&
                    new URL(document.referrer).origin !==
                        window.location.origin;
            } catch {
                crossOriginReferrer = false;
            }
            resolved = window.history.length > 1 && !crossOriginReferrer;
        }

        setCanGoBack(resolved);
    }, [alwaysHref]);

    return (
        <TransitionLink
            href={href}
            back={canGoBack && !alwaysHref}
            className={cn(
                'group inline-flex h-12 items-center gap-2 outline-none',
                'text-body-base text-muted-foreground transition-colors',
                'hover:text-primary focus-visible:text-primary',
                'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                className,
            )}
        >
            {/* Drawn at rest, re-draws once and slides left when engaged
                (hover or keyboard focus — the old arrow only reacted to hover). */}
            <LaunchArrow
                direction="left"
                rest="drawn"
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-engaged:-translate-x-1"
            />
            <span>{label}</span>
        </TransitionLink>
    );
};

export default BackLink;
