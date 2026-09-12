import { Link, useRouterState } from '@tanstack/react-router'
import { LuHouse, LuLayoutGrid, LuHeart, LuUser } from 'react-icons/lu'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { to: '/home',     label: 'Home',    icon: LuHouse },
  { to: '/dashboard', label: 'Vault',  icon: LuLayoutGrid },
  { to: '/home',     label: 'Add',     icon: LuUser, isCenter: true }, // placeholder center
  { to: '/home',     label: 'Wishlist', icon: LuHeart },
  { to: '/profile',  label: 'Account', icon: LuUser },
]

const MobileBottomBar = () => {
  const { location } = useRouterState()
  const currentPath = location.pathname

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#232330] border-t border-gray-800">

      <ul className="flex items-end justify-around px-2 pb-2 pt-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPath === item.to

          // The elevated center button
          if (item.isCenter) {
            return (
              <li key={index} className="relative -mt-8">
                <Link
                  to={item.to}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[#7C5CFC] shadow-lg shadow-[#7C5CFC]/30 text-white hover:bg-[#6B4EE6] transition-colors"
                >
                  <Icon size={22} />
                </Link>
              </li>
            )
          }

          return (
            <li key={index} className="flex-1">
              <Link
                to={item.to}
                className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                  isActive ? 'text-[#7C5CFC]' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileBottomBar