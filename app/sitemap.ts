import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.tariqahmad.dev/';

    const projectUrls = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        ...projectUrls,
    ];
}
