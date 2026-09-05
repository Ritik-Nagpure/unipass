// src/pages/TermsOfService.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const TermsOfService: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const terms = [
    {
      title: 'Acceptance of Terms',
      content: 'By using UniPass, you agree to these Terms of Service. If you do not agree, please do not use our services.'
    },
    {
      title: 'Account Responsibilities',
      content: 'You are responsible for maintaining the security of your account and for all activities that occur under your account.'
    },
    {
      title: 'Prohibited Uses',
      content: 'You may not use UniPass for any illegal activities, to distribute malware, or to violate others\' rights.'
    },
    {
      title: 'Intellectual Property',
      content: 'UniPass and its content are protected by copyright, trademark, and other intellectual property laws.'
    },
    {
      title: 'Limitation of Liability',
      content: 'UniPass is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of our services.'
    },
    {
      title: 'Termination',
      content: 'We reserve the right to suspend or terminate your access to UniPass if you violate these terms.'
    },
    {
      title: 'Changes to Terms',
      content: 'We may update these terms from time to time. Continued use of UniPass constitutes acceptance of the updated terms.'
    },
    {
      title: 'Governing Law',
      content: 'These terms are governed by the laws of the jurisdiction in which UniPass operates.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
  
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Terms icon">📜</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Terms of Service</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">Last updated: January 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-card-bg rounded-xl border border-border p-6 md:p-8">
          <p className="text-text-secondary leading-relaxed mb-8">
            Please read these terms carefully before using UniPass. By using our services, you agree to these terms.
          </p>

          <div className="space-y-6">
            {terms.map((term, index) => (
              <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                <h2 className="text-xl font-semibold text-text-primary mb-2">{term.title}</h2>
                <p className="text-text-secondary leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-text-tertiary text-sm">
              Questions about these terms? <a href="/contact" className="text-primary hover:text-primary-hover transition-colors">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;