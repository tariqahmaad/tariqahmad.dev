import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'tariq_muzamil@live.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Tariq, I am reaching out to you because...',

    linkedIn: 'https://www.linkedin.com/in/tariq-ahmad-a43320264/',
    phone: '+90 53 454 03345',
};

export const SOCIAL_LINKS = [
    { name: 'GitHub', url: 'https://github.com/tariqahmaad' },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/tariq-ahmad-a43320264/',
    },
];

export const MY_STACK = {
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
        title: 'Quizlet',
        slug: 'quizlet',
        techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
        year: 2024,
        description: `A web-based quiz application designed to help students practice and test their knowledge in university-level courses. The platform supports course-specific quizzes, timer-based sessions, real-time scoring, and a responsive interface.<br/><br/>

        Key Features:<br/>
        <ul>
            <li>📚 Course-specific quiz modules</li>
            <li>⏱️ Timer-based quiz sessions</li>
            <li>📊 Real-time scoring and feedback</li>
            <li>📱 Fully responsive design for mobile and desktop</li>
            <li>🎯 Interactive user interface for better learning experience</li>
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
      Mobile-first finance tracker built with React Native and Firebase. Users log daily expenses, set budgets, and view real-time analytics via RESTful APIs and cloud-sync. <br/> <br/>

      Key Features:<br/>
      <ul>
        <li>💰 Expense Tracking: Log daily transactions with categories</li>
        <li>📊 Budget Management: Set and monitor budget limits</li>
        <li>📱 Real-time Sync: Cloud-based data synchronization with Firebase</li>
        <li>📈 Financial Reports: Visual analytics and spending insights</li>
        <li>🔒 Secure Authentication: User login and data protection</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Built with React Native for cross-platform compatibility</li>
        <li>Integrated Firebase for real-time database and authentication</li>
        <li>Implemented Node.js backend for RESTful API services</li>
        <li>Developed responsive UI with custom components</li>
      </ul>
      `,
        role: `
      Full-Stack Developer <br/>
      <ul>
        <li>📱 Mobile Development: Built cross-platform app using React Native</li>
        <li>🔧 Backend: Implemented Node.js API for data management</li>
        <li>☁️ Cloud Integration: Connected Firebase for real-time synchronization</li>
        <li>🎨 UI/UX: Designed intuitive user interface for financial tracking</li>
        <li>🧪 Testing: Performed comprehensive testing across devices</li>
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
        techStack: ['HTML', 'CSS', 'JavaScript', 'Presentation'],
        year: 2024,
        description: `Developed an interactive presentation showcasing my graduation project, utilizing HTML, CSS, and JavaScript for a dynamic and engaging user experience. The presentation features smooth transitions, interactive elements, and modern web design principles.<br/><br/>

        Highlights:<br/>
        <ul>
            <li>🎨 Modern and interactive design</li>
            <li>📱 Responsive layout for all devices</li>
            <li>✨ Smooth transitions and animations</li>
            <li>📊 Dynamic content display</li>
            <li>🎯 Engaging user experience</li>
        </ul>`,
        role: ``,
        sourceCode: 'https://github.com/tariqahmaad/Presentation',
        liveUrl: 'https://tariqahmaad.github.io/Presentation/index.html',
    },
    {
        title: 'Note-Taking Web Application',
        slug: 'note-app',
        techStack: ['PHP', 'MySQL', 'JavaScript', 'Authentication'],
        year: 2024,
        description: `Developed a web-based note-taking app with PHP, MySQL, and front-end technologies, offering secure user authentication, role-specific functions, and a responsive, cross-browser interface. Features include rich text editing, categorization, search functionality, and user authentication.<br/><br/>

        Results:<br/>
        <ul>
            <li>📈 Increased user engagement significantly</li>
            <li>👍 Received positive feedback from users</li>
            <li>🔍 Implemented advanced search and filtering</li>
            <li>📱 Responsive design for mobile and desktop</li>
            <li>🔐 Secure user authentication and role-based access control</li>
        </ul>`,
        role: ``,
        sourceCode:
            'https://github.com/tariqahmaad/Note-Taking-Web-Application',
    },
    {
        title: 'Hospital Management System',
        slug: 'hospital-management',
        techStack: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
        year: 2023,
        description: `Created a Java Spring Boot-based Hospital Management System to streamline hospital functions, featuring patient, doctor, and appointment management with RESTful APIs and MySQL. The system manages patient records, appointments, medical staff, inventory, and billing operations, demonstrating strong backend development and system design skills in healthcare software solutions.<br/><br/>

        Impact:<br/>
        <ul>
            <li>📉 Reduced data management errors by 15%</li>
            <li>⚡ Optimized database operations for faster processing</li>
            <li>🏥 Streamlined patient-doctor interaction workflows</li>
            <li>💊 Integrated pharmacy and inventory management</li>
        </ul>`,
        role: `As the full-stack developer, I:<br/>
        - Architected the application using Spring Boot and MVC pattern<br/>
        - Implemented complex business logic for healthcare operations<br/>
        - Designed normalized MySQL database schema<br/>
        - Developed secure authentication and authorization system with RESTful APIs`,
        sourceCode: 'https://github.com/tariqahmaad/Hospital-Management-System',
    },
    {
        title: 'Hand-Written Digit Classifier',
        slug: 'digit-classifier',
        techStack: ['Python', 'Neural Networks', 'Deep Learning', 'TensorFlow'],
        year: 2023,
        description: `A machine learning project focused on accurate handwritten digit recognition using deep neural networks. The classifier was trained on the MNIST dataset to achieve high accuracy in digit classification.<br/><br/>

        Technical Details:<br/>
        <ul>
            <li>🧠 Implemented multi-layer neural network architecture</li>
            <li>📊 Trained on 60,000 training images from MNIST dataset</li>
            <li>✨ Achieved over 95% accuracy on test data</li>
            <li>⚙️ Used backpropagation and gradient descent optimization</li>
        </ul>`,
        role: ``,
    },
    {
        title: 'Hotel Management System',
        slug: 'hotel-management',
        techStack: ['C#', '.NET', 'MySQL', 'CRUD'],
        year: 2022,
        description: `Developed a C# Hotel Management System in Microsoft Visual Studio, featuring CRUD operations for customer and room management, integrated with MySQL for secure data handling, enhancing skills in SQL and database management. A comprehensive system designed to streamline booking and reservation processes for hospitality businesses.<br/><br/>

        Achievements:<br/>
        <ul>
            <li>🏨 Enhanced booking and reservation processes</li>
            <li>📅 Automated room availability tracking</li>
            <li>👥 Improved guest management workflows</li>
            <li>💼 Streamlined check-in/check-out operations</li>
            <li>💾 Implemented CRUD operations for efficient data management</li>
        </ul>`,
        role: ``,
    },
    {
        title: 'Banking Management System',
        slug: 'banking-system',
        techStack: ['Java', 'Swing', 'GUI', 'Security'],
        year: 2022,
        description: `Created a Java-based Banking Management System with a user-friendly interface for account management, including features like deposit, withdrawal, and account details, enhancing user experience in secure financial transactions. Built with strong security measures and user authentication.<br/><br/>

        Key Features:<br/>
        <ul>
            <li>🔐 Facilitated secure financial transactions</li>
            <li>💰 Account management and balance inquiries</li>
            <li>💸 Fund transfer functionality (deposit and withdrawal)</li>
            <li>📝 Transaction history tracking</li>
            <li>🖥️ User-friendly GUI built with Java Swing</li>
        </ul>`,
        role: ``,
    },
    {
        title: 'Airport Management System',
        slug: 'airport-management',
        techStack: ['Python', 'Django', 'MySQL', 'HTML/CSS', 'JavaScript'],
        year: 2024,
        description: `A web-based Airport Management System developed with HTML, CSS, JavaScript, Python, Django framework, and MySQL database. The platform handles flight scheduling, passenger management, staff coordination, and facility oversight with secure user authentication and role-specific functions. <br/><br/>

        Key achievements:<br/>
        <ul>
            <li>✅ Improved issue resolution by 20%</li>
            <li>📊 Streamlined operational workflows</li>
            <li>👥 Enhanced team productivity significantly</li>
            <li>🔐 Implemented secure user authentication and role-based access</li>
            <li>📱 Responsive, cross-browser interface</li>
        </ul>`,
        role: `As the backend developer, I: <br/>
        - Designed and implemented the system architecture using Django framework<br/>
        - Developed RESTful APIs for frontend integration<br/>
        - Optimized MySQL database queries for better performance<br/>
        - Created responsive admin dashboard with modern web technologies`,
        sourceCode: 'https://github.com/tariqahmaad/vercel-project',
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'Research Assistant',
        company: 'Industry 4.0 Research Centre',
        duration: 'Oct 2024 - July 2025',
    },
    {
        title: 'Research Assistant Intern',
        company: 'Istanbul Aydin University',
        duration: 'March 2024 - May 2024',
    },
    {
        title: 'Frontend Developer Intern',
        company: 'Caretta Software Company',
        duration: 'Nov 2023 - Jan 2024',
    },
    {
        title: 'Research Intern',
        company: 'Istanbul Aydin University',
        duration: 'Oct 2023 - Jan 2024',
    },
    {
        title: 'Network Technician',
        company: 'Tawhid Almas Logistics Company',
        duration: 'July 2023 - Sept 2023',
    },
    {
        title: 'IT Support Specialist',
        company: 'Tawhid Almas Logistics Company',
        duration: 'July 2022 - Sept 2022',
    },
];

export const MY_CERTIFICATIONS = [
    {
        provider: 'Oxford International Digital Institute',
        certifications: [
            {
                title: 'Oxford Test of English - Overall Score: 8.0',
                date: 'Nov 2025',
            },
        ],
    },
    {
        provider: 'IDP Education',
        certifications: [
            {
                title: 'IELTS - Overall Band: 6.0',
                date: 'Feb 2025',
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
                date: 'Sept 2024',
            },
            {
                title: 'Supervised Machine Learning: Regression and Classification',
                date: 'Aug 2024',
            },
        ],
    },
    {
        provider: 'Google | Coursera',
        certifications: [
            {
                title: 'Technical Support Fundamentals',
                date: 'Dec 2023',
            },
            {
                title: 'Crash Course of Python',
                date: 'Nov 2023',
            },
            {
                title: 'Introduction to Large Language Model',
                date: 'Oct 2023',
            },
            {
                title: 'Introduction to Generative AI',
                date: 'July 2023',
            },
        ],
    },
    {
        provider: 'Microsoft | EDx',
        certifications: [
            {
                title: 'Introduction to C++',
                date: 'Nov 2020',
            },
        ],
    },
    {
        provider: 'Erasoft IT Institute',
        certifications: [
            {
                title: 'Cisco Certified Network Associate (CCNA)',
                date: 'Aug 2019',
            },
            {
                title: 'Wireless Networking',
                date: 'Aug 2019',
            },
            {
                title: 'Microsoft Certified Solution Expert (MCSE)',
                date: 'July 2019',
            },
        ],
    },
    {
        provider: 'University of Queensland | EDx',
        certifications: [
            {
                title: 'IELTS Academic Test Preparation',
                date: 'Dec 2017',
            },
        ],
    },
];
