import {
    GENERAL_INFO,
    MY_CERTIFICATIONS,
    MY_STACK,
    SOCIAL_LINKS,
} from '@/lib/data';

const SITE_URL = 'https://tariqahmad.dev';
const PERSON_ID = `${SITE_URL}/#person`;

const MONTHS = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];

/** "March 2025" -> "2025-03"; undefined when the label is not parseable. */
const toISODate = (value: string): string | undefined => {
    const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(value.trim());
    if (!match) return undefined;
    const month = MONTHS.indexOf(match[1].toLowerCase()) + 1;
    if (month === 0) return undefined;
    return `${match[2]}-${String(month).padStart(2, '0')}`;
};

export default function StructuredData() {
    // Derived from lib/data.ts so the JSON-LD can never drift from the page.
    const knowsAbout = Array.from(
        new Set(Object.values(MY_STACK).flat().map((skill) => skill.name)),
    ).sort();

    const hasCredential = MY_CERTIFICATIONS.flatMap((category) =>
        category.certifications.map((certification) => {
            const dateCreated = toISODate(certification.date);
            return {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Certification',
                name: certification.title,
                ...(dateCreated ? { dateCreated } : {}),
                recognizedBy: {
                    '@type': 'Organization',
                    name: category.provider,
                },
            };
        }),
    );

    // One @graph instead of three independent @context blocks, so the
    // WebSite/ProfilePage can reference the Person node by @id.
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': PERSON_ID,
                name: 'Tariq Ahmad',
                url: SITE_URL,
                image: `${SITE_URL}/og-image.jpg`,
                jobTitle: 'Software Developer',
                description:
                    'Computer Engineering graduate from Istanbul Aydin University with expertise in full-stack development, networking, and AI.',
                email: GENERAL_INFO.email,
                // Telephone intentionally omitted from JSON-LD to reduce
                // scraping; the number stays visible in the site UI.
                alumniOf: {
                    '@type': 'EducationalOrganization',
                    name: 'Istanbul Aydin University',
                    url: 'https://www.aydin.edu.tr/',
                },
                sameAs: SOCIAL_LINKS.map((link) => link.url),
                knowsAbout,
                hasCredential,
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: 'Tariq Ahmad Portfolio',
                url: SITE_URL,
                description:
                    'Personal portfolio website showcasing software development projects and skills.',
                author: { '@id': PERSON_ID },
                inLanguage: 'en-US',
            },
            {
                '@type': 'ProfilePage',
                '@id': `${SITE_URL}/#profilepage`,
                dateCreated: '2024-01-01',
                // Bump when the portfolio content changes.
                dateModified: '2026-09-09',
                mainEntity: { '@id': PERSON_ID },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
    );
}
