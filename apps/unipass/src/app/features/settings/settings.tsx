import {
  LuLock,
  LuMail,
  LuCircleHelp,
  LuBell,
  LuPalette,
  LuShieldCheck,
  LuChevronRight,
  LuTrash2,
  LuSmartphone,
} from 'react-icons/lu'
import PageHeader from '../../shared/components/page-header'
import Card from '../../shared/components/card'

interface SettingRow {
  icon: React.ComponentType<{ size?: number }>
  title: string
  description: string
  value?: string
  danger?: boolean
}

const securityRows: SettingRow[] = [
  {
    icon: LuLock,
    title: 'Change password',
    description: 'Last changed 3 months ago',
  },
  {
    icon: LuMail,
    title: 'Recovery email',
    description: 'Backup email for account recovery',
    value: 's****@gmail.com',
  },
  {
    icon: LuCircleHelp,
    title: 'Recovery question',
    description: 'Answer to verify your identity',
    value: 'Configured',
  },
  {
    icon: LuSmartphone,
    title: 'Two-factor authentication',
    description: 'Extra layer of security',
    value: 'Not enabled',
  },
]

const appRows: SettingRow[] = [
  {
    icon: LuBell,
    title: 'Notifications',
    description: 'Choose what updates you receive',
    value: 'All',
  },
  {
    icon: LuPalette,
    title: 'Appearance',
    description: 'Theme and display preferences',
    value: 'Dark',
  },
  {
    icon: LuShieldCheck,
    title: 'Privacy',
    description: 'Control who can see your activity',
    value: 'Friends',
  },
]

const SettingsPage = () => {
  return (
    <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <PageHeader
          title="Settings"
          subtitle="Manage your account security and application preferences."
        />

        <div className="space-y-6">

          {/* Security */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Security
            </h2>
            <Card padding="sm">
              <ul className="divide-y divide-gray-800">
                {securityRows.map((row) => (
                  <SettingItem key={row.title} {...row} />
                ))}
              </ul>
            </Card>
          </section>

          {/* App preferences */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Application
            </h2>
            <Card padding="sm">
              <ul className="divide-y divide-gray-800">
                {appRows.map((row) => (
                  <SettingItem key={row.title} {...row} />
                ))}
              </ul>
            </Card>
          </section>

          {/* Danger zone */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Danger Zone
            </h2>
            <Card padding="sm" className="border-red-500/30">
              <SettingItem
                icon={LuTrash2}
                title="Delete account"
                description="Permanently remove your account and all data"
                danger
              />
            </Card>
          </section>

        </div>
      </div>
    </div>
  )
}

/* ---------- helper ---------- */

function SettingItem({ icon: Icon, title, description, value, danger }: SettingRow) {
  return (
    <li>
      <button className="w-full flex items-center gap-4 p-4 hover:bg-[#2D2D3A] transition-colors text-left rounded-lg">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            danger ? 'bg-red-500/15' : 'bg-[#2D2D3A]'
          }`}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
        </div>

        {value && !danger && (
          <span className="hidden sm:inline text-xs text-gray-400 shrink-0">
            {value}
          </span>
        )}

        <LuChevronRight size={16} className="text-gray-500 shrink-0" />
      </button>
    </li>
  )
}

export default SettingsPage