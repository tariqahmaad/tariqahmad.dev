'use client';
import SectionTitle from '@/components/shared/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { shouldSkipAnimation } from '@/lib/utils';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { useScrollExitAnimation } from '@/hooks/useScrollExitAnimation';
import { useRef, useState } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // The exit hook below owns y/opacity on `containerRef`. The reveal used to
    // animate the same properties on the same element, so the two tweens fought
    // (and the `from` baseline was captured mid-scrub). Reveal the inner list.
    const listRef = useRef<HTMLDivElement>(null);
    // Slug of the card whose title is hovered — drives the dim-others effect.
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    useGSAP(
        () => {
            const list = listRef.current;
            if (!list) return;

            if (shouldSkipAnimation()) {
                // Set element to visible immediately
                gsap.set(list, { clearProps: 'all' });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    // 'reverse' re-hides the cards on scroll-up, which reads as
                    // flicker — see the note in Experiences.tsx.
                    toggleActions: 'play none none none',
                },
            });

            tl.from(list, {
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    useScrollExitAnimation({ containerRef });

    return (
        <section className="py-section" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="relative" ref={containerRef}>
                    <div
                        ref={listRef}
                        className="flex flex-col gap-8 xs:gap-10 md:gap-14"
                    >
                        {PROJECTS.map((project, index) => (
                            <ProjectCard
                                index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={setSelectedProject}
                                onMouseLeave={() => setSelectedProject(null)}
                                key={project.slug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
