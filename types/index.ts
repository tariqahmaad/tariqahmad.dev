export type Variant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
    | 'no-color';

export interface ISkill {
    name: string;
    icon: string;
}

export interface ICertification {
    title: string;
    date: string;
}

export interface ICertificationCategory {
    provider: string;
    certifications: ICertification[];
}

export interface IProject {
    title: string;
    year: number;
    description: string;
    /**
     * Optional: only solo or self-directed projects carry a written role, and
     * `ProjectDetails` guards the section with `{project.role && …}`. It used to
     * be required, which forced six `role: ''` placeholders that rendered
     * nothing.
     */
    role?: string;
    techStack: string[];
    thumbnail?: string;
    longThumbnail?: string;
    images?: string[];
    slug: string;
    liveUrl?: string;
    sourceCode?: string;
}

export interface IExperience {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    /** Machine-readable tenure bounds (YYYY-MM). `endISO: null` = ongoing. */
    startISO: string;
    endISO: string | null;
    description?: string;
    highlighted?: boolean;
    employmentType?: 'Research' | 'Internship' | 'Full-time' | 'Contract';
    location?: string;
    /** Skill chips shown in the expanded panel (click scrolls to My Stack). */
    skills?: string[];
    /** Achievement bullets shown in the expanded panel. */
    highlights?: string[];
}

export interface ITestimonial {
    name: string;
    role: string;
    avatar?: string;
    quote: string;
    rating?: 0 | 1 | 2 | 3 | 4 | 5;
    linkedInUrl?: string;
}
