import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { PROJECTS } from '@/lib/data';
import { Metadata } from 'next';

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) {
        return {
            title: 'Project Not Found',
            description: 'The requested project could not be found.',
        };
    }

    const title = `${project.title} - ${project.techStack.slice(0, 3).join(', ')}`;
    const description = project.description
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .substring(0, 160);
    const url = `https://tariqahmad.dev/projects/${slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'article',
            url,
            title,
            description,
            siteName: 'Tariq Ahmad Portfolio',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: `${project.title} - Project by Tariq Ahmad`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/og-image.png'],
        },
        keywords: [...project.techStack, 'Tariq Ahmad', 'Project', 'Portfolio'],
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) {
        return notFound();
    }

    return <ProjectDetails project={project} />;
};

export default Page;
