import { notFound } from 'next/navigation';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { PROJECTS } from '@/lib/data';
import { Metadata } from 'next';

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

// `dynamicParams` defaults to true, which lets an unknown slug fall through to
// an on-demand render. That render trips Next's static-to-dynamic guard and
// returns a 500 ("Page changed from static to dynamic at runtime") before
// `notFound()` is ever reached — so a stale link or a typo'd URL produced a
// server error instead of a 404. The project list is fully known at build
// time, so refusing unknown params outright is both correct and cheaper.
export const dynamicParams = false;

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

    const title = `${project.title} - ${project.techStack
        .slice(0, 3)
        .join(', ')}`;
    const cleanedDescription = project.description
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const maxLength = 160;
    const description =
        cleanedDescription.length > maxLength
            ? `${cleanedDescription
                  .slice(0, maxLength)
                  .replace(/\s+\S*$/, '')
                  .trim()}...`
            : cleanedDescription;
    const url = `https://tariqahmad.dev/projects/${slug}`;
    const ogImage = project.thumbnail ?? '/og-image.png';

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
                    url: ogImage,
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
            images: [ogImage],
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
