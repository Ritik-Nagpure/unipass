import React, { useState } from 'react';

interface CollapsableItem {
    id: string | number;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

interface CollapsableProps {
    items: CollapsableItem[];
    direction?: 'vertical' | 'horizontal';
    defaultExpanded?: string | number;
    className?: string;
}

const Collapsable: React.FC<CollapsableProps> = ({
    items,
    direction = 'vertical',
    defaultExpanded,
    className = ''
}) => {
    const [expandedId, setExpandedId] = useState<string | number | null>(
        defaultExpanded || null
    );

    const toggleItem = (id: string | number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const containerClasses = direction === 'vertical'
        ? 'space-y-2'
        : 'flex flex-wrap gap-3';

    return (
        <div className={containerClasses}>
            {items.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                    <div
                        key={item.id}
                        className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${direction === 'horizontal' ? 'flex-1 min-w-[200px]' : ''
                            } ${className}`}
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors ${direction === 'horizontal' ? 'flex-row' : ''
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                {item.icon && <span>{item.icon}</span>}
                                <span className="font-medium text-gray-800">{item.title}</span>
                            </div>
                            <span className="text-gray-500">
                                {isExpanded ? '−' : '+'}
                            </span>
                        </button>

                        {isExpanded && (
                            <div className="p-4 bg-white">
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Collapsable;