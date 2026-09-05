// src/pages/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Documentation: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Introduction', description: 'Learn what UniPass is and how it works' },
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', description: 'Install UniPass on your platform' },
        { title: 'Configuration', description: 'Configure UniPass for your needs' }
      ]
    },
    {
      category: 'Core Concepts',
      items: [
        { title: 'Authentication', description: 'Understanding authentication flows' },
        { title: 'Security Model', description: 'How UniPass protects your data' },
        { title: 'Encryption', description: 'Deep dive into our encryption standards' },
        { title: 'User Management', description: 'Managing users and permissions' }
      ]
    },
    {
      category: 'Integrations',
      items: [
        { title: 'SSO Integration', description: 'Integrate with your SSO provider' },
        { title: 'API Reference', description: 'Complete API documentation' },
        { title: 'Webhooks', description: 'Real-time event notifications' },
        { title: 'SDKs', description: 'Client SDKs for popular languages' }
      ]
    },
    {
      category: 'Guides',
      items: [
        { title: 'Security Best Practices', description: 'Keep your data secure' },
        { title: 'Performance Optimization', description: 'Optimize UniPass for speed' },
        { title: 'Troubleshooting', description: 'Common issues and solutions' },
        { title: 'Migration Guide', description: 'Migrate from other password managers' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Book icon - documentation">📚</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Documentation</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Comprehensive guides and API references</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              aria-label="Search documentation"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary" role="img" aria-label="Search icon">🔍</span>
          </div>
        </div>

        {/* Docs Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {docs.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-border">
                {section.category}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={`/docs/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary hover:border-primary border border-border transition-all duration-200"
                    >
                      <h4 className="font-medium text-text-primary">{item.title}</h4>
                      <p className="text-text-secondary text-sm mt-1">{item.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;