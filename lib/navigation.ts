import {
    Award,
    Briefcase,
    Code,
    FolderGit2,
    MessageSquareQuote,
    Rocket,
    Shield,
    Terminal,
    type LucideIcon,
} from 'lucide-react';

/**
 * The site's top-level sections, in visual order.
 *
 * This is the single source consumed by the navbar (labels, icons, active
 * section), the scroll-spy (`ActiveSectionProvider`) and the command console
 * (navigation commands). Before this module existed, the navbar owned its own
 * `MENU_LINKS` and the console would have needed a second copy.
 *
 * `id` is the DOM id of the section element; `href` is what a normal link
 * would point at (used from other routes).
 */
export interface SiteSection {
    id: string;
    label: string;
    href: string;
    prefix: string;
    icon: LucideIcon;
    keywords: string[];
}

export const SITE_SECTIONS: SiteSection[] = [
    {
        id: 'banner',
        label: 'Home',
        href: '/',
        prefix: '~/',
        icon: Terminal,
        keywords: ['home', 'start', 'hero', 'top'],
    },
    {
        id: 'about-me',
        label: 'About Me',
        href: '/#about-me',
        prefix: './whoami',
        icon: Shield,
        keywords: ['about', 'bio', 'who', 'profile'],
    },
    {
        id: 'my-stack',
        label: 'Skills',
        href: '/#my-stack',
        prefix: './tech',
        icon: Code,
        keywords: ['skills', 'stack', 'tech', 'tools', 'languages'],
    },
    {
        id: 'my-experience',
        label: 'Experience',
        href: '/#my-experience',
        prefix: './work',
        icon: Briefcase,
        keywords: ['work', 'experience', 'jobs', 'career', 'timeline'],
    },
    {
        id: 'certifications',
        label: 'Certifications',
        href: '/#certifications',
        prefix: './certs',
        icon: Award,
        keywords: ['certifications', 'certs', 'courses', 'credentials'],
    },
    {
        id: 'product-spotlight',
        label: 'Product',
        href: '/#product-spotlight',
        prefix: './product',
        icon: Rocket,
        keywords: ['product', 'cv', 'resume', 'builder', 'generator'],
    },
    {
        id: 'selected-projects',
        label: 'Projects',
        href: '/#selected-projects',
        prefix: './projects',
        icon: FolderGit2,
        keywords: ['projects', 'portfolio', 'work', 'code'],
    },
    {
        id: 'testimonials',
        label: 'Testimonials',
        href: '/#testimonials',
        prefix: './reviews',
        icon: MessageSquareQuote,
        keywords: ['testimonials', 'reviews', 'quotes', 'references'],
    },
];

/** Total section count, used by the console's `03/08` style readouts. */
export const SECTION_COUNT = SITE_SECTIONS.length;

/** Index of a section by DOM id, or -1. */
export function sectionIndex(id: string | null): number {
    if (!id) return -1;
    return SITE_SECTIONS.findIndex((section) => section.id === id);
}
