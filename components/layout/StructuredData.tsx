export default function StructuredData() {
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tariq Ahmad',
        url: 'https://tariqahmad.dev',
        image: 'https://tariqahmad.dev/og-image.png',
        jobTitle: 'Software Developer',
        description:
            'Computer Engineering graduate from Istanbul Aydin University with expertise in full-stack development, networking, and AI.',
        email: 'tariq_muzamil@live.com',
        telephone: '+90 53 454 03345',
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Istanbul Aydin University',
            url: 'https://www.aydin.edu.tr/',
        },
        sameAs: [
            'https://github.com/tariqahmaad',
            'https://www.linkedin.com/in/tariq-ahmad-a43320264/',
        ],
        knowsAbout: [
            'JavaScript',
            'TypeScript',
            'React',
            'Next.js',
            'Node.js',
            'Python',
            'Java',
            'C#',
            'C++',
            'PHP',
            'Django',
            'Spring Boot',
            'React Native',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'AWS',
            'Docker',
            'Git',
            'Full Stack Development',
            'Web Development',
            'Mobile Development',
            'Machine Learning',
            'Neural Networks',
        ],
        hasCredential: [
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Certification',
                name: 'Cisco Certified Network Associate (CCNA)',
                dateCreated: '2019-08',
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Certification',
                name: 'Microsoft Certified Solution Expert (MCSE)',
                dateCreated: '2019-07',
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Certification',
                name: 'React Native - Meta Certification',
                dateCreated: '2025-03',
            },
        ],
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Tariq Ahmad Portfolio',
        url: 'https://tariqahmad.dev',
        description:
            'Personal portfolio website showcasing software development projects and skills.',
        author: {
            '@type': 'Person',
            name: 'Tariq Ahmad',
        },
        inLanguage: 'en-US',
    };

    const profilePageSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        dateCreated: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        mainEntity: {
            '@type': 'Person',
            name: 'Tariq Ahmad',
            url: 'https://tariqahmad.dev',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
            />
        </>
    );
}
