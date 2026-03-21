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
    role: string;
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
    description?: string;
    highlighted?: boolean;
}
