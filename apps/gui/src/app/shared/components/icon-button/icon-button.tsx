import React from 'react';

interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    variant?: 'icon-only' | 'full';
    className?: string;
    iconClassName?: string;
    labelClassName?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    label,
    onClick,
    variant = 'full',
    className = '',
    iconClassName = '',
    labelClassName = ''
}) => {
    if (variant === 'icon-only') {
        return (
            <button
                onClick={onClick}
                className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
            >
                <span className={`text-xl ${iconClassName}`}>{icon}</span>
                <span className={`text-xs mt-1 text-gray-600 ${labelClassName}`}>
                    {label}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        >
            <span className={`text-xl ${iconClassName}`}>{icon}</span>
            <span className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
                {label}
            </span>
        </button>
    );
};

export default IconButton;