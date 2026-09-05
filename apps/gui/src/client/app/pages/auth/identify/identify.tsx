// src/pages/auth/Identify.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

interface IdentifyProps {
  onModeChange: (mode: 'login' | 'signup') => void;
}

const Identify: React.FC<IdentifyProps> = ({ onModeChange }) => {
  const features = [
    {
      icon: '🔐',
      title: 'Zero-Knowledge Security',
      description: 'Your data is encrypted locally. We never see your passwords.'
    },
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'One click to access all your applications. Lightning-fast.'
    },
    {
      icon: '🛡️',
      title: 'Enterprise-Grade Protection',
      description: 'SOC 2 compliant with advanced security features.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
        {/* Left Side - Brand Info */}
        <div className="order-2 lg:order-1">
          <div className="max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl" role="img" aria-label="UniPass logo">🔐</span>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                Uni<span className="text-primary">Pass</span>
              </h1>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
              Secure. Simple. <br />
              <span className="text-primary">Passwordless.</span>
            </h2>

            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              The all-in-one authentication solution for modern teams. 
              Zero-knowledge encryption, instant SSO, and enterprise-grade security.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-secondary transition-colors duration-200">
                  <span className="text-2xl flex-shrink-0" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-text-primary">{feature.title}</h4>
                    <p className="text-text-secondary text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                🔒 AES-256-GCM
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                🛡️ SOC 2 Compliant
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                🌍 Open Source
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Options */}
        <div className="order-1 lg:order-2">
          <div className="bg-card-bg rounded-2xl border border-border p-6 md:p-8 shadow-card max-w-md mx-auto lg:mx-0 w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary">Welcome Back</h3>
              <p className="text-text-secondary text-sm mt-1">Sign in to continue to your account</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onModeChange('login')}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy flex items-center justify-center gap-2"
              >
                <span role="img" aria-label="Login icon">🔑</span>
                Sign In
              </button>

              <button
                onClick={() => onModeChange('signup')}
                className="w-full py-3 bg-bg-secondary text-text-primary font-semibold rounded-lg border border-border hover:border-primary hover:bg-bg-tertiary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span role="img" aria-label="Signup icon">✨</span>
                Create Account
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-tertiary text-xs">
                By continuing, you agree to our 
                <Link to="/terms-of-service" className="text-primary hover:underline mx-1">Terms</Link>
                and 
                <Link to="/privacy-policy" className="text-primary hover:underline mx-1">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identify;