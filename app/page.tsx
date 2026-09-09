import type { Metadata } from 'next';
import AboutMe from '@/components/home/AboutMe';
import Banner from '@/components/home/Banner';
import Certifications from '@/components/home/Certifications';
import Experiences from '@/components/home/Experiences';
import ProjectList from '@/components/home/ProjectList';
import Skills from '@/components/home/Skills';
import Testimonials from '@/components/home/Testimonials';

// The canonical lives here rather than in the root layout so that /404 and
// error routes stop inheriting the homepage URL.
export const metadata: Metadata = {
    alternates: {
        canonical: 'https://tariqahmad.dev/',
    },
};

export default function Home() {
    return (
        <div>
            <Banner />
            <AboutMe />
            <Skills />
            <Experiences />
            <Certifications />
            <ProjectList />
            <Testimonials />
        </div>
    );
}
