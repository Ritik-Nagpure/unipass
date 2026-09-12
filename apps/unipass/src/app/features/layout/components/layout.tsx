import React from 'react'
import Header from './header'
import Footer from './footer'
import Bottombar from './bottombar'
import Sidebar from './sidebar'


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#1A1A24] overflow-hidden">

      <Header />

      <div className="flex-1 flex overflow-hidden min-h-0">

        <div className="hidden lg:flex h-full">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-0 gap-0">
          <div className="flex-1">
            {children}
          </div>

          <div className='py-2 my-2'>
            <Footer />
          </div>
        </main>
      </div>

      <Bottombar />
    </div>
  )
}

export default Layout