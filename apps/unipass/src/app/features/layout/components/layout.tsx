import React from 'react'
import Header from './header'
import Footer from './footer'
import Bottombar from './bottombar'
import Sidebar from './sidebar'


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">{children}</main>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden">
        <Bottombar />
      </div>
    </div>
  )
}

export default Layout