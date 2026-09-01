import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-3 px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <div>
                    © {new Date().getFullYear()} Company Name. All rights reserved.
                </div>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>Support</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;