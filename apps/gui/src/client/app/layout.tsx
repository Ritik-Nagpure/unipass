import React from 'react';
import Header from './pages/layout/header';
import Sidebar from './pages/layout/sidebar';
import Bottombar from './pages/layout/bottombar';
import Footer from './pages/layout/footer';
import Display from './pages/layout/display';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 pt-16">
        <aside className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="w-full max-w-7xl px-4 md:px-6 py-4 md:py-6">
            <Display></Display>
          </div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <Bottombar />
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;