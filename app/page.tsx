import AboutMe from '@/components/home/AboutMe';
import Banner from '@/components/home/Banner';
import Experiences from '@/components/home/Experiences';
import Skills from '@/components/home/Skills';
import ProjectList from '@/components/home/ProjectList';
import Certifications from '@/components/home/Certifications';

export default function Home() {
    return (
        <div>
            <Banner />
            <AboutMe />
            <Skills />
            <Experiences />
            <Certifications />
            <ProjectList />
        </div>
    );
}
