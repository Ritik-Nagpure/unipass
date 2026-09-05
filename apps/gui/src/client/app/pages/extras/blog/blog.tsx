// src/pages/Blog.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Blog: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const blogPosts = [
    {
      title: 'The Future of Passwordless Authentication',
      excerpt: 'How passwordless technology is changing the security landscape and what it means for your business.',
      date: 'January 10, 2026',
      readTime: '5 min read',
      category: 'Security',
      slug: 'future-of-passwordless-authentication'
    },
    {
      title: 'Zero-Knowledge Architecture Explained',
      excerpt: 'Learn how zero-knowledge encryption works and why it\'s the gold standard for data privacy.',
      date: 'December 28, 2025',
      readTime: '7 min read',
      category: 'Technology',
      slug: 'zero-knowledge-architecture-explained'
    },
    {
      title: '10 Security Best Practices for 2026',
      excerpt: 'Essential security practices every organization should implement to protect their data.',
      date: 'December 15, 2025',
      readTime: '6 min read',
      category: 'Best Practices',
      slug: 'security-best-practices-2026'
    },
    {
      title: 'Building a Privacy-First Culture',
      excerpt: 'How to create a privacy-first culture in your organization and why it matters.',
      date: 'December 1, 2025',
      readTime: '4 min read',
      category: 'Culture',
      slug: 'building-privacy-first-culture'
    },
    {
      title: 'The Impact of AI on Password Security',
      excerpt: 'Exploring how artificial intelligence is transforming password security and authentication.',
      date: 'November 20, 2025',
      readTime: '8 min read',
      category: 'Technology',
      slug: 'ai-impact-on-password-security'
    },
    {
      title: 'UniPass Product Roadmap 2026',
      excerpt: 'A look at what\'s coming next for UniPass and our vision for the future of security.',
      date: 'November 10, 2025',
      readTime: '5 min read',
      category: 'Product',
      slug: 'unipass-product-roadmap-2026'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Blog icon">📝</span>
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                📰 Latest Posts
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Blog</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Thoughts, stories, and insights from our team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={index}
              className="bg-card-bg rounded-xl border border-border p-6 hover:shadow-card hover:border-primary transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm text-text-tertiary mb-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 hover:text-primary transition-colors">
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">{post.excerpt}</p>
              <a href={`/blog/${post.slug}`} className="mt-4 inline-block text-primary font-medium hover:text-primary-hover transition-colors">
                Read More →
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;