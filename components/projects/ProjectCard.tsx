import TransitionLink from '@/components/shared/TransitionLink';
import { cn, gradientTextClass } from '@/lib/utils';
import { IProject } from '@/types';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Props {
    index: number;
    project: IProject;
    /** Slug of the card currently hovered by its title, or null. */
    selectedProject: string | null;
    onMouseEnter: (slug: string) => void;
    onMouseLeave: () => void;
}

const VisitButton = ({ title, url }: { title: string; url: string }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${title} (opens in a new tab)`}
        className="group relative self-center inline-flex items-center justify-center h-9 px-4 sm:h-10 sm:px-5 md:h-14 md:px-8 rounded-tl-[10px] rounded-br-[10px] bg-primary/[0.08] hover:bg-primary/[0.14] active:bg-primary/[0.2] outline-none transition-[background-color,box-shadow,transform] duration-200 ease-out hover:shadow-[0_0_24px_hsl(var(--primary)/0.18),0_0_48px_hsl(var(--primary)/0.06)] active:scale-[0.97]"
    >
        {/* Scan-line sweep (clipped to the button shape) */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-tl-[10px] rounded-br-[10px]"
        >
            <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
        </span>

        {/* Corner brackets — revealed from each corner via clip-path */}
        <span
            aria-hidden="true"
            className="bracket-arm pointer-events-none absolute inset-0 border-t-2 border-l-2 border-primary/60 group-hover:border-primary rounded-tl-[10px] [clip-path:inset(0_80%_60%_0)] group-hover:[clip-path:inset(0)] transition-[clip-path,border-color] duration-300 ease-out"
        />
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
);

const ProjectCard = ({
    index,
    project,
    selectedProject,
    onMouseEnter,
    onMouseLeave,
}: Props) => {
    const visibleTech = project.techStack.slice(0, 3);
    // Hovering one project's title dims the other cards so the hovered one is
    // the focus. Desktop only — touch devices have no hover state.
    const isDimmed =
        selectedProject !== null && selectedProject !== project.slug;

    return (
        <article
            className={cn(
                'project-item leading-none md:py-5 md:border-b first:!pt-0 last:pb-0 last:border-none transition-opacity duration-300',
                isDimmed && 'md:opacity-30',
            )}
        >
            {project.thumbnail && (
                <Image
                    src={project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    width={300}
                    height={200}
                    sizes="(max-width: 767px) 100vw, 300px"
                    loading="lazy"
                    className="w-full object-cover mb-6 aspect-[3/2] object-top md:hidden"
                />
            )}
            <div className="flex gap-2 md:gap-5 items-start">
                <div
                    aria-hidden="true"
                    className="font-anton text-muted-foreground text-body-base sm:text-body-lg"
                >
                    _{(index + 1).toString().padStart(2, '0')}.
                </div>
                <div className="flex-1">
                    <TransitionLink
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2"
                    >
                        <h3
                            className={`${gradientTextClass} text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-tight`}
                            onMouseEnter={() => onMouseEnter(project.slug)}
                            onMouseLeave={onMouseLeave}
                        >
                            {project.title}
                        </h3>
                        <ArrowUpRight
                            aria-hidden="true"
                            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0 text-foreground opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                        />
                    </TransitionLink>
                    <ul className="mt-2 flex flex-wrap gap-3 text-muted-foreground text-ui-base sm:text-body-sm">
                        {visibleTech.map((tech, idx) => (
                            <li
                                className="gap-3 flex items-center"
                                key={`${tech}-${idx}`}
                            >
                                <span>{tech}</span>
                                {idx !== visibleTech.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="text-primary/40 font-mono"
                                    >
                                        {'//'}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {project.liveUrl && (
                    <VisitButton title={project.title} url={project.liveUrl} />
                )}
            </div>
        </article>
    );
};

export default ProjectCard;
