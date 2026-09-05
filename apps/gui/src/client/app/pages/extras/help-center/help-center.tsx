// src/pages/HelpCenter.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const HelpCenter: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const helpCategories = [
    {
      icon: '🚀',
      title: 'Getting Started',
      description: 'Learn the basics of UniPass',
      articles: 12
    },
    {
      icon: '🔐',
      title: 'Security',
      description: 'Security features and best practices',
      articles: 8
    },
    {
      icon: '👥',
      title: 'Team Management',
      description: 'Managing teams and permissions',
      articles: 6
    },
    {
      icon: '🔧',
      title: 'Account Settings',
      description: 'Configure your account preferences',
      articles: 5
    },
    {
      icon: '🔄',
      title: 'Integrations',
      description: 'Connect UniPass with other tools',
      articles: 4
    },
    {
      icon: '🐛',
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      articles: 10
    }
  ];

  const popularArticles = [
    { title: 'How to set up your first vault', views: '5K+ views' },
    { title: 'Security best practices guide', views: '3.5K+ views' },
    { title: 'Team collaboration features', views: '2.8K+ views' },
    { title: 'SSO integration setup', views: '2.1K+ views' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
 
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Help center icon">❓</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Help Center</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Find answers to your questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              aria-label="Search help articles"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary" role="img" aria-label="Search icon">🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <a
              key={index}
              href={`/help/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-card-bg p-6 rounded-xl border border-border hover:border-primary hover:shadow-card transition-all duration-300"
            >
              <span className="text-3xl mb-4 block" role="img" aria-label={`${category.title} icon`}>
                {category.icon}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-1">{category.title}</h3>
              <p className="text-text-secondary text-sm">{category.description}</p>
              <span className="mt-3 inline-block text-xs text-text-tertiary">{category.articles} articles</span>
            </a>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">📈 Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <a
                key={index}
                href={`/help/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-3 bg-card-bg rounded-lg border border-border hover:border-primary transition-all duration-200 hover:shadow-card"
              >
                <span className="text-text-primary font-medium">{article.title}</span>
                <span className="text-text-tertiary text-sm">{article.views}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;