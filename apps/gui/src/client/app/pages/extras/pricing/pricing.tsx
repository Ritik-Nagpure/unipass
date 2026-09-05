// src/pages/Pricing.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

const Pricing: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const plans: Plan[] = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for individuals and small teams',
      features: [
        'Up to 10 users',
        '100 password entries',
        'Basic SSO',
        'Email support',
        '2FA support'
      ],
      buttonText: 'Get Started'
    },
    {
      name: 'Pro',
      price: billing === 'monthly' ? 29 : 290,
      description: 'For growing teams with advanced needs',
      features: [
        'Up to 50 users',
        'Unlimited password entries',
        'Advanced SSO',
        'Priority support',
        '2FA + Biometric',
        'Security dashboard',
        'Team management',
        'Audit logs'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: billing === 'monthly' ? 99 : 990,
      description: 'For large organizations requiring custom solutions',
      features: [
        'Unlimited users',
        'Unlimited password entries',
        'Custom SSO integration',
        '24/7 dedicated support',
        'Advanced security features',
        'Custom branding',
        'SLA guarantee',
        'On-premise deployment'
      ],
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
 
      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Money bag icon - pricing page">💰</span>
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                💎 Best Value
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
                Simple, Transparent Pricing
              </h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">
                Start for free. Scale as you grow. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-primary/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Switch to ${billing === 'monthly' ? 'yearly' : 'monthly'} billing`}
          >
            <span 
              className={`absolute top-1 left-1 w-5 h-5 bg-primary rounded-full transition-transform duration-200 ${
                billing === 'yearly' ? 'translate-x-7' : ''
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Yearly
            <span className="ml-2 text-xs text-success font-semibold">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-card-bg rounded-xl border p-6 md:p-8 transition-all duration-300 relative ${
                plan.popular 
                  ? 'border-primary shadow-card' 
                  : 'border-border hover:border-primary hover:shadow-card'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-text-primary">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="ml-2 text-text-tertiary">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                )}
              </div>
              <p className="mt-2 text-text-secondary text-sm">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-text-secondary text-sm">
                    <span className="text-primary mt-0.5" role="img" aria-label="Checkmark">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a 
                href={plan.price === 0 ? '/signup' : plan.name === 'Enterprise' ? '/contact' : '/signup'}
                className={`mt-8 w-full block text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-heavy'
                    : 'bg-bg-secondary text-text-primary border border-border hover:border-primary hover:bg-bg-tertiary'
                }`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-2">Can I change plans later?</h3>
              <p className="text-text-secondary text-sm">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-2">Is there a free trial?</h3>
              <p className="text-text-secondary text-sm">Yes, all paid plans come with a 14-day free trial.</p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-2">What payment methods do you accept?</h3>
              <p className="text-text-secondary text-sm">We accept all major credit cards and PayPal.</p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-2">Can I cancel anytime?</h3>
              <p className="text-text-secondary text-sm">Yes, you can cancel your subscription at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;