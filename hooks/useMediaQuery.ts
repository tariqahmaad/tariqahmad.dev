import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query.
 *
 * Returns `false` during SSR and the first client render (so markup matches),
 * then the real match, and follows the query live - rotating a phone or
 * resizing across a breakpoint updates it without a remount.
 */
export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        const sync = () => setMatches(mediaQuery.matches);

        sync();
        mediaQuery.addEventListener('change', sync);

        return () => mediaQuery.removeEventListener('change', sync);
    }, [query]);

    return matches;
};
