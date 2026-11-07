import type { MetadataRoute } from 'next';

import { PROJECTS } from '@/lib/data';
import { CONTENT_UPDATED_AT, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    // Single source with the JSON-LD's `dateModified`: bump
    // CONTENT_UPDATED_AT when portfolio content changes.
    const lastModified = new Date(`${CONTENT_UPDATED_AT}T00:00:00.000Z`);

    const projectUrls = PROJECTS.map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${SITE_URL}/`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        {
            // The CV Builder product lives here, not on the homepage. Leaving
            // it out of the sitemap left Google with one URL for the product —
            // the portfolio — which is how the homepage ended up indexed under
            // a resume-builder title.
            url: `${SITE_URL}/product`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        ...projectUrls,
    ];
}
