import React from 'react';
import IconButton from '../icon-button';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    return (
        <aside
            className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Toggle button */}
                <div className="flex justify-end p-3 border-b border-gray-100">
                    <button
                        onClick={onToggle}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Navigation items placeholder */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {/* Sidebar items will be populated from shared library */}
                        <li className="text-sm text-gray-500 px-3 py-2">Menu Item 1</li>
                        <li className="text-sm text-gray-500 px-3 py-2">Menu Item 2</li>
                        <li className="text-sm text-gray-500 px-3 py-2">Menu Item 3</li>
                    </ul>
                </nav>

                {/* Bottom section */}
                <div className="border-t border-gray-100 p-3">
                    <div className="text-xs text-gray-400">v1.0.0</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;