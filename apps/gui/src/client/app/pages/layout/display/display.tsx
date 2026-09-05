import React from 'react'
import Header from '../header'
import Sidebar from '../sidebar'
import Bottombar from '../bottombar'
import { Outlet } from '@tanstack/react-router';

const display = () => {
  return (
    <div>
      {/* Header - Never re-renders on navigation */}
      <Header />

      <div className="flex flex-1 pt-16">
        {/* Sidebar - Never re-renders on navigation */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main content - ONLY this updates on navigation */}
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="w-full max-w-7xl px-4 md:px-6 py-4 md:py-6">
            <Outlet /> {/* ← This is where page content renders */}
          </div>
        </main>
      </div>

      {/* Bottombar - Never re-renders on navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <Bottombar />
      </div>
    </div>
  )
}

export default display