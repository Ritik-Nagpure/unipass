import React, { ReactNode, useState } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Sidebar } from './sidebar';
import { BottomBar } from './bottombar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                {/* Desktop Sidebar - hidden on mobile/tablet */}
                <div className="hidden md:block">
                    <Sidebar
                        collapsed={sidebarCollapsed}
                        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </div>

                {/* Main Content */}
                <main className="flex-1 transition-all duration-300">
                    <div className="p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile/Tablet Bottom Bar - visible only on small screens */}
            <div className="md:hidden">
                <BottomBar />
            </div>

            <Footer />
        </div>
    );
};

export default Layout;