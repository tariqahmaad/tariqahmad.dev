import TransitionLink from '@/components/shared/TransitionLink';
import BracketFrame from '@/components/shared/hud/BracketFrame';
import { ArrowLaunchSlot } from '@/components/shared/hud/LaunchArrow';
import { cn, gradientTextClass } from '@/lib/utils';
import { IProject } from '@/types';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Props {
    index: number;
    project: IProject;
    /** Slug of the card currently hovered or focused by its title, or null. */
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
        className="group relative self-center inline-flex items-center justify-center h-9 px-4 sm:h-10 sm:px-5 md:h-14 md:px-8 rounded-tl-[10px] rounded-br-[10px] bg-primary/[0.08] hover:bg-primary/[0.14] focus-visible:bg-primary/[0.14] active:bg-primary/[0.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-[background-color,box-shadow,transform] duration-200 ease-out hover:shadow-[0_0_24px_hsl(var(--primary)/0.18),0_0_48px_hsl(var(--primary)/0.06)] focus-visible:shadow-[0_0_24px_hsl(var(--primary)/0.18),0_0_48px_hsl(var(--primary)/0.06)] active:scale-[0.97]"
    >
        {/* Scan-line sweep (clipped to the button shape) */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-tl-[10px] rounded-br-[10px]"
        >
            <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] group-engaged:left-[150%] transition-all duration-700 ease-in-out" />
        </span>

        {/* Corner brackets — revealed from each corner via clip-path */}
        <BracketFrame />

        {/* Content */}
        <span className="relative z-[1] flex items-center gap-1.5 sm:gap-2 md:gap-2.5 uppercase font-anton tracking-[0.14em] text-primary/80 group-engaged:text-primary transition-colors duration-300 text-[13px] sm:text-body-sm md:text-body-lg">
            <span>Visit</span>
            <ExternalLink
                size={14}
                className="sm:size-[16px] md:size-[22px] group-engaged:translate-x-0.5 group-engaged:-translate-y-0.5 transition-transform duration-300 drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]"
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
    // Hovering (or keyboard-focusing) one project's title dims the other cards
    // so the active one is the focus. Hover is desktop-only; focus works anywhere.
    const isDimmed =
        selectedProject !== null && selectedProject !== project.slug;
    // The active row's index lights up like a selected terminal line.
    const isActive = selectedProject === project.slug;

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
                    className={cn(
                        'font-anton text-muted-foreground text-body-base sm:text-body-lg transition-[color,text-shadow] duration-300',
                        isActive &&
                            'text-primary [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]',
                    )}
                >
                    _{(index + 1).toString().padStart(2, '0')}.
                </div>
                <div className="flex-1">
                    {/* The handlers live on the link, not the <h3>: the arrow is
                        part of the target, and focus has to count as much as
                        hover. Moving the pointer over the arrow no longer
                        un-dims the other cards. */}
                    <TransitionLink
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center gap-2"
                        onMouseEnter={() => onMouseEnter(project.slug)}
                        onMouseLeave={onMouseLeave}
                        onFocus={() => onMouseEnter(project.slug)}
                        onBlur={onMouseLeave}
                    >
                        <h3
                            className={`${gradientTextClass} group-focus-visible:bg-left text-heading-sm sm:text-heading-md md:text-heading-lg font-anton leading-tight`}
                        >
                            {project.title}
                        </h3>
                        <ArrowLaunchSlot />
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
