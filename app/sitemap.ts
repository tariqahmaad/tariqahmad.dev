import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tariqahmad.dev';
    // Static date so crawlers can cache — bump when content changes.
    const lastModified = new Date('2026-09-01');

    const projectUrls = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${baseUrl}/`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        ...projectUrls,
    ];
}
