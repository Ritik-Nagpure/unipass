// About.jsx
import React from 'react';
import logo from '../../../../assets/Logo.png';

const About = () => {
  // Handle image error with proper typing
  const handleImageError = (e : React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target;
    if (target instanceof HTMLImageElement) {
      target.src = 'https://via.placeholder.com/120x120/3b82f6/ffffff?text=UNIPASS';
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-bg-primary text-text-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20 mb-12 bg-bg-secondary rounded-2xl border border-border-light">
          <div className="mb-6">
            <img 
              src={logo} 
              alt="Unipass Logo - Password Management Application" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-card mx-auto transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
            About Unipass
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-4 font-light">
            Your All-in-One Password Management Solution
          </p>
          
          <div className="w-20 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full mb-4"></div>
          
          <p className="max-w-3xl mx-auto text-lg text-text-secondary leading-relaxed">
            Unipass is a secure, intuitive, and feature-rich password manager 
            designed to simplify your digital life while keeping your sensitive 
            information safe and accessible across all your devices.
          </p>
        </section>

        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Overview
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <p className="mb-4 leading-relaxed text-text-secondary">
                Unipass was built with a singular mission: to eliminate the 
                frustration of forgotten passwords while providing enterprise-grade 
                security for everyday users. We believe that strong security 
                shouldn't come at the cost of convenience.
              </p>
              <p className="leading-relaxed text-text-secondary">
                Since our launch, Unipass has helped thousands of users manage 
                their digital identities with confidence. Our commitment to 
                open-source principles, transparent security practices, and 
                continuous innovation sets us apart in the password management space.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-bg-secondary p-6 rounded-2xl border border-border-light">
              <div className="text-center p-2">
                <span className="block text-3xl md:text-4xl font-bold text-primary">10K+</span>
                <span className="block text-sm text-text-tertiary mt-1">Active Users</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-3xl md:text-4xl font-bold text-primary">50K+</span>
                <span className="block text-sm text-text-tertiary mt-1">Passwords Managed</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-3xl md:text-4xl font-bold text-primary">99.9%</span>
                <span className="block text-sm text-text-tertiary mt-1">Uptime</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-3xl md:text-4xl font-bold text-primary">4.8⭐</span>
                <span className="block text-sm text-text-tertiary mt-1">User Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Key Features
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Security icon - padlock">🔐</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Zero-Knowledge Encryption</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your data is encrypted locally before it ever reaches our servers. 
                We never have access to your master password or decrypted data.
              </p>
            </div>
            
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Globe icon - cross-platform">🌐</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Cross-Platform Sync</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Access your passwords on any device. Unipass automatically syncs 
                your vault across all platforms in real-time.
              </p>
            </div>
            
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Key icon - password generator">🔑</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Secure Password Generator</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Create strong, unique passwords for every account with our 
                built-in generator that follows best-practice security guidelines.
              </p>
            </div>
            
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Shield icon - two-factor authentication">🛡️</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Add an extra layer of security with TOTP support for your most 
                critical accounts.
              </p>
            </div>
            
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Mobile phone icon - mobile-first design">📱</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Mobile-First Design</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A responsive interface that works flawlessly on smartphones, 
                tablets, and desktops with an intuitive user experience.
              </p>
            </div>
            
            <div className="bg-card-bg p-6 rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy hover:border-primary">
              <span className="text-4xl block mb-4" role="img" aria-label="Lightning icon - autofill integration">⚡</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Autofill Integration</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Seamless browser and mobile app integration for one-click 
                autofill of login credentials across all your favorite websites.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Security & Privacy
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Our Security Principles</h3>
              <ul className="space-y-3">
                <li className="p-4 bg-bg-secondary rounded-xl border-l-4 border-primary text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Zero-Knowledge Architecture:</strong> Your master password 
                  never leaves your device. All encryption and decryption happens locally.
                </li>
                <li className="p-4 bg-bg-secondary rounded-xl border-l-4 border-primary text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">End-to-End Encryption:</strong> Every piece of data stored 
                  in your vault is encrypted with AES-256-GCM, the gold standard in 
                  symmetric encryption.
                </li>
                <li className="p-4 bg-bg-secondary rounded-xl border-l-4 border-primary text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Argon2id Hashing:</strong> Your master password is hashed 
                  using Argon2id, the most secure hashing algorithm available, to 
                  protect against brute-force attacks.
                </li>
                <li className="p-4 bg-bg-secondary rounded-xl border-l-4 border-primary text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Open Source Code:</strong> Our entire codebase is publicly 
                  available for security researchers and users to audit, ensuring 
                  complete transparency.
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Security Badges</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'AES-256-GCM',
                  'Argon2id',
                  'Zero-Knowledge',
                  'Open Source',
                  'GDPR Compliant',
                  '2FA Support'
                ].map((badge) => (
                  <div 
                    key={badge}
                    className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border-light rounded-full text-sm text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-tertiary"
                  >
                    <span className="text-success font-bold">✓</span>
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            How Unipass Works
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="space-y-6">
            {[
              {
                number: '1',
                title: 'Create Your Account',
                description: 'Sign up with your email address and create a strong master password. This is the only password you\'ll ever need to remember.'
              },
              {
                number: '2',
                title: 'Build Your Vault',
                description: 'Add your passwords, secure notes, credit cards, and other sensitive information. Use our password generator to create strong, unique passwords for each account.'
              },
              {
                number: '3',
                title: 'Access Anywhere',
                description: 'Your encrypted vault syncs automatically across all your devices. Access your passwords from the web app, mobile app, or browser extension.'
              },
              {
                number: '4',
                title: 'Autofill & Automate',
                description: 'Use Unipass to autofill login forms, generate TOTP codes, and automatically update passwords for supported services.'
              }
            ].map((step) => (
              <div 
                key={step.number}
                className="flex flex-col sm:flex-row gap-4 p-6 bg-bg-secondary rounded-2xl border border-border-light transition-all duration-300 hover:translate-x-2 hover:border-primary hover:shadow-card"
              >
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full text-xl font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Why Choose Unipass
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: '💰',
                label: 'Money bag icon - completely free',
                title: 'Completely Free',
                description: 'No hidden costs, no premium plans. Unipass is 100% free to use forever.'
              },
              {
                icon: '🔓',
                label: 'Open lock icon - open source',
                title: 'Open Source',
                description: 'Review our code, contribute, or fork it. Complete transparency and community-driven development.'
              },
              {
                icon: '🚀',
                label: 'Rocket icon - modern and fast',
                title: 'Modern & Fast',
                description: 'Built with modern web technologies for lightning-fast performance and a smooth user experience.'
              },
              {
                icon: '🌍',
                label: 'Globe icon - privacy first',
                title: 'Privacy First',
                description: 'We collect minimal data and never sell your information. Your privacy is our top priority.'
              }
            ].map((benefit) => (
              <div 
                key={benefit.title}
                className="flex gap-4 p-6 bg-bg-secondary rounded-2xl border border-border-light transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
              >
                <span className="text-3xl shrink-0" role="img" aria-label={benefit.label}>
                  {benefit.icon}
                </span>
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-1">{benefit.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Technology Stack
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                category: 'Frontend',
                technologies: ['React 18', 'Tailwind CSS', 'React Router', 'Web Crypto API']
              },
              {
                category: 'Backend',
                technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis']
              },
              {
                category: 'Security',
                technologies: ['AES-256-GCM', 'Argon2id', 'JWT', 'HTTPS/TLS 1.3']
              },
              {
                category: 'Infrastructure',
                technologies: ['AWS', 'Docker', 'GitHub Actions', 'Cloudflare']
              }
            ].map((tech) => (
              <div 
                key={tech.category}
                className="p-6 bg-bg-secondary rounded-2xl border border-border-light transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
              >
                <h3 className="text-primary font-semibold mb-4 pb-2 border-b border-border-light">
                  {tech.category}
                </h3>
                <ul className="space-y-1">
                  {tech.technologies.map((item) => (
                    <li key={item} className="text-text-secondary text-sm">
                      <span className="text-primary">▸ </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Our Team
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <p className="text-text-secondary mb-8 leading-relaxed">
            Unipass is built by a passionate team of security enthusiasts and 
            software engineers dedicated to making the internet safer for everyone.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                avatar: '👨‍💻',
                label: 'Male developer avatar',
                name: 'Alex Rivera',
                role: 'Lead Developer & Founder',
                bio: 'Former security engineer with 10+ years of experience in cryptography and full-stack development.'
              },
              {
                avatar: '👩‍💻',
                label: 'Female developer avatar',
                name: 'Sarah Chen',
                role: 'Security Architect',
                bio: 'Security researcher and cryptography expert with a PhD in Computer Science from MIT.'
              },
              {
                avatar: '👨‍🎨',
                label: 'Male designer avatar',
                name: 'Marcus Johnson',
                role: 'UI/UX Designer',
                bio: 'Award-winning designer specializing in security-first user experiences and accessible design.'
              }
            ].map((member) => (
              <div 
                key={member.name}
                className="text-center p-6 bg-card-bg rounded-2xl border border-border-light shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-heavy hover:border-primary"
              >
                <span className="text-6xl block mb-4" role="img" aria-label={member.label}>
                  {member.avatar}
                </span>
                <h4 className="text-lg font-semibold text-text-primary mb-1">{member.name}</h4>
                <p className="text-sm text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-1 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-primary to-primary-light rounded-full mb-6 transition-all duration-300 hover:w-32"></div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: 'Is Unipass really free?',
                answer: 'Yes! Unipass is completely free with no hidden costs. We believe that security should be accessible to everyone.'
              },
              {
                question: 'How is my data protected?',
                answer: 'Your data is encrypted with AES-256-GCM locally before being sent to our servers. We use a zero-knowledge architecture, meaning we never have access to your decrypted data.'
              },
              {
                question: 'What if I forget my master password?',
                answer: 'Unfortunately, due to our zero-knowledge encryption, we cannot recover your master password. Please store it securely or use our recovery phrase feature during setup.'
              },
              {
                question: 'Is Unipass open source?',
                answer: 'Yes! Our entire codebase is open source and available on GitHub for anyone to review, audit, or contribute to.'
              }
            ].map((faq) => (
              <div 
                key={faq.question}
                className="p-6 bg-bg-secondary rounded-2xl border border-border-light transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
              >
                <h4 className="text-base font-semibold text-text-primary mb-2">{faq.question}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 md:py-16 px-4 md:px-8 mb-12 bg-linear-to-br from-bg-secondary to-bg-primary rounded-2xl border-2 border-primary">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join thousands of users who trust Unipass to protect their passwords.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-heavy">
              Get Started Free
            </button>
            <button className="px-8 py-3 bg-bg-secondary text-text-primary font-semibold rounded-xl border border-border hover:bg-bg-tertiary transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              View on GitHub
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;