import {
  LuShield,
  LuShieldCheck,
  LuShieldOff,
  LuChevronRight,
  LuExternalLink,
  LuClock,
} from 'react-icons/lu'
import PageHeader from '../../shared/components/page-header'
import Card from '../../shared/components/card'
import AppIcon from '../../shared/components/app-icon'

interface ManagedApp {
  name: string
  color: string
  status: 'active' | 'revoked' | 'pending'
  lastUsed: string
  scopes: string[]
}

const managedApps: ManagedApp[] = [
  {
    name: 'GitHub',
    color: '#24292e',
    status: 'active',
    lastUsed: '2 minutes ago',
    scopes: ['email', 'profile', 'repos'],
  },
  {
    name: 'Figma',
    color: '#a259ff',
    status: 'active',
    lastUsed: '1 hour ago',
    scopes: ['email', 'profile'],
  },
  {
    name: 'Slack',
    color: '#611f69',
    status: 'active',
    lastUsed: '3 hours ago',
    scopes: ['email', 'profile', 'channels'],
  },
  {
    name: 'Notion',
    color: '#000000',
    status: 'pending',
    lastUsed: 'Never',
    scopes: ['email', 'profile'],
  },
  {
    name: 'Dropbox',
    color: '#0061ff',
    status: 'revoked',
    lastUsed: '3 weeks ago',
    scopes: ['email'],
  },
]

const ssoApps = [
  { name: 'Linear', color: '#5e6ad2', users: '12 teammates' },
  { name: 'Vercel', color: '#000000', users: '8 teammates' },
  { name: 'Loom', color: '#625df5', users: '5 teammates' },
  { name: 'Airtable', color: '#f82b60', users: '3 teammates' },
]

const statusConfig = {
  active: { icon: LuShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  pending: { icon: LuClock, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  revoked: { icon: LuShieldOff, color: 'text-red-400', bg: 'bg-red-500/15' },
}

const DetailsPage = () => {
  return (
    <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <PageHeader
          title="Access Details"
          subtitle="Manage which apps can authenticate with your unipass account."
        />

        {/* Managed access */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <LuShield className="text-[#7C5CFC]" size={18} />
            <h2 className="text-white font-medium">Apps using your access</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managedApps.map((app) => {
              const { icon: StatusIcon, color, bg } = statusConfig[app.status]
              return (
                <Card key={app.name} className="hover:border-gray-700 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <AppIcon name={app.name} color={app.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium text-sm">{app.name}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${bg} ${color}`}>
                          <StatusIcon size={10} />
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Last used {app.lastUsed}
                      </p>
                    </div>
                  </div>

                  {/* Scopes */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {app.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2D2D3A] text-gray-400 border border-gray-700"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                    <button className="text-xs text-gray-400 hover:text-white transition-colors">
                      View permissions
                    </button>
                    <span className="text-gray-700">•</span>
                    <button
                      className={`text-xs transition-colors ${
                        app.status === 'revoked'
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-red-400 hover:text-red-300'
                      }`}
                    >
                      {app.status === 'revoked' ? 'Restore access' : 'Revoke access'}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* SSO apps */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <LuShieldCheck className="text-[#7C5CFC]" size={18} />
            <h2 className="text-white font-medium">Apps that support unipass SSO</h2>
          </div>

          <Card padding="sm">
            <ul className="divide-y divide-gray-800">
              {ssoApps.map((app) => (
                <li key={app.name}>
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-[#2D2D3A] transition-colors text-left">
                    <AppIcon name={app.name} color={app.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{app.name}</p>
                      <p className="text-xs text-gray-500 truncate">{app.users}</p>
                    </div>
                    <LuExternalLink size={14} className="text-gray-500 shrink-0" />
                    <LuChevronRight size={16} className="text-gray-500 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Don't see an app?{' '}
            <button className="text-[#7C5CFC] hover:underline">
              Request an integration
            </button>
          </p>
        </section>

      </div>
    </div>
  )
}

export default DetailsPage