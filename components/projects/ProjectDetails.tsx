'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/shared/ArrowAnimation';
import BackLink from '@/components/shared/BackLink';
import HudButton from '@/components/shared/hud/HudButton';
import TransitionLink from '@/components/shared/TransitionLink';
import { IProject, IProjectLink } from '@/types';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import { ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    project: IProject;
    /** Minimal neighbours, computed on the server so project copy stays there. */
    previousProject: IProjectLink | null;
    nextProject: IProjectLink | null;
    projectIndex: number;
    totalProjects: number;
}

const ProjectDetails = ({
    project,
    previousProject,
    nextProject,
    projectIndex,
    totalProjects,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // The heading is visible by default (no literal opacity-0), so reduced
            // motion just gets the final state instead of a delayed reveal.
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set('.fade-in-later', {
                    autoAlpha: 1,
                    y: 0,
                });
                return;
            }

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
            });
        },
        { scope: containerRef },
    );

    // blur info div and make it smaller on scroll
    useGSAP(
        () => {
            const info = infoRef.current;

            if (!info) return;

            // matchMedia replaces the one-shot window.innerWidth read at mount, so
            // the effect is (un)built when the breakpoint is actually crossed.
            const mm = gsap.matchMedia();

            mm.add('(min-width: 992px)', () => {
                gsap.to(info, {
                    filter: 'blur(3px)',
                    autoAlpha: 0,
                    scale: 0.9,
                    // position: 'sticky',
                    scrollTrigger: {
                        trigger: info,
                        start: 'bottom bottom',
                        end: 'bottom top',
                        pin: true,
                        pinSpacing: false,
                        scrub: 0.5,
                    },
                });
            });

            return () => mm.revert();
        },
        { scope: containerRef },
    );

    // parallax effect on images
    useGSAP(
        () => {
            if (!containerRef.current) return;

            // `useGSAP`'s `scope` only rewrites selector strings handed to gsap
            // methods — it does not apply to `gsap.utils.toArray`, which was
            // scanning the whole document. Query from the container explicitly.
            const imageDivs = gsap.utils.toArray<HTMLDivElement>(
                containerRef.current.querySelectorAll('#images > div'),
            );

            imageDivs.forEach((imageDiv, i) => {
                gsap.to(imageDiv, {
                    backgroundPosition: `center 0%`,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: imageDiv,
                        start: () => (i ? 'top bottom' : 'top 50%'),
                        end: 'bottom top',
                        scrub: true,
                        // invalidateOnRefresh: true, // to make it responsive
                    },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-5 pb-14">
            <div className="container" ref={containerRef}>
                {/* Case-file header: breadcrumb, case number, and the way back
                    all in one HUD strip. */}
                <div className="mb-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/5 pb-4 font-mono text-ui-xs uppercase tracking-[0.2em] text-subtle">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <BackLink
                            href="/"
                            label="All projects"
                            className="text-ui-sm uppercase tracking-[0.2em] text-subtle hover:text-primary"
                        />
                        <span aria-hidden="true" className="text-subtle/60">
                            ·
                        </span>
                        <span className="break-all text-primary/80">
                            ~/projects/{project.slug}
                        </span>
                    </div>
                    <span>
                        case{' '}
                        {String(Math.max(projectIndex + 1, 1)).padStart(2, '0')}{' '}
                        / {String(totalProjects).padStart(2, '0')}
                    </span>
                </div>

                <div
                    className="top-0 min-h-[calc(100svh-100px)] flex"
                    id="info"
                    ref={infoRef}
                >
                    <div className="relative w-full">
                        <div className="flex items-start gap-6 mx-auto mb-10 max-w-[635px]">
                            <h1 className="fade-in-later text-display-sm md:text-[60px] leading-none font-anton overflow-hidden">
                                <span className="inline-block">
                                    {project.title}
                                </span>
                            </h1>
                        </div>

                        <div className="max-w-[635px] space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className="mb-3 font-mono text-ui-sm uppercase tracking-[0.25em] text-subtle">
                                    {'// year'}
                                </p>

                                <p className="text-body-lg text-foreground/90">
                                    {project.year}
                                </p>
                            </div>
                            <div className="fade-in-later">
                                <p className="mb-3 font-mono text-ui-sm uppercase tracking-[0.25em] text-subtle">
                                    {'// stack'}
                                </p>

                                <ul className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <li
                                            key={tech}
                                            className="border border-primary/25 bg-primary/[0.04] px-2.5 py-1 font-mono text-ui-sm text-primary/80"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {(project.sourceCode || project.liveUrl) && (
                                <div className="fade-in-later">
                                    <p className="mb-3 font-mono text-ui-sm uppercase tracking-[0.25em] text-subtle">
                                        {'// links'}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {project.sourceCode && (
                                            <HudButton
                                                href={project.sourceCode}
                                                external
                                                variant="outline"
                                                size="sm"
                                                icon={<Github size={16} />}
                                            >
                                                View source
                                            </HudButton>
                                        )}
                                        {project.liveUrl && (
                                            <HudButton
                                                href={project.liveUrl}
                                                external
                                                variant="outline"
                                                size="sm"
                                                icon={
                                                    <ExternalLink size={16} />
                                                }
                                            >
                                                Live demo
                                            </HudButton>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="fade-in-later">
                                <p className="mb-3 font-mono text-ui-sm uppercase tracking-[0.25em] text-subtle">
                                    {'// description'}
                                </p>

                                <div className="text-body-lg markdown-text text-foreground/90">
                                    {parse(project.description)}
                                </div>
                            </div>
                            {project.role && (
                                <div className="fade-in-later">
                                    <p className="mb-3 font-mono text-ui-sm uppercase tracking-[0.25em] text-subtle">
                                        {'// my role'}
                                    </p>

                                    <div className="text-body-lg text-foreground/90">
                                        {parse(project.role)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <ArrowAnimation className="relative mt-8 md:absolute md:bottom-20 md:mt-0" />
                    </div>
                </div>

                {project.images && project.images.length > 0 && (
                    <div
                        className="fade-in-later relative flex flex-col gap-2 max-w-[800px] mx-auto"
                        id="images"
                    >
                        {project.images.map((image) => (
                            <div
                                key={image}
                                className="group relative w-full aspect-[750/400] bg-background-light"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center 50%',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${project.title} screenshot in a new tab`}
                                    className="absolute top-4 right-4 bg-background/70 text-foreground size-12 inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 focus-visible:opacity-100"
                                >
                                    <ExternalLink aria-hidden="true" />
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Case navigation: a project page previously ended on a dead
                    end. Each neighbouring project is a card, so the immersive
                    layout still lets a visitor keep browsing. */}
                <nav
                    aria-label="Project navigation"
                    className="mt-16 grid gap-3 border-t border-white/5 pt-8 sm:grid-cols-2"
                >
                    {previousProject ? (
                        <TransitionLink
                            href={`/projects/${previousProject.slug}`}
                            className="group relative rounded-tl-[10px] rounded-br-[10px] border border-white/10 bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <span className="font-mono text-ui-xs uppercase tracking-[0.2em] text-subtle">
                                ← previous case
                            </span>
                            <span className="mt-2 block font-anton text-body-xl text-foreground transition-colors group-hover:text-primary">
                                {previousProject.title}
                            </span>
                            <span className="mt-1 block font-mono text-ui-xs text-subtle">
                                {previousProject.year} ·{' '}
                                {previousProject.techStack
                                    .slice(0, 2)
                                    .join(' / ')}
                            </span>
                        </TransitionLink>
                    ) : (
                        <span aria-hidden="true" className="hidden sm:block" />
                    )}

                    {nextProject ? (
                        <TransitionLink
                            href={`/projects/${nextProject.slug}`}
                            className="group relative rounded-tl-[10px] rounded-br-[10px] border border-white/10 bg-card p-5 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:text-right"
                        >
                            <span className="font-mono text-ui-xs uppercase tracking-[0.2em] text-subtle">
                                next case →
                            </span>
                            <span className="mt-2 block font-anton text-body-xl text-foreground transition-colors group-hover:text-primary">
                                {nextProject.title}
                            </span>
                            <span className="mt-1 block font-mono text-ui-xs text-subtle">
                                {nextProject.year} ·{' '}
                                {nextProject.techStack.slice(0, 2).join(' / ')}
                            </span>
                        </TransitionLink>
                    ) : null}
                </nav>
            </div>
        </section>
    );
};

export default ProjectDetails;
