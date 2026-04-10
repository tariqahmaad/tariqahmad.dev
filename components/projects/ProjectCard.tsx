import TransitionLink from '@/components/shared/TransitionLink';
import { cn, gradientTextClass } from '@/lib/utils';
import { IProject } from '@/types';
import { gsap, useGSAP } from '@/lib/gsap-setup';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    index: number;
    project: IProject;
    selectedProject: string | null;
    onMouseEnter: (slug: string) => void;
    onMouseLeave: () => void;
}

const Project = ({ index, project, selectedProject, onMouseEnter, onMouseLeave }: Props) => {
    const externalLinkSVGRef = useRef<SVGSVGElement>(null);

    const { context, contextSafe } = useGSAP(() => {}, {
        scope: externalLinkSVGRef,
        revertOnUpdate: true,
    });

    const handleMouseEnter = contextSafe?.(() => {
        onMouseEnter(project.slug);

        const arrowLine = externalLinkSVGRef.current?.querySelector(
            '#arrow-line',
        ) as SVGPathElement | null;
        const arrowCurb = externalLinkSVGRef.current?.querySelector(
            '#arrow-curb',
        ) as SVGPathElement | null;
        const box = externalLinkSVGRef.current?.querySelector(
            '#box',
        ) as SVGPathElement | null;

        if (!box || !arrowLine || !arrowCurb) return;

        gsap.set(box, {
            opacity: 0,
            strokeDasharray: box?.getTotalLength(),
            strokeDashoffset: box?.getTotalLength(),
        });
        gsap.set(arrowLine, {
            opacity: 0,
            strokeDasharray: arrowLine?.getTotalLength(),
            strokeDashoffset: arrowLine?.getTotalLength(),
        });
        gsap.set(arrowCurb, {
            opacity: 0,
            strokeDasharray: arrowCurb?.getTotalLength(),
            strokeDashoffset: arrowCurb?.getTotalLength(),
        });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.to(externalLinkSVGRef.current, {
            autoAlpha: 1,
        })
            .to(box, {
                opacity: 1,
                strokeDashoffset: 0,
            })
            .to(
                arrowLine,
                {
                    opacity: 1,
                    strokeDashoffset: 0,
                },
                '<0.2',
            )
            .to(arrowCurb, {
                opacity: 1,
                strokeDashoffset: 0,
            })
            .to(
                externalLinkSVGRef.current,
                {
                    autoAlpha: 0,
                },
                '+=1',
            );
    });

    const handleMouseLeave = contextSafe?.(() => {
        context.kill();
        onMouseLeave();
    });

    return (
        <div
            className={cn(
                'project-item leading-none md:py-5 md:border-b first:!pt-0 last:pb-0 last:border-none transition-all',
                selectedProject !== null &&
                    selectedProject !== project.slug &&
                    'md:opacity-30',
            )}
        >
            {selectedProject === null && project.thumbnail && (
                <Image
                    src={project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    width="300"
                    height="200"
                    className="w-full object-cover mb-6 aspect-[3/2] object-top"
                    key={project.slug}
                    loading="lazy"
                />
            )}
            <div className="flex gap-2 md:gap-5 items-start">
                <div className="font-anton text-muted-foreground text-body-base sm:text-body-lg">
                    _{(index + 1).toString().padStart(2, '0')}.
                </div>
                <div className="flex-1">
                    <TransitionLink
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2"
                    >
                        <h4
                            className={`${gradientTextClass} text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-tight`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {project.title}
                        </h4>
                        <span className="text-foreground opacity-0 group-hover:opacity-100 transition-all inline-flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                ref={externalLinkSVGRef}
                                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0"
                            >
                                <path
                                    id="box"
                                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                ></path>
                                <path id="arrow-line" d="M10 14 21 3"></path>
                                <path id="arrow-curb" d="M15 3h6v6"></path>
                            </svg>
                        </span>
                    </TransitionLink>
                    <ul className="mt-2 flex flex-wrap gap-3 text-muted-foreground text-ui-base sm:text-body-sm">
                        {project.techStack
                            .slice(0, 3)
                            .map((tech, idx, stackArr) => (
                                <li
                                    className="gap-3 flex items-center"
                                    key={tech}
                                >
                                    <span>{tech}</span>
                                    {idx !== stackArr.length - 1 && (
                                        <span className="inline-block size-2 rounded-full bg-background-light"></span>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
                {project.slug === 'cv-builder' && project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group relative self-center inline-flex items-center justify-center h-9 px-4 sm:h-10 sm:px-5 md:h-14 md:px-8 md:rounded-tl-[10.5px] md:rounded-br-[10.5px] bg-primary/[0.06] hover:bg-primary/[0.12] outline-none transition-all duration-200 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15),0_0_40px_hsl(var(--primary)/0.05)] active:scale-[0.98]"
                    >
                        {/* Top-left corner bracket */}
                        <svg
                            className="pointer-events-none absolute -top-px -left-px md:-top-[3.5px] md:-left-[3.5px] w-8 h-8 md:w-14 md:h-14 text-primary/50 group-hover:text-primary/80 transition-colors duration-300"
                            viewBox="-1 -1 34 34"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            {/* Corner - always visible */}
                            <path d="M12 2 H8 A6 6 0 0 0 2 8 V12" />
                            {/* Horizontal line extends on hover */}
                            <path
                                d="M12 2 L32 2"
                                strokeDasharray="20"
                                className="corner-bracket-line [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 ease-out"
                            />
                            {/* Vertical line extends on hover */}
                            <path
                                d="M2 12 L2 32"
                                strokeDasharray="20"
                                className="corner-bracket-line [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 ease-out"
                            />
                        </svg>

                        {/* Bottom-right corner bracket */}
                        <svg
                            className="pointer-events-none absolute -bottom-px -right-px md:-bottom-[3.5px] md:-right-[3.5px] w-8 h-8 md:w-14 md:h-14 text-primary/50 group-hover:text-primary/80 transition-colors duration-300 delay-75"
                            viewBox="-1 -1 34 34"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            {/* Corner - always visible */}
                            <path d="M20 30 H24 A6 6 0 0 0 30 24 V20" />
                            {/* Horizontal line extends on hover */}
                            <path
                                d="M20 30 L0 30"
                                strokeDasharray="20"
                                className="corner-bracket-line [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 delay-75 ease-out"
                            />
                            {/* Vertical line extends on hover */}
                            <path
                                d="M30 20 L30 0"
                                strokeDasharray="20"
                                className="corner-bracket-line [stroke-dashoffset:20] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 delay-75 ease-out"
                            />
                        </svg>

                        {/* Content */}
                        <span className="relative z-[1] flex items-center gap-1.5 sm:gap-2 md:gap-2.5 uppercase font-anton tracking-[0.12em] sm:tracking-[0.15em] text-primary/80 group-hover:text-primary group-hover:tracking-[0.16em] sm:group-hover:tracking-[0.18em] md:group-hover:tracking-[0.2em] transition-all duration-300 text-[13px] sm:text-body-sm md:text-body-lg">
                            <span>Visit</span>
                            <ExternalLink
                                size={14}
                                className="sm:size-[16px] md:size-[22px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]"
                            />
                        </span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Project;
