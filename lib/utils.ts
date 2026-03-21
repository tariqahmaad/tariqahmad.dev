import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Gradient text animation class — hover-driven (Skills, ProjectCard)
export const gradientTextClass =
    'transition-all duration-700 bg-gradient-to-r from-primary to-foreground from-[50%] to-[50%] bg-[length:200%] bg-right bg-clip-text text-transparent hover:bg-left';

// Gradient text animation class — state-driven, no CSS :hover (Certifications)
export const gradientTextBaseClass =
    'transition-all duration-700 bg-gradient-to-r from-[50%] to-[50%] bg-[length:200%] bg-clip-text text-transparent';

// Returns true when animations should be skipped (reduced-motion preference or very small screen)
export function shouldSkipAnimation(): boolean {
    return (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.innerWidth < 400
    );
}

// Scrolls to a section by id, with an optional delay (for menu close animations) and offset
export function scrollToSection(id: string, delay = 300, offset = 80): void {
    setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }, delay);
}

export const PROJECTS_ROUTE_PREFIX = '/projects/';

// Returns true when the current pathname is a project detail page
export function isProjectDetailPage(pathname: string): boolean {
    return pathname.startsWith(PROJECTS_ROUTE_PREFIX);
}
