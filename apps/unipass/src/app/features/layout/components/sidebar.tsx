import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LuChevronsLeft,
  LuChevronsRight,
  LuHouse,
  LuSearch,
  LuInbox,
  LuBell,
  LuCalendar,
  LuFolder,
  LuZap,
  LuPlus,
  LuSettings,
  LuCircleHelp,
} from 'react-icons/lu'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  badge?: number
}

const mainNav: NavItem[] = [
  { to: '/home', label: 'Home', icon: LuHouse },
  { to: '/search', label: 'Search', icon: LuSearch, badge: 1 },
  { to: '/dashboard', label: 'Inbox', icon: LuInbox, badge: 2 },
  { to: '/activity', label: 'Activity', icon: LuBell },
  { to: '/schedule', label: 'Schedule', icon: LuCalendar, badge: 4 },
]

const sharedNav: NavItem[] = [
  { to: '/boosts', label: 'Boosts', icon: LuZap },
  { to: '/documents', label: 'Documents', icon: LuFolder },
]

const bottomNav: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: LuSettings },
  { to: '/help', label: 'Help', icon: LuCircleHelp },
]

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void
}

const ProjectsSection = (collapsed: boolean) => {
  return (
    <div className="px-3">
      {/* Projects — showing color dots when collapsed */}
      {!collapsed && (
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
          Projects
        </p>
      )}
      <ul className="space-y-1">
        {[
          { label: 'Personal', color: 'bg-emerald-400' },
          { label: 'Business', color: 'bg-indigo-400' },
          { label: 'Travel', color: 'bg-pink-400' },
        ].map((p) => (
          <li key={p.label}>
            <button
              className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#2D2D3A] transition-colors ${collapsed ? 'justify-center' : ''
                }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${p.color}`} />
              {!collapsed && (
                <span className="text-sm text-gray-300">{p.label}</span>
              )}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#2D2D3A] transition-colors ${collapsed ? 'justify-center' : ''
              }`}
          >
            <LuPlus size={16} className="text-gray-500 shrink-0" />
            {!collapsed && (
              <span className="text-sm text-gray-500">Add New Project</span>
            )}
          </button>
        </li>
      </ul>
    </div>
  )
}

const BottomSection = (collapsed: boolean, currentPath: string) => {
  return (
    <div className="border-t border-gray-800 py-3">
      <NavGroup items={bottomNav} collapsed={collapsed} currentPath={currentPath} />

      {/* User card */}
      <div className={`mt-2 px-3`}>
        <button
          className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#2D2D3A] transition-colors ${collapsed ? 'justify-center' : ''
            }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#7C5CFC] flex items-center justify-center text-white text-sm font-medium shrink-0">
            S
          </div>
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-white truncate">Sandra Marx</p>
              <p className="text-xs text-gray-500 truncate">sandra@gmail.com</p>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

const Sidebar = ({ onCollapseChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const { location } = useRouterState()
  const currentPath = location.pathname

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    onCollapseChange?.(next)
  }

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#232330] border-r border-gray-800 transition-[width] duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
        }`}
    >

      {/* TOP — brand + toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <span className="text-white font-semibold text-lg tracking-wide">
            unipass
          </span>
        )}
        <button
          onClick={toggle}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <LuChevronsRight size={18} /> : <LuChevronsLeft size={18} />}
        </button>
      </div>

      {/* MAIN NAV */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4">

        {/* Search (only when expanded) */}
        {!collapsed && (
          <div className="px-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2D2D3A] border border-gray-700">
              <LuSearch size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none min-w-0"
              />
              <span className="text-xs text-gray-500 border border-gray-700 rounded px-1.5">
                ⌘1
              </span>
            </div>
          </div>
        )}

        <NavGroup items={mainNav} collapsed={collapsed} currentPath={currentPath} />

        <div className="my-4 mx-3 border-t border-gray-800" />

        <NavGroup
          items={sharedNav}
          collapsed={collapsed}
          currentPath={currentPath}
          sectionLabel="Shared"
        />

        <div className="my-4 mx-3 border-t border-gray-800" />

        {/* <ProjectsSection collapsed={collapsed} /> */}

      </nav>
      {/* <BottomSection collapsed={collapsed} currentPath={currentPath} /> */}
    </aside>
  )
}

export default Sidebar

/* ---------- helper sub-component ---------- */

interface NavGroupProps {
  items: NavItem[]
  collapsed: boolean
  currentPath: string
  sectionLabel?: string
}

function NavGroup({ items, collapsed, currentPath, sectionLabel }: NavGroupProps) {
  return (
    <div className="px-3">
      {sectionLabel && !collapsed && (
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
          {sectionLabel}
        </p>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.to
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''
                  } ${isActive
                    ? 'bg-[#2D2D3A] text-white'
                    : 'text-gray-400 hover:bg-[#2D2D3A] hover:text-white'
                  }`}
              >
                <Icon size={18} />
                {!collapsed && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="text-xs text-gray-500">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}