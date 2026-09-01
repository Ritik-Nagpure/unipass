import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                <div className="flex items-center space-x-4">
                    {/* Logo placeholder */}
                    <div className="text-xl font-bold text-gray-800">
                        Logo
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Header actions placeholder */}
                    <div className="hidden md:flex items-center space-x-3">
                        <span className="text-sm text-gray-600">User</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;