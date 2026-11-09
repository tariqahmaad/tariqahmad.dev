import { gsap } from '@/lib/gsap-setup';

/**
 * The site's one page transition: the preloader's slat shutter.
 *
 * Every internal link (`TransitionLink`) closes the shutter, the route changes
 * behind it, and the next page's `app/template.tsx` opens it again. Both halves
 * and every page's content entrance read their timing from here, so changing
 * how the site feels is a one-file edit and no page can drift out of step.
 *
 * Timeline of a navigation (seconds from the click):
 *   0 - 0.75    slats close from the centre outward, alternating up/down
 *   0.5 - 0.75  the destination types itself in the middle (`$ cd /path`)
 *   0.75        route swaps; the new template mounts already closed
 *   +hold       (0.12) the label is held so it can be read
 *   +hold       slats open, centre outward
 *   +enterDelay (0.4) page content starts rising in (`usePageEnter`)
 */
export const PAGE_TRANSITION = {
    closeDuration: 0.5,
    closeStagger: 0.05,
    hold: 0.12,
    openDuration: 0.7,
    openStagger: 0.06,
    /** Seconds after the new page mounts before its content starts to enter. */
    enterDelay: 0.4,
    contentDuration: 0.7,
    contentStagger: 0.1,
    ease: 'power3.inOut',
    /**
     * Last resort if a navigation never lands (network failure): after this
     * long with the URL unchanged, the closed shutter opens again by itself.
     * Deliberately long so a slow-but-working navigation is never mistaken for
     * a failed one.
     */
    stuckAfter: 15,
} as const;

export const SLAT_COUNT = 10;

/** `/` reads as `~`; every other route is shown as its own path. */
export const transitionLabel = (pathname: string): string =>
    pathname === '/' || pathname === '' ? '~' : pathname.replace(/\/$/, '');

/** Pathname of a link target, for the shutter's label. */
export const pathOf = (href: string): string => {
    try {
        return new URL(href, window.location.origin).pathname;
    } catch {
        return '/';
    }
};

// Even slats travel up, odd ones down, exactly like the preloader's shutter.
const closedFrom = (index: number) => (index % 2 ? '100%' : '-100%');

const parts = (cover: HTMLElement) => ({
    slats: gsap.utils.toArray<HTMLElement>('.page-slat', cover),
    edges: gsap.utils.toArray<HTMLElement>('.page-slat-edge', cover),
    label: cover.querySelector<HTMLElement>('.page-label'),
    labelText: cover.querySelector<HTMLElement>('.page-label-text'),
});

const fromCentre = (each: number) => ({ each, from: 'center' as const });

/**
 * Close the shutter over the current page. Returns the timeline; the caller
 * navigates from its `onComplete`.
 */
export const closeShutter = (
    cover: HTMLElement,
    destination: string,
): gsap.core.Timeline => {
    const { slats, edges, label, labelText } = parts(cover);
    const { closeDuration, closeStagger, ease } = PAGE_TRANSITION;

    if (labelText) labelText.textContent = `cd ${transitionLabel(destination)}`;

    gsap.set(cover, { autoAlpha: 1 });
    gsap.set(slats, { y: closedFrom });
    if (label) gsap.set(label, { autoAlpha: 0 });

    const tl = gsap.timeline();
    // Total length of the staggered cascade, so the label can land on its end.
    const cascade = closeDuration + closeStagger * ((slats.length - 1) / 2);

    tl.to(
        slats,
        {
            y: '0%',
            duration: closeDuration,
            ease,
            stagger: fromCentre(closeStagger),
            force3D: true,
        },
        0,
    );
    // The light edge flashes as each slat travels, then rests dark so the
    // closed wall is solid.
    tl.fromTo(
        edges,
        { opacity: 0 },
        {
            opacity: 1,
            duration: closeDuration * 0.4,
            ease: 'none',
            repeat: 1,
            yoyo: true,
            stagger: fromCentre(closeStagger),
        },
        0,
    );
    if (label) {
        // A stepped clip reads as typing without a text-swap loop.
        tl.fromTo(
            label,
            { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.25,
                ease: 'steps(12)',
            },
            Math.max(cascade - 0.3, 0),
        );
    }

    return tl;
};

/**
 * Open the shutter, centre outward. `delay` is the hold on the closed wall.
 * The cover is taken out of the render tree when it finishes.
 */
export const openShutter = (
    cover: HTMLElement,
    delay: number = PAGE_TRANSITION.hold,
): gsap.core.Timeline => {
    const { slats, edges, label } = parts(cover);
    const { openDuration, openStagger, ease } = PAGE_TRANSITION;

    const tl = gsap.timeline({
        delay,
        onComplete: () => {
            gsap.set(cover, { autoAlpha: 0 });
        },
    });

    if (label) tl.to(label, { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0);
    tl.to(
        slats,
        {
            y: (index: number) => closedFrom(index),
            duration: openDuration,
            ease,
            stagger: fromCentre(openStagger),
            force3D: true,
        },
        0.1,
    );
    tl.to(
        edges,
        { opacity: 1, duration: 0.2, ease: 'none', stagger: fromCentre(openStagger) },
        0.1,
    );

    return tl;
};
