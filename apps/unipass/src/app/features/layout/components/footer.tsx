import { Link } from '@tanstack/react-router'
import { LuArrowRight } from 'react-icons/lu'

const Footer = () => {
  return (
    <footer className="w-full bg-[#15151C] text-gray-400">

      {/* Top CTA band */}
      <div className="bg-[#2E2A47] px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
            Let's find harmony together.
          </h2>
          <Link
            to="/contact"
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3 border border-gray-500 hover:border-white text-white text-sm font-medium rounded-lg transition-colors"
          >
            Submit
            <LuArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Links grid */}
      <div className="px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-xl font-semibold tracking-wide mb-4">
              unipass
            </h3>
            <p className="text-sm leading-relaxed">
              Secure identity, password management, and multi-factor authentication
              in one seamless experience.
            </p>
          </div>

          {/* Column — Shop */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Vault</Link></li>
              <li><Link to="/home" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link to="/home" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Column — Quick Links */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Column — Stay in Touch */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Stay in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spotify</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
          <p>Copyright © {new Date().getFullYear()} unipass. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer