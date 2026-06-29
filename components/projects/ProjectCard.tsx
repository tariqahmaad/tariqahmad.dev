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
                                        <span className="text-primary/40 font-mono">{'//'}</span>
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
                        aria-label={`Visit ${project.title} (opens in a new tab)`}
                        className="group relative self-center inline-flex items-center justify-center h-9 px-4 sm:h-10 sm:px-5 md:h-14 md:px-8 rounded-tl-[10px] rounded-br-[10px] bg-primary/[0.08] hover:bg-primary/[0.14] active:bg-primary/[0.2] outline-none transition-[background-color,box-shadow,transform] duration-200 ease-out hover:shadow-[0_0_24px_hsl(var(--primary)/0.18),0_0_48px_hsl(var(--primary)/0.06)] active:scale-[0.97]"
                    >
                        {/* Scan-line sweep (clipped to the button shape) */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden rounded-tl-[10px] rounded-br-[10px]"
                        >
                            <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                        </span>

                        {/* Corner brackets — real borders that curve around the button's rounded TL/BR corners (not cropped), revealed from each corner via clip-path. Constant thickness; square TR/BL. */}
                        {/* Top-left bracket: top + left edges, rounded TL corner */}
                        <span
                            aria-hidden="true"
                            className="bracket-arm pointer-events-none absolute inset-0 border-t-2 border-l-2 border-primary/60 group-hover:border-primary rounded-tl-[10px] [clip-path:inset(0_80%_60%_0)] group-hover:[clip-path:inset(0)] transition-[clip-path,border-color] duration-300 ease-out"
                        />
                        {/* Bottom-right bracket: bottom + right edges, rounded BR corner */}
                        <span
                            aria-hidden="true"
                            className="bracket-arm pointer-events-none absolute inset-0 border-b-2 border-r-2 border-primary/60 group-hover:border-primary rounded-br-[10px] [clip-path:inset(60%_0_0_80%)] group-hover:[clip-path:inset(0)] transition-[clip-path,border-color] duration-300 delay-75 ease-out"
                        />

                        {/* Content */}
                        <span className="relative z-[1] flex items-center gap-1.5 sm:gap-2 md:gap-2.5 uppercase font-anton tracking-[0.14em] text-primary/80 group-hover:text-primary transition-colors duration-300 text-[13px] sm:text-body-sm md:text-body-lg">
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
