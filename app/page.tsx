import AboutMe from '@/components/home/AboutMe';
import Banner from '@/components/home/Banner';
import Certifications from '@/components/home/Certifications';
import Experiences from '@/components/home/Experiences';
import ProjectList from '@/components/home/ProjectList';
import Skills from '@/components/home/Skills';
import Testimonials from '@/components/home/Testimonials';

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
