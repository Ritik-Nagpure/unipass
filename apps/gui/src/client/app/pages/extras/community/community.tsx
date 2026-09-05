// src/pages/Community.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Community: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const communityStats = [
    { number: '10K+', label: 'Community Members' },
    { number: '5K+', label: 'Active Contributors' },
    { number: '1K+', label: 'Stars on GitHub' },
    { number: '500+', label: 'Discord Members' }
  ];

  const resources = [
    {
      icon: '💬',
      title: 'Discord Community',
      description: 'Join our Discord server for real-time discussions and support.',
      link: 'https://discord.gg/unipass'
    },
    {
      icon: '📖',
      title: 'GitHub Repository',
      description: 'Contribute to our open-source codebase and documentation.',
      link: 'https://github.com/unipass'
    },
    {
      icon: '📝',
      title: 'Community Blog',
      description: 'Read and contribute articles from the community.',
      link: '/blog'
    },
    {
      icon: '🤝',
      title: 'Contributor Guide',
      description: 'Learn how to contribute to UniPass and become a contributor.',
      link: '/docs/contributing'
    },
    {
      icon: '📅',
      title: 'Community Events',
      description: 'Join our virtual meetups and hackathons.',
      link: '/events'
    },
    {
      icon: '📊',
      title: 'Community Dashboard',
      description: 'Track community growth and activity.',
      link: '/community/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Community icon">🌍</span>
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                🤝 Join Us
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Community</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Connect with developers and users worldwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {communityStats.map((stat, index) => (
            <div key={index} className="bg-bg-secondary p-4 rounded-xl border border-border text-center">
              <div className="text-2xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="bg-card-bg p-6 rounded-xl border border-border hover:border-primary hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
              target={resource.link.startsWith('http') ? '_blank' : undefined}
              rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300" role="img" aria-label={`${resource.title} icon`}>
                {resource.icon}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{resource.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{resource.description}</p>
              <span className="mt-4 inline-block text-primary font-medium group-hover:underline">
                Learn More →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;