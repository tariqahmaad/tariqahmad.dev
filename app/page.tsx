'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="fixed top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="fixed top-0 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="fixed -bottom-40 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/50 backdrop-blur-xl z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TA</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tariq Ahmad
            </h1>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#about" className="hover:text-blue-400 transition-colors duration-300">About</a>
            <a href="#skills" className="hover:text-blue-400 transition-colors duration-300">Skills</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors duration-300">Projects</a>
            <a href="#experience" className="hover:text-blue-400 transition-colors duration-300">Experience</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              💻 Computer Engineering Student
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Software Developer
            </span>
            <br />
            <span className="text-white">& Engineer</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Computer Engineering student at Istanbul Aydin University with expertise in
            full-stack development, networking, and system architecture. Building innovative
            solutions with modern technologies.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a
              href="#contact"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105"
            >
              <span className="relative z-10">Get In Touch</span>
            </a>
            <a
              href="#projects"
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-lg font-medium hover:bg-blue-500/10 transition-all duration-300"
            >
              View Projects
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex gap-4 justify-center text-gray-400">
            <a href="https://linkedin.com/in/tariqahmad" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <a href="https://github.com/tariqahmaad" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href="mailto:tariq_muzamil@live.com" className="hover:text-blue-400 transition-colors">
              Email
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-500/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '3.36', label: 'CGPA / 4.0', icon: '🎓' },
              { number: '8+', label: 'Major Projects', icon: '💼' },
              { number: '15+', label: 'Certifications', icon: '📜' },
              { number: '3rd', label: 'Coding Competition', icon: '🏆' },
            ].map((stat, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:scale-105"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I&apos;m an ambitious Computer Engineering student at Istanbul Aydin University with a solid
                grounding in software development, networking, and web technologies. Currently maintaining
                a CGPA of 3.36/4.0 and set to graduate in July 2025.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                My experience spans full-stack development, research assistance in Industry 4.0 technologies,
                and hands-on work in network infrastructure. I&apos;ve successfully delivered projects ranging
                from mobile applications to enterprise management systems, always focusing on innovative
                solutions and system performance optimization.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm font-medium">
                  Istanbul, Turkey 🇹🇷
                </span>
                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-sm font-medium">
                  IELTS Band 6.0
                </span>
                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm font-medium">
                  Available July 2025
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Education</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse" />
                    <div>
                      <div className="font-semibold text-white">Bachelor of Computer Engineering</div>
                      <div className="text-gray-400 text-sm">Istanbul Aydin University</div>
                      <div className="text-blue-400 text-sm">CGPA: 3.36/4.0 | Sept 2021 – July 2025</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                    <div>
                      <div className="font-semibold text-white">Research Assistant</div>
                      <div className="text-gray-400 text-sm">Industry 4.0 Research Centre</div>
                      <div className="text-purple-400 text-sm">Oct 2024 – July 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technical Skills
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💻',
                title: 'Programming Languages',
                skills: ['C', 'C++', 'C#', 'Java', 'Python'],
              },
              {
                icon: '🌐',
                title: 'Web Technologies',
                skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'React Native'],
              },
              {
                icon: '🗄️',
                title: 'Database',
                skills: ['MySQL', 'PostgreSQL', 'Google Firebase'],
              },
              {
                icon: '🔧',
                title: 'Frameworks & Libraries',
                skills: ['Spring Boot', 'Angular', 'Django', 'Node.js', 'Bootstrap'],
              },
              {
                icon: '🌍',
                title: 'Networking',
                skills: ['CCNA', 'MCSE', 'Wireless Networking', 'CCTV'],
              },
              {
                icon: '🤖',
                title: 'AI & Machine Learning',
                skills: ['Neural Networks', 'Deep Learning', 'Generative AI', 'LLM'],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-xl font-bold text-blue-400 mb-4">{category.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-gray-300 text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Personal Budget Application',
                description: 'Mobile app for tracking daily expenses and managing financial budgets. Built with React Native and Firebase for real-time data synchronization.',
                tags: ['React Native', 'Firebase', 'Node.js', 'API'],
                date: 'Sep 2024 – July 2025',
                icon: '💰',
              },
              {
                title: 'Airport Management System',
                description: 'Comprehensive system for managing airport operations. Improved issue resolution by 20%, boosting team productivity significantly.',
                tags: ['Python', 'Django', 'PostgreSQL', 'Bootstrap'],
                date: 'June 2024',
                icon: '✈️',
              },
              {
                title: 'Hospital Management System',
                description: 'Enterprise-grade system for healthcare facilities. Optimized data management processes, reducing errors by 15%.',
                tags: ['Java', 'Spring Boot', 'MySQL'],
                date: 'Dec 2023',
                icon: '🏥',
              },
              {
                title: 'Hand-Written Digit Classifier',
                description: 'Deep learning neural network for accurate digital classification using advanced machine learning techniques.',
                tags: ['Python', 'Neural Networks', 'Deep Learning'],
                date: 'Nov 2023',
                icon: '🧠',
              },
              {
                title: 'Note-Taking Web Application',
                description: 'Streamlined information management platform that increased user engagement and received positive feedback.',
                tags: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
                date: 'Jan 2024',
                icon: '📝',
              },
              {
                title: 'Banking Management System',
                description: 'Secure financial transaction platform with robust security features and user authentication.',
                tags: ['Java', 'MySQL', 'Security'],
                date: 'Jan – Apr 2022',
                icon: '🏦',
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{project.icon}</div>
                  <span className="text-xs text-blue-400 font-mono">{project.date}</span>
                </div>

                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h4>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experience
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            {[
              {
                role: 'Research Assistant',
                company: 'Industry 4.0 Research Centre',
                period: 'Oct 2024 – July 2025',
                description: 'Exploring cutting-edge advancements in Industry 4.0 technologies, designing experiments, and assisting in grant proposals.',
                icon: '🔬',
              },
              {
                role: 'Research Assistant Intern',
                company: 'Istanbul Aydin University',
                period: 'March 2024 – May 2024',
                description: 'Analyzed data, conducted literature reviews, and collaborated on presentations and critical analysis.',
                icon: '📚',
              },
              {
                role: 'Front-End Developer Intern',
                company: 'Caretta Software Company',
                period: 'Nov 2023 – Jan 2024',
                description: 'Developed UIs with Angular, integrated APIs for responsive design, and built scalable web applications.',
                icon: '💻',
              },
              {
                role: 'Network Technician',
                company: 'Tawhid Almas Logistics Company',
                period: 'July 2023 – Sept 2023',
                description: 'Installed and troubleshot networks, monitored performance, and managed backup and recovery systems.',
                icon: '🌐',
              },
              {
                role: 'IT Support Specialist',
                company: 'Tawhid Almas Logistics Company',
                period: 'July 2022 – Sept 2022',
                description: 'Provided troubleshooting and software support, maintained hardware, and managed email support.',
                icon: '🛠️',
              },
            ].map((exp, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{exp.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {exp.role}
                        </h4>
                        <div className="text-blue-400">{exp.company}</div>
                      </div>
                      <span className="text-sm text-gray-400 font-mono">{exp.period}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Certifications
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'React Native', org: 'Meta / Coursera', year: '2025' },
              { name: 'Machine Learning', org: 'Stanford / Coursera', year: '2024' },
              { name: 'CCNA', org: 'Cisco', year: '2019' },
              { name: 'MCSE', org: 'Microsoft', year: '2019' },
              { name: 'Python Crash Course', org: 'Google / Coursera', year: '2023' },
              { name: 'Generative AI', org: 'Google / Coursera', year: '2023' },
              { name: 'C++ Intro', org: 'Microsoft / EDx', year: '2020' },
              { name: 'IELTS 6.0', org: 'IDP Education', year: '2025' },
            ].map((cert, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    📜
                  </div>
                  <span className="text-xs text-blue-400 font-mono">{cert.year}</span>
                </div>
                <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {cert.name}
                </h4>
                <p className="text-gray-400 text-xs">{cert.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <p className="text-xl text-gray-300 mb-12">
            Looking for a talented software developer? I&apos;m graduating in July 2025 and
            open to opportunities in software development, web technologies, and system engineering.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="mailto:tariq_muzamil@live.com"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105"
            >
              📧 tariq_muzamil@live.com
            </a>
            <a
              href="tel:+905345403345"
              className="px-8 py-4 border-2 border-blue-500 text-blue-400 rounded-lg font-medium hover:bg-blue-500/10 transition-all duration-300"
            >
              📱 +90 53 454 03345
            </a>
          </div>

          <div className="mt-8 flex gap-6 justify-center">
            <a
              href="https://linkedin.com/in/tariqahmad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              💼 LinkedIn
            </a>
            <a
              href="https://github.com/tariqahmaad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              🔗 GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 mb-2">
            &copy; 2025 Tariq Ahmad. Building the future, one line of code at a time.
          </p>
          <p className="text-gray-600 text-sm">
            Istanbul, Turkey | Computer Engineering Student | Available July 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
