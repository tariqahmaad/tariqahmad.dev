'use client';

import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import TransitionLink from '@/components/shared/TransitionLink';
import { cn } from '@/lib/utils';

interface Props {
    /** Where to go when there is no in-app history to step back into. */
    href: string;
    label?: string;
    className?: string;
    /**
     * Always navigate to `href`, never pop history. For routes that are reached
     * *because* something went wrong (404s), where the previous entry is the
     * broken URL the visitor just came from.
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
            resolved = window.history.length > 1;
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
                className,
            )}
        >
            <ArrowLeft
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden="true"
            />
            <span>{label}</span>
        </TransitionLink>
    );
};

export default BackLink;
