// src/pages/PrivacyPolicy.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const PrivacyPolicy: React.FC = () => {
    const theme = useAppSelector((state) => state.theme.mode);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const sections = [
        {
            title: 'Information We Collect',
            content: 'We collect information you provide directly, such as when you create an account, use our services, or contact us for support.'
        },
        {
            title: 'How We Use Your Information',
            content: 'We use your information to provide, maintain, and improve our services, communicate with you, and protect your account security.'
        },
        {
            title: 'Data Security',
            content: 'We implement industry-standard security measures to protect your data, including encryption, access controls, and regular security audits.'
        },
        {
            title: 'Data Retention',
            content: 'We retain your data only as long as necessary to provide our services and as required by applicable laws and regulations.'
        },
        {
            title: 'Your Rights',
            content: 'You have the right to access, modify, or delete your data at any time. Contact us for assistance with data requests.'
        },
        {
            title: 'Cookies and Tracking',
            content: 'We use cookies to improve your experience and analyze usage patterns. You can control cookie preferences in your browser settings.'
        }
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
 
            <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="flex items-start gap-4">
                        <span className="text-4xl" role="img" aria-label="Privacy icon">🛡️</span>
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Privacy Policy</h1>
                            <p className="mt-3 text-text-secondary text-lg max-w-2xl">Last updated: January 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="bg-card-bg rounded-xl border border-border p-6 md:p-8">
                    <p className="text-text-secondary leading-relaxed mb-8">
                        At UniPass, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
                    </p>

                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                                <h2 className="text-xl font-semibold text-text-primary mb-2">{section.title}</h2>
                                <p className="text-text-secondary leading-relaxed">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <p className="text-text-tertiary text-sm">
                            Questions about this policy? <a href="/contact" className="text-primary hover:text-primary-hover transition-colors">Contact us</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;