/**
 * In-app links to a home-page section (`/#selected-projects`) navigate to the
 * plain route and hand the section name over here instead, so the address bar
 * stays `/` rather than collecting a hash nobody asked to see. `HashScroll`
 * (mounted by the home page) takes it and scrolls. A hash someone typed or
 * shared in the URL is still honoured by `HashScroll` itself.
 */

// Long enough for a slow navigation, short enough that a navigation that never
// landed cannot make some later, unrelated visit to the home page jump.
const MAX_AGE_MS = 20_000;

let pending: { id: string; at: number } | null = null;

export const setPendingSection = (id: string): void => {
    pending = { id, at: Date.now() };
};

export const takePendingSection = (): string | null => {
    const entry = pending;
    pending = null;
    if (!entry || Date.now() - entry.at > MAX_AGE_MS) return null;
    return entry.id;
};

/** `'/#about-me'` -> `{ path: '/', section: 'about-me' }`; no hash -> `section: null`. */
export const splitSectionHref = (
    href: string,
): { path: string; section: string | null } => {
    const hashAt = href.indexOf('#');
    if (hashAt === -1) return { path: href, section: null };

    const section = decodeURIComponent(href.slice(hashAt + 1));
    return { path: href.slice(0, hashAt) || '/', section: section || null };
};

/**
 * `router.push` for a target that may carry a section hash: pushes the bare
 * path and queues the section for `HashScroll`.
 */
export const pushWithSection = (
    router: { push: (href: string) => void },
    href: string,
): void => {
    const { path, section } = splitSectionHref(href);
    if (section) setPendingSection(section);
    router.push(path);
};
