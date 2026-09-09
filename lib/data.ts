import {
    IProject,
    IExperience,
    ICertificationCategory,
    ISkill,
    ITestimonial,
} from '@/types';
import { GitHubIcon, LinkedInIcon } from '@/components/shared/icons';
import { type ComponentType } from 'react';

export const GENERAL_INFO = {
    email: 'me@tariqahmad.dev',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Tariq, I am reaching out to you because...',

    linkedIn: 'https://www.linkedin.com/in/tariq-ahmad-a43320264/',
    phone: '+90 53 454 03345',
};

export const SOCIAL_LINKS: Array<{
    name: string;
    url: string;
    icon: ComponentType<{ className?: string }>;
}> = [
    { name: 'GitHub', url: 'https://github.com/tariqahmaad', icon: GitHubIcon },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/tariq-ahmad-a43320264/',
        icon: LinkedInIcon,
    },
];

// Typed so every entry is guaranteed to carry a name + icon path. The object
// keys are internal identifiers; Skills.tsx renders them as category labels.
export const MY_STACK: Record<string, ISkill[]> = {
    languages: [
        {
            name: 'JavaScript',
            icon: '/logo/js.png',
        },
        {
            name: 'TypeScript',
            icon: '/logo/ts.png',
        },
        {
            name: 'Python',
            icon: '/logo/python.png',
        },
        {
            name: 'Java',
            icon: '/logo/java.png',
        },
        {
            name: 'C',
            icon: '/logo/c.png',
        },
        {
            name: 'C++',
            icon: '/logo/cpp.png',
        },
        {
            name: 'C#',
            icon: '/logo/csharp.png',
        },
        {
            name: 'PHP',
            icon: '/logo/php.png',
        },
    ],
    frontend: [
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'React Native',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'Angular',
            icon: '/logo/angular.png',
        },
        {
            name: 'Bootstrap',
            icon: '/logo/bootstrap.svg',
        },
        {
            name: 'Tailwind',
            icon: '/logo/tailwind.png',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
        {
            name: 'Django',
            icon: '/logo/django.png',
        },
        {
            name: 'Spring Boot',
            icon: '/logo/spring.png',
        },
        {
            name: 'Firebase',
            icon: '/logo/firebase.png',
        },
    ],
    database: [
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'GitHub',
            icon: '/logo/github.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'CV Builder',
        slug: 'cv-builder',
        year: 2026,
        techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind'],
        description: `A resume builder I built to solve a problem I kept running into: formatting a CV shouldn't take longer than writing it. Everything runs in the browser, so your data never leaves your device. You get a real-time preview as you type, ATS-friendly PDF export, and a few templates to pick from.<br/><br/>

        Key Features:<br/>
        <ul>
            <li>Real-time preview as you fill in the form</li>
            <li>ATS-friendly PDF export</li>
            <li>Privacy-first: all data stays in the browser</li>
            <li>Auto-save to local storage</li>
            <li>Multiple resume versions with version control</li>
            <li>3 templates: Classic, Rhyhorn, Nexus</li>
            <li>Responsive and fast</li>
            
        </ul>`,
        role: ``,
        liveUrl: 'https://cv.tariqahmad.dev/',
    },
    {
        title: 'Quizlet',
        slug: 'quizlet',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        year: 2025,
        description: `A quiz app I built for fellow students to practice before exams. You pick a course, start a timed session, and get scored in real time. Nothing fancy, just something that actually helps you study instead of scrolling past it.<br/><br/>

        Key Features:<br/>
        <ul>
            <li>Course-specific quiz modules</li>
            <li>Timed quiz sessions</li>
            <li>Real-time scoring and feedback</li>
            <li>Works on both mobile and desktop</li>
            <li>Clean, distraction-free interface</li>
        </ul>`,
        role: ``,
        sourceCode: 'https://github.com/tariqahmaad/quizlet',
        liveUrl: 'https://tariqahmaad.github.io/quizlet/index.html',
    },
    {
        title: 'BudgetWise',
        slug: 'budgetwise',
        year: 2025,
        description: `
      A personal finance tracker I built to understand where my money was actually going. Log expenses, set budgets, and watch the numbers update in real time. Built with React Native and Firebase so it syncs across devices without a separate server. <br/> <br/>

      Key Features:<br/>
      <ul>
        <li>Log daily expenses with custom categories</li>
        <li>Set and monitor budget limits</li>
        <li>Real-time cloud sync via Firebase</li>
        <li>Visual spending reports and insights</li>
        <li>Secure user authentication</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Cross-platform with React Native</li>
        <li>Firebase for real-time database and auth</li>
        <li>Node.js backend for RESTful API services</li>
        <li>Custom UI components for a clean experience</li>
      </ul>
      `,
        role: `
      Full-Stack Developer <br/>
      <ul>
        <li>Built the cross-platform mobile app with React Native</li>
        <li>Designed and implemented a Node.js REST API</li>
        <li>Integrated Firebase for real-time sync and authentication</li>
        <li>Created the UI and user flow from scratch</li>
        <li>Tested across multiple devices and screen sizes</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'JavaScript',
            'Node.js',
            'Firebase',
            'REST API',
        ],
        sourceCode: 'https://github.com/tariqahmaad/BudgetWise',
    },
    {
        title: 'Graduation Project Presentation',
        slug: 'graduation-presentation',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        year: 2025,
        description: `Instead of a standard slide deck for my graduation project, I built an interactive web presentation from scratch. Smooth transitions, clickable navigation, and a layout that works on any screen. It was a chance to practice front-end fundamentals while making something more memorable than PowerPoint.<br/><br/>

        Highlights:<br/>
        <ul>
            <li>Built from scratch with HTML, CSS, and JavaScript</li>
            <li>Responsive across all devices</li>
            <li>Smooth transitions and animations</li>
            <li>Interactive navigation and content display</li>
            <li>Clean, modern design</li>
        </ul>`,
        role: ``,
        sourceCode: 'https://github.com/tariqahmaad/Presentation',
        liveUrl: 'https://tariqahmaad.github.io/Presentation/index.html',
    },
    {
        title: 'Note-Taking Web Application',
        slug: 'note-app',
        techStack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
        year: 2024,
        description: `A note-taking app I built to get hands-on with PHP and MySQL. It supports rich text editing, categories, search, and user accounts with role-based access. Nothing groundbreaking, but it taught me how to design a database schema, handle authentication, and build something people actually use.<br/><br/>

        What I Learned:<br/>
        <ul>
            <li>Designed a normalized MySQL schema from scratch</li>
            <li>Implemented secure authentication and role-based access</li>
            <li>Built search and filtering across notes</li>
            <li>Responsive design that works across browsers</li>
            <li>Got real feedback from users and iterated on it</li>
        </ul>`,
        role: ``,
        sourceCode:
            'https://github.com/tariqahmaad/Note-Taking-Web-Application',
    },
    {
        title: 'Hand-Written Digit Classifier',
        slug: 'digit-classifier',
        techStack: ['Python', 'Neural Networks', 'Deep Learning', 'TensorFlow'],
        year: 2023,
        description: `My first real machine learning project: training a neural network to recognize handwritten digits from the MNIST dataset. It started as a course assignment but turned into a deeper dive into how neural networks actually learn. I built the architecture from scratch, trained it on 60,000 images, and got it to over 95% accuracy on test data.<br/><br/>

        Technical Details:<br/>
        <ul>
            <li>Multi-layer neural network built from scratch</li>
            <li>Trained on 60,000 images from the MNIST dataset</li>
            <li>Achieved over 95% accuracy on test data</li>
            <li>Backpropagation and gradient descent optimization</li>
        </ul>`,
        role: ``,
    },
    {
        title: 'Hotel Management System',
        slug: 'hotel-management',
        techStack: ['C#', '.NET', 'MySQL', 'Windows Forms'],
        year: 2022,
        description: `A hotel management system I built in C# to get comfortable with desktop development and database design. It handles room bookings, guest check-in/check-out, and availability tracking, all connected to a MySQL database. It was my first time building a complete CRUD application, and it taught me how to think about data relationships and user workflows.<br/><br/>

        What I Learned:<br/>
        <ul>
            <li>Built full CRUD operations for rooms and guests</li>
            <li>Designed a MySQL database schema for hotel operations</li>
            <li>Automated room availability tracking</li>
            <li>Created check-in/check-out workflows</li>
            <li>Worked with Windows Forms and .NET for the first time</li>
        </ul>`,
        role: ``,
    },
];

export const MY_EXPERIENCE: IExperience[] = [
    {
        title: 'Research Assistant',
        company: 'Industry 4.0 Research Centre',
        startDate: 'October 2024',
        endDate: 'July 2025',
        startISO: '2024-10',
        endISO: '2025-07',
        employmentType: 'Research',
        // Most recent role — drives the highlighted card border, the glowing
        // timeline dot and the live duration meter. No role is ongoing, so
        // `endISO` stays a real date rather than null.
        highlighted: true,
        description:
            'Led research threads on using AI to make manufacturing systems smarter and more adaptive — carrying ideas from first principles through working prototypes, and keeping only what held up under testing.',
        highlights: [
            'Industry 4.0 applied research',
            'Prototype-driven validation',
            'Literature surveys',
        ],
        skills: ['AI', 'Python', 'Data Analysis'],
    },
    {
        title: 'Research Assistant Intern',
        company: 'Istanbul Aydin University',
        startDate: 'March 2024',
        endDate: 'May 2024',
        startISO: '2024-03',
        endISO: '2024-05',
        employmentType: 'Internship',
        description:
            'Contributed data analysis and documentation to academic research, where I learned that good research starts with asking the right question — and that there is a real difference between code that runs and code that proves something.',
        highlights: [
            'Data analysis for academic research',
            'Research documentation',
        ],
        skills: ['Data Analysis', 'Documentation'],
    },
    {
        title: 'Frontend Developer Intern',
        company: 'Caretta Software Company',
        startDate: 'November 2023',
        endDate: 'January 2024',
        startISO: '2023-11',
        endISO: '2024-01',
        employmentType: 'Internship',
        description:
            'Shipped responsive web interfaces in React and modern CSS inside a team codebase, through code reviews and shared ownership. My first exposure to professional workflow, and the reality that "it works on my machine" is never a good enough answer.',
        highlights: [
            'Responsive interfaces in React and modern CSS',
            'Collaborative Git workflow with code reviews',
        ],
        skills: ['React', 'CSS', 'Git'],
    },
    {
        title: 'Research Intern',
        company: 'Istanbul Aydin University',
        startDate: 'October 2023',
        endDate: 'January 2024',
        startISO: '2023-10',
        endISO: '2024-01',
        employmentType: 'Internship',
        description:
            'Joined computer engineering research initiatives to turn sprawling, ambiguous problems into questions small enough to actually answer — mostly through data analysis and literature review.',
        highlights: [
            'Scoping ambiguous research problems',
            'Data analysis',
            'Literature surveys',
        ],
        skills: ['Research', 'Data Analysis'],
    },
    {
        title: 'Network Technician',
        company: 'Tawhid Almas Logistics Company',
        startDate: 'July 2023',
        endDate: 'September 2023',
        startISO: '2023-07',
        endISO: '2023-09',
        description:
            'Owned the network infrastructure keeping every department of a logistics company connected. When the network goes down in a logistics company, nothing moves, so uptime was not optional.',
        highlights: [
            'Company-wide network infrastructure',
            'Uptime-critical logistics connectivity',
        ],
        skills: ['Networking', 'Troubleshooting'],
    },
    {
        title: 'IT Support Specialist',
        company: 'Tawhid Almas Logistics Company',
        startDate: 'July 2022',
        endDate: 'September 2022',
        startISO: '2022-07',
        endISO: '2022-09',
        description:
            'Kept daily logistics operations running through frontline technical support and systems maintenance. Learned that patience and a clear explanation often matter as much as technical knowledge, especially when someone just needs their system back up.',
        highlights: [
            'Frontline support for daily operations',
            'Systems maintenance and recovery',
        ],
        skills: ['Technical Support', 'Systems Maintenance'],
    },
];

export const MY_CERTIFICATIONS: ICertificationCategory[] = [
    {
        provider: 'Oxford International Digital Institute',
        certifications: [
            {
                title: 'Oxford Test of English - Overall Score: 8.0',
                date: 'November 2025',
            },
        ],
    },
    {
        provider: 'IDP Education',
        certifications: [
            {
                title: 'IELTS - Overall Band: 6.0',
                date: 'February 2025',
            },
        ],
    },
    {
        provider: 'Meta | Coursera',
        certifications: [
            {
                title: 'React Native',
                date: 'March 2025',
            },
        ],
    },
    {
        provider: 'Stanford | Coursera',
        certifications: [
            {
                title: 'Unsupervised Learning, Recommenders, Reinforcement Learning',
                date: 'September 2024',
            },
            {
                title: 'Supervised Machine Learning: Regression and Classification',
                date: 'August 2024',
            },
        ],
    },
    {
        provider: 'Google | Coursera',
        certifications: [
            {
                title: 'Technical Support Fundamentals',
                date: 'December 2023',
            },
            {
                title: 'Crash Course on Python',
                date: 'November 2023',
            },
            {
                title: 'Introduction to Large Language Models',
                date: 'October 2023',
            },
            {
                title: 'Introduction to Generative AI',
                date: 'July 2023',
            },
        ],
    },
    {
        provider: 'Microsoft | edX',
        certifications: [
            {
                title: 'Introduction to C++',
                date: 'November 2020',
            },
        ],
    },
    {
        provider: 'Erasoft IT Institute',
        certifications: [
            {
                title: 'Cisco Certified Network Associate (CCNA)',
                date: 'August 2019',
            },
            {
                title: 'Wireless Networking',
                date: 'August 2019',
            },
            {
                title: 'Microsoft Certified Solution Expert (MCSE)',
                date: 'July 2019',
            },
        ],
    },
    {
        provider: 'University of Queensland | edX',
        certifications: [
            {
                title: 'IELTS Academic Test Preparation',
                date: 'December 2017',
            },
        ],
    },
];

export const BANNER_ROLES = [
    { first: 'COMPUTER', second: 'ENGINEER' },
    { first: 'SOFTWARE', second: 'DEVELOPER' },
    { first: 'FULL-STACK', second: 'DEVELOPER' },
    { first: 'AI/ML', second: 'ENTHUSIAST' },
    { first: 'NETWORK', second: 'SPECIALIST' },
    { first: 'RESEARCH', second: 'ASSISTANT' },
];

export const BANNER_STATS = {
    cgpa: '3.36',
    projects: `${PROJECTS.length}+`,
    certifications: `${MY_CERTIFICATIONS.reduce((acc, cat) => acc + cat.certifications.length, 0)}+`,
};

export const ABOUT_ME = {
    tagline:
        'I build software that people actually enjoy using, one thoughtful detail at a time.',
    currently: 'Open to new opportunities in software development and AI.',
    bio: [
        "I'm Tariq, a Computer Engineering graduate from Istanbul Aydin University. What started as curiosity about how things work under the hood turned into a genuine passion for building software that doesn't just function, but feels right to use.",
        "My path hasn't been a straight line, and I think that's a strength. I've worked on Industry 4.0 research, kept networks running for a logistics company, and built web apps from scratch. Each role taught me something different, and together they shaped how I approach problems: practically, patiently, and with a healthy skepticism for \"we've always done it this way.\"",
        "I speak English and Dari fluently and get by in Hindi, which comes in handy more often than you'd expect. Day to day, I work with C, C++, Java, Python, and modern web frameworks, but I'm more interested in the problem in front of me than the tool I use to solve it.",
    ],
};

// Testimonials are real, permission-cleared quotes. Drop avatar images into
// public/testimonials/ and set the `avatar` path (e.g.
// '/testimonials/jane-doe.jpg') to show a photo instead of the fallback
// user icon.
export const TESTIMONIALS: ITestimonial[] = [
    {
        name: 'Alparslan Horasan',
        role: 'Assistant Professor',
        linkedInUrl: 'https://www.linkedin.com/in/alparslan-horasan-27328a50/',
        // avatar: '/testimonials/testimonials-1.jpg',
        quote: "Tariq joined our Industry 4.0 Research Center in his second year, which is earlier than most students do. He just got on with the boring work, literature reviews, cleaning data, running the same experiments again. His graduation project proved what we already knew, he does not cut corners. For me he is up there with the best students I have supervised.",
        rating: 5,
    },
    {
        name: 'Selçuk Şener',
        role: 'Senior Software Developer',
        linkedInUrl: 'https://www.linkedin.com/in/sel%C3%A7uk-%C5%9Fener-69613689/',
        // avatar: '/testimonials/testimonials-2.jpg',
        quote: "I have mentored a lot of interns and Tariq picked things up quicker than anyone. By week three he was writing React components we could actually ship and asking good questions about our design choices. He came second in our internal coding competition too, honestly that did not surprise me. Just look at his GitHub, he finishes what he starts.",
        rating: 5,
    },
    {
        name: "Roa'a Ali",
        role: 'Assistant Professor',
        // avatar: '/testimonials/testimonials-3.jpg',
        quote: "He is one of those students whose work makes you stop and look. His Hotel Management System was not even assigned, he built it alone with C#, .NET and MySQL just because he wanted to make something real, most undergrads do not do that. He explains technical stuff clearly in English as well, and that kind of communication helps a team a lot more than people think.",
        rating: 5,
    },
    {
        name: 'Wasim Raed',
        role: 'Senior Professor',
        linkedInUrl: 'https://www.linkedin.com/in/wasim-raad-b5972114/',
        // avatar: '/testimonials/testimonials-4.jpg',
        quote: "What I remember about Tariq is he kept learning after exams were over. He would come to office hours and ask about ML architectures and cloud deployment, stuff that was not even in the course. He did Stanford's machine learning certification by himself and his TensorFlow digit classifier showed he got the math behind it, not only the API calls. You do not see that depth often in undergrad work.",
        rating: 5,
    },
    {
        name: 'Zafer Aslan',
        role: 'Vice Dean',
        linkedInUrl: 'https://tr.linkedin.com/in/zafer-aslan-93629172',
        // avatar: '/testimonials/testimonials-5.jpg',
        quote: "He kept coming back to our Industry 4.0 Research Center for three terms even though he did not have to. Every term we gave him bigger tasks, at first literature reviews, then helping design experiments, then presenting results to the group. A lot of undergrads just use research for their CV. Tariq actually cared about it.",
        rating: 5,
    },
];