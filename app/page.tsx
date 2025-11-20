'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* Animated gradient orb */}
      <div className="fixed top-0 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="fixed top-0 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="fixed -bottom-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-sm">TA</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Tariq Ahmad
            </h1>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#about" className="hover:text-cyan-400 transition-colors duration-300">About</a>
            <a href="#expertise" className="hover:text-cyan-400 transition-colors duration-300">Expertise</a>
            <a href="#certifications" className="hover:text-cyan-400 transition-colors duration-300">Certifications</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors duration-300">Projects</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium backdrop-blur-sm">
              🔒 Security Professional
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Cybersecurity
            </span>
            <br />
            <span className="text-white">Analyst</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Protecting digital assets through advanced threat detection, penetration testing,
            and security architecture. Specialized in network security and incident response.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#contact"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105"
            >
              <span className="relative z-10">Get In Touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#projects"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              View Projects
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cyan-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5+', label: 'Years Experience', icon: '🛡️' },
              { number: '200+', label: 'Threats Mitigated', icon: '🔐' },
              { number: '15+', label: 'Certifications', icon: '📜' },
              { number: '99.9%', label: 'Uptime Maintained', icon: '⚡' },
            ].map((stat, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:scale-105"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
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
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              About Me
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I&apos;m a dedicated cybersecurity analyst with over 5 years of experience protecting organizations
                from evolving cyber threats. My expertise spans penetration testing, threat intelligence,
                and security operations.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Specializing in proactive threat hunting and incident response, I&apos;ve successfully defended
                critical infrastructure against advanced persistent threats and zero-day exploits. My approach
                combines technical excellence with strategic security planning.
              </p>
              <div className="flex flex-wrap gap-3">
                {['CISSP', 'CEH', 'Security+', 'OSCP', 'CySA+'].map((cert) => (
                  <span key={cert} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-gray-400 font-mono text-sm">Network Security Architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse animation-delay-1000" />
                    <span className="text-gray-400 font-mono text-sm">Penetration Testing & Red Teaming</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-2000" />
                    <span className="text-gray-400 font-mono text-sm">Threat Intelligence & Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse animation-delay-3000" />
                    <span className="text-gray-400 font-mono text-sm">Incident Response & Forensics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-4000" />
                    <span className="text-gray-400 font-mono text-sm">Security Compliance & Auditing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Technical Expertise
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Penetration Testing',
                skills: ['Web App Testing', 'Network Pentesting', 'Mobile Security', 'API Security'],
              },
              {
                icon: '🛡️',
                title: 'Security Operations',
                skills: ['SIEM Management', 'Log Analysis', 'Threat Hunting', 'SOC Operations'],
              },
              {
                icon: '🔐',
                title: 'Cryptography',
                skills: ['PKI', 'SSL/TLS', 'Encryption', 'Key Management'],
              },
              {
                icon: '⚙️',
                title: 'Security Tools',
                skills: ['Metasploit', 'Burp Suite', 'Wireshark', 'Nmap', 'Kali Linux'],
              },
              {
                icon: '☁️',
                title: 'Cloud Security',
                skills: ['AWS Security', 'Azure Security', 'Container Security', 'IAM'],
              },
              {
                icon: '📊',
                title: 'Compliance',
                skills: ['ISO 27001', 'NIST', 'GDPR', 'PCI-DSS'],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-xl font-bold text-cyan-400 mb-4">{category.title}</h4>
                <div className="space-y-2">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="text-gray-400 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Certifications
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'CISSP', org: 'ISC²', year: '2023' },
              { name: 'CEH', org: 'EC-Council', year: '2022' },
              { name: 'OSCP', org: 'Offensive Security', year: '2023' },
              { name: 'Security+', org: 'CompTIA', year: '2021' },
              { name: 'CySA+', org: 'CompTIA', year: '2022' },
              { name: 'CCNA Security', org: 'Cisco', year: '2021' },
            ].map((cert, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center text-xl">
                    📜
                  </div>
                  <span className="text-xs text-cyan-400 font-mono">{cert.year}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {cert.name}
                </h4>
                <p className="text-gray-400 text-sm">{cert.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Security Projects
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Enterprise SOC Implementation',
                description: 'Designed and deployed a 24/7 Security Operations Center for a Fortune 500 company, integrating SIEM, IDS/IPS, and threat intelligence platforms. Reduced incident response time by 60%.',
                tags: ['SIEM', 'Splunk', 'ELK Stack', 'Threat Intel'],
                impact: '60% faster response',
                icon: '🏢',
              },
              {
                title: 'Zero Trust Architecture',
                description: 'Implemented zero-trust security model for cloud infrastructure, including micro-segmentation, identity verification, and continuous monitoring. Protected 10,000+ endpoints.',
                tags: ['Zero Trust', 'IAM', 'Cloud Security', 'Azure'],
                impact: '10K+ endpoints secured',
                icon: '🔒',
              },
              {
                title: 'Advanced Threat Detection',
                description: 'Developed custom detection rules and machine learning models to identify APTs and zero-day exploits. Successfully detected and mitigated 200+ advanced threats.',
                tags: ['Machine Learning', 'YARA', 'Python', 'Threat Hunting'],
                impact: '200+ threats stopped',
                icon: '🎯',
              },
              {
                title: 'Penetration Testing Program',
                description: 'Established comprehensive pentesting program including web apps, networks, and APIs. Identified and remediated critical vulnerabilities before exploitation.',
                tags: ['Pentesting', 'OWASP', 'Burp Suite', 'Metasploit'],
                impact: '95% vuln reduction',
                icon: '⚔️',
              },
              {
                title: 'Incident Response Framework',
                description: 'Created IR playbooks and automated response workflows for ransomware, DDoS, and data breach scenarios. Reduced average containment time from 4 hours to 30 minutes.',
                tags: ['DFIR', 'Automation', 'SOAR', 'Playbooks'],
                impact: '88% faster containment',
                icon: '🚨',
              },
              {
                title: 'Security Awareness Platform',
                description: 'Built gamified security training platform that reduced phishing susceptibility by 80%. Includes simulated attacks and real-time feedback.',
                tags: ['Training', 'Phishing', 'Awareness', 'React'],
                impact: '80% risk reduction',
                icon: '🎓',
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{project.icon}</div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-mono">
                    {project.impact}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h4>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs rounded-lg font-mono"
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

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <p className="text-xl text-gray-400 mb-12">
            Looking for a cybersecurity professional to strengthen your security posture?
            Let&apos;s discuss how I can help protect your organization.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="mailto:security@tariqahmad.dev"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105"
            >
              📧 Email Me
            </a>
            <a
              href="https://linkedin.com/in/tariqahmad"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/10 transition-all duration-300"
            >
              💼 LinkedIn
            </a>
            <a
              href="https://github.com/tariqahmaad"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/10 transition-all duration-300"
            >
              🔗 GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            &copy; 2025 Tariq Ahmad. Securing the digital world, one system at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
