import React, { ReactNode } from 'react';

interface PageHeadingProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    className?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({
    title,
    subtitle,
    children,
    className = ''
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
                {children && (
                    <div className="mt-3 md:mt-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeading;