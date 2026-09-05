// src/pages/Contact.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../store/store';

const Contact: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">

      {/* Page Header */}
      <div className="pt-14 md:pt-16 bg-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-4">
            <span className="text-4xl" role="img" aria-label="Envelope icon - contact">✉️</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">Contact Us</h1>
              <p className="mt-3 text-text-secondary text-lg max-w-2xl">We'd love to hear from you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary">📍 Location</h3>
              <p className="text-text-secondary text-sm mt-1">Remote-first team worldwide</p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary">📧 Email</h3>
              <p className="text-text-secondary text-sm mt-1">support@unipass.com</p>
            </div>
            <div className="bg-bg-secondary p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary">🕐 Hours</h3>
              <p className="text-text-secondary text-sm mt-1">24/7 Global Support</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card-bg rounded-xl border border-border p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-label="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-label="Email address"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label="Subject"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  aria-label="Message"
                />
              </div>
              <button 
                type="submit"
                className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;