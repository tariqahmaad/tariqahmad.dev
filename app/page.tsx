export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tariq Ahmad
          </h1>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Full Stack Developer
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Crafting high-performance web applications with cutting-edge technologies. Specialized in TypeScript, React, and cloud architecture.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              View Projects
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">3+</div>
              <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-8 text-center">About Me</h3>
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              I&apos;m a passionate full-stack developer with 3+ years of experience building scalable web applications.
              I transform ideas into production-ready solutions, focusing on clean code, performance optimization, and exceptional user experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              My expertise spans modern frontend frameworks, backend development, and cloud infrastructure.
              I&apos;m committed to writing maintainable code and staying current with emerging technologies.
            </p>
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4 text-center">Tech Stack</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-blue-600">React</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Frontend</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-blue-600">TypeScript</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Language</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-blue-600">Next.js</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Framework</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-blue-600">Node.js</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Backend</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-purple-600">PostgreSQL</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Database</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-purple-600">MongoDB</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">NoSQL</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-purple-600">Docker</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">DevOps</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-bold text-purple-600">AWS</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center">Featured Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-6xl mb-2">🛒</div>
                  <div className="text-xl font-bold">E-Commerce Platform</div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-2">ShopNow Marketplace</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Full-stack e-commerce platform with real-time inventory management, secure payment integration (Stripe), and admin dashboard. Handles 10K+ daily transactions.
                </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">Next.js</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">PostgreSQL</span>
                  <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm">Stripe API</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ⭐ 95% customer satisfaction • 2023
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-6xl mb-2">📊</div>
                  <div className="text-xl font-bold">Analytics Dashboard</div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-2">DataViz Pro</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Real-time analytics dashboard processing 1M+ data points. Features interactive charts, custom reports, and AI-powered insights. Built for enterprise clients.
                </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm">D3.js</span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full text-sm">Redis</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ⚡ 50ms avg response time • 2024
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="text-6xl mb-2">💬</div>
                  <div className="text-xl font-bold">Social Platform</div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-2">ConnectHub</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Social networking platform with real-time messaging, content feeds, and video calls. Scaled to 50K+ active users with microservices architecture.
                </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm">Next.js</span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">WebSocket</span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full text-sm">AWS</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  🚀 50K+ active users • 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">Get In Touch</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Interested in working together? Let&apos;s connect!
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="mailto:hello@tariqahmad.dev"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Email Me
            </a>
            <a
              href="https://github.com/tariqahmaad"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Tariq Ahmad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
