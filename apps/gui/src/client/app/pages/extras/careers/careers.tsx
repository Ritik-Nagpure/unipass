// src/pages/Careers.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Careers: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const positions = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our core team to build the future of authentication and security.'
    },
    {
      title: 'Security Researcher',
      department: 'Security',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us maintain the highest security standards and discover new threat vectors.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design beautiful, intuitive experiences for our products.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and maintain our cloud infrastructure for maximum reliability.'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive growth and awareness for UniPass in the security space.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our customers succeed and get the most out of UniPass.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Careers icon">💼</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Join the Team</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Help us build the future of authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Careers Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-card-bg rounded-xl border border-border p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">We're Hiring!</h2>
          <p className="text-text-secondary">
            We're looking for passionate people to join our remote-first team.
          </p>
        </div>

        <div className="space-y-4">
          {positions.map((position, index) => (
            <div 
              key={index}
              className="bg-card-bg rounded-xl border border-border p-6 hover:shadow-card hover:border-primary transition-all duration-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{position.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-sm text-text-secondary">{position.department}</span>
                    <span className="text-sm text-text-tertiary">•</span>
                    <span className="text-sm text-text-secondary">{position.location}</span>
                    <span className="text-sm text-text-tertiary">•</span>
                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                      {position.type}
                    </span>
                  </div>
                  <p className="mt-2 text-text-secondary text-sm">{position.description}</p>
                </div>
                <a 
                  href={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;