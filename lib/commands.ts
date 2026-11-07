import {
    Clipboard,
    ExternalLink,
    FileText,
    FolderGit2,
    Github,
    Linkedin,
    Mail,
    Menu,
    PanelsTopLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { GENERAL_INFO, PROJECTS } from '@/lib/data';
import { SITE_SECTIONS } from '@/lib/navigation';

/**
 * Static command index for the console. The palette owns execution; this
 * module only describes what exists, so the list is data, not UI.
 */
export type CommandKind =
    | 'section'
    | 'route'
    | 'external'
    | 'copy-email'
    | 'open-menu';

export type CommandGroup = 'Navigate' | 'Projects' | 'Product' | 'Links' | 'Actions';

export interface CommandSeed {
    id: string;
    group: CommandGroup;
    label: string;
    hint?: string;
    /** Extra search terms that are not in the label. */
    keywords?: string[];
    icon: LucideIcon;
    kind: CommandKind;
    /** Section id, route path, or URL, depending on `kind`. */
    target?: string;
}

const SECTION_COMMANDS: CommandSeed[] = SITE_SECTIONS.map((section) => ({
    id: `section:${section.id}`,
    group: 'Navigate',
    label: section.label,
    hint:
        section.id === 'banner'
            ? 'top'
            : section.prefix.replace(/^\.\//, '~/'),
    keywords: section.keywords,
    icon: section.icon,
    kind: 'section',
    target: section.id,
}));

const PROJECT_COMMANDS: CommandSeed[] = PROJECTS.map((project) => ({
    id: `project:${project.slug}`,
    group: 'Projects',
    label: project.title,
    hint: `${project.year} · ${project.techStack[0]}`,
    keywords: [
        'project',
        project.slug,
        String(project.year),
        ...project.techStack,
    ],
    icon: FolderGit2,
    kind: 'route',
    target: `/projects/${project.slug}`,
}));

export const COMMAND_SEEDS: CommandSeed[] = [
    ...SECTION_COMMANDS,
    ...PROJECT_COMMANDS,
    {
        id: 'product:live',
        group: 'Product',
        label: 'Open CV Builder',
        hint: 'live app',
        keywords: ['cv', 'resume', 'builder', 'generator', 'app', 'live'],
        icon: ExternalLink,
        kind: 'external',
        target: 'https://cv.tariqahmad.dev',
    },
    {
        id: 'product:case-study',
        group: 'Product',
        label: 'CV Builder case study',
        hint: '/product',
        keywords: ['product', 'case', 'study', 'features', 'screenshots'],
        icon: PanelsTopLeft,
        kind: 'route',
        target: '/product',
    },
    {
        id: 'product:cv',
        group: 'Product',
        label: 'Open my CV',
        hint: 'cv',
        keywords: ['cv', 'resume', 'download', 'pdf'],
        icon: FileText,
        kind: 'external',
        target: GENERAL_INFO.cvUrl,
    },
    {
        id: 'link:github',
        group: 'Links',
        label: 'GitHub',
        hint: 'external',
        keywords: ['github', 'code', 'source', 'repos'],
        icon: Github,
        kind: 'external',
        target: 'https://github.com/tariqahmaad',
    },
    {
        id: 'link:linkedin',
        group: 'Links',
        label: 'LinkedIn',
        hint: 'external',
        keywords: ['linkedin', 'connect', 'network'],
        icon: Linkedin,
        kind: 'external',
        target: GENERAL_INFO.linkedIn,
    },
    {
        id: 'link:repo',
        group: 'Links',
        label: 'This site on GitHub',
        hint: 'source',
        keywords: ['source', 'repo', 'code', 'portfolio'],
        icon: Github,
        kind: 'external',
        target: 'https://github.com/tariqahmaad/tariqahmad.dev',
    },
    {
        id: 'action:copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: GENERAL_INFO.email,
        keywords: ['email', 'copy', 'contact', 'mail'],
        icon: Clipboard,
        kind: 'copy-email',
        target: GENERAL_INFO.email,
    },
    {
        id: 'action:open-menu',
        group: 'Actions',
        label: 'Open site menu',
        hint: 'menu',
        keywords: ['menu', 'navigation', 'index'],
        icon: Menu,
        kind: 'open-menu',
    },
    {
        id: 'action:contact',
        group: 'Actions',
        label: 'Go to contact',
        hint: 'footer',
        keywords: ['contact', 'email', 'hire', 'touch'],
        icon: Mail,
        kind: 'section',
        target: 'contact',
    },
];

/** Groups in display order; empty groups are dropped by the palette. */
export const COMMAND_GROUPS: CommandGroup[] = [
    'Navigate',
    'Projects',
    'Product',
    'Links',
    'Actions',
];
