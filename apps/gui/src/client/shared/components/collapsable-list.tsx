import React, { useState } from 'react';

interface CollapsibleListProps {
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleList: React.FC<CollapsibleListProps> = ({
  title,
  children,
  vertical = true,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`w-full ${className}`} role="region" aria-label={title}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="text-gray-900 dark:text-white font-medium">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="list"
        aria-label={`${title} content`}
      >
        <div className={`mt-2 px-2 ${vertical ? 'flex flex-col space-y-2' : 'flex flex-wrap gap-2'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};