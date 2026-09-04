import React from 'react';
import { Link } from '@tanstack/react-router';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import logo from '../../../../../assets/Logo.png';

// Define valid routes
type ValidRoute = '/' | '/dashboard' | '/profile' | '/settings' | '/about';

// Define link types
interface FooterLink {
  label: string;
  to: ValidRoute;
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Footer sections data
const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/' },
      { label: 'Pricing', to: '/' },
      { label: 'Documentation', to: '/' },
      { label: 'Changelog', to: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Community', to: '/' },
      { label: 'Help Center', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  },
];

// Social links with React Icons
const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: <FaGithub className="w-5 h-5" aria-hidden="true" />,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: <FaTwitter className="w-5 h-5" aria-hidden="true" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <FaLinkedin className="w-5 h-5" aria-hidden="true" />,
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-bg-secondary border-t border-border-light"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4"
              aria-label="Homepage"
            >
              <img
                src={logo}
                alt="Unipass Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-text-primary">Unipass</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Building amazing experiences for our users. Join us in creating something extraordinary.
            </p>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-text-secondary hover:text-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-light py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-tertiary">
            &copy; {currentYear} Unipass. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-text-tertiary hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-sm text-text-tertiary hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-sm text-text-tertiary hover:text-primary transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;