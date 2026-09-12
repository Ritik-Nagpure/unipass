import {
  LuShieldCheck,
  LuActivity,
  LuKeyRound,
  LuClock,
  LuTrendingUp,
  LuChevronRight,
} from 'react-icons/lu'
import PageHeader from '../../shared/components/page-header'
import Card from '../../shared/components/card'
import StatCard from '../../shared/components/stat-card'
import AppIcon from '../../shared/components/app-icon'

const DashboardPage = () => {
  return (
    <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <PageHeader
          title="Dashboard"
          subtitle="Your security activity at a glance."
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={LuShieldCheck} label="Protected Apps" value={12} change="+2 this week" trend="up" />
          <StatCard icon={LuActivity} label="Logins Today" value={8} change="+3" trend="up" accent="#10b981" />
          <StatCard icon={LuKeyRound} label="Passwords" value={47} change="+5" trend="up" accent="#f59e0b" />
          <StatCard icon={LuClock} label="Avg Session" value="2h 14m" change="-12%" trend="down" accent="#ef4444" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — chart + activity */}
          <div className="lg:col-span-2 space-y-6">

            {/* Chart placeholder */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Login Activity</h3>
                <span className="text-xs text-gray-500">Last 7 days</span>
              </div>

              {/* Fake bars — replace with a real chart later */}
              <div className="flex items-end justify-between gap-2 h-40">
                {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-linear-to-t from-[#7C5CFC]/40 to-[#7C5CFC]"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent activity */}
            <Card padding="sm">
              <div className="flex items-center justify-between p-4 pb-3">
                <h3 className="text-white font-medium">Recent Activity</h3>
                <button className="text-xs text-[#7C5CFC] hover:underline">
                  View all
                </button>
              </div>
              <ul className="divide-y divide-gray-800">
                {[
                  { app: 'GitHub', action: 'Signed in with SSO', time: '2 min ago', color: '#24292e' },
                  { app: 'Figma',  action: 'Password updated',     time: '1 hour ago', color: '#a259ff' },
                  { app: 'Slack',  action: 'New device approved',  time: '3 hours ago', color: '#611f69' },
                  { app: 'Notion', action: 'Signed in with SSO',   time: 'Yesterday',  color: '#000000' },
                ].map((item) => (
                  <li key={item.app} className="flex items-center gap-3 p-4 hover:bg-[#2D2D3A] transition-colors">
                    <AppIcon name={item.app} color={item.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.app}</p>
                      <p className="text-xs text-gray-500 truncate">{item.action}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{item.time}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right — apps + quick actions */}
          <aside className="space-y-6">

            <Card>
              <h3 className="text-white font-medium mb-4">Your Apps</h3>
              <ul className="space-y-3">
                {[
                  { name: 'GitHub', color: '#24292e', status: 'Connected' },
                  { name: 'Figma', color: '#a259ff', status: 'Connected' },
                  { name: 'Slack', color: '#611f69', status: 'Connected' },
                  { name: 'Notion', color: '#000000', status: 'Pending' },
                ].map((app) => (
                  <li key={app.name} className="flex items-center gap-3">
                    <AppIcon name={app.name} color={app.color} size="sm" />
                    <span className="flex-1 text-sm text-white truncate">{app.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        app.status === 'Connected'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-white font-medium mb-4">Quick Actions</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Add new app', icon: LuShieldCheck },
                  { label: 'Generate password', icon: LuKeyRound },
                  { label: 'Review activity', icon: LuTrendingUp },
                ].map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] transition-colors">
                      <Icon size={16} className="text-[#7C5CFC]" />
                      <span className="text-sm text-white flex-1 text-left">{label}</span>
                      <LuChevronRight size={14} className="text-gray-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

          </aside>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage