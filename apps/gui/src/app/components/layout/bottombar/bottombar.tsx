import React from 'react';

const BottomBar: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center h-16 px-4">
                {/* Bottom navigation items placeholder */}
                <div className="flex flex-col items-center">
                    <span className="text-lg">🏠</span>
                    <span className="text-xs mt-1">Home</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-lg">🔍</span>
                    <span className="text-xs mt-1">Search</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-lg">❤️</span>
                    <span className="text-xs mt-1">Favorites</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-lg">👤</span>
                    <span className="text-xs mt-1">Profile</span>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;