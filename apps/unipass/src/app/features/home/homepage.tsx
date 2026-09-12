import { Link } from '@tanstack/react-router'
import {
    LuShieldCheck,
    LuKeyRound,
    LuActivity,
    LuCircleCheck,
    LuCircleAlert,
    LuChevronRight,
    LuPlus,
    LuSearch,
    LuSmartphone,
    LuMail,
    LuLock,
    LuSparkles,
} from 'react-icons/lu'
import Card from '../../shared/components/card'
import StatCard from '../../shared/components/stat-card'
import AppIcon from '../../shared/components/app-icon'
import { useAppSelector } from '../../shared/hooks/store/store'

const HomePage = () => {
    const user = { name: 'John', email: 'john.doe@abc.xy' }  // useAppSelector((s) => s.auth.user)
    const firstName = user?.name?.split(' ')[0] ?? 'Sandra'

    return (
        <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">

                {/* ---------- HERO ---------- */}
                <section className="bg-gradient-to-br from-[#7C5CFC]/20 via-[#232330] to-[#232330] border border-[#7C5CFC]/20 rounded-2xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 mb-3">
                                <LuSparkles className="text-[#7C5CFC]" size={12} />
                                <span className="text-xs text-[#7C5CFC] font-medium">
                                    You're all set
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-2">
                                Welcome back, {firstName}.
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
                                Your accounts are secure. Here's a quick look at what's happening
                                across your unipass network.
                            </p>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white text-sm font-medium rounded-lg transition-colors">
                                <LuPlus size={16} />
                                Add app
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D2D3A] hover:bg-[#3A3A4A] text-white text-sm font-medium rounded-lg transition-colors">
                                <LuSearch size={16} />
                                Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* ---------- STAT CARDS ---------- */}
                <section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={LuShieldCheck}
                            label="Protected Apps"
                            value={12}
                            change="+2"
                            trend="up"
                        />
                        <StatCard
                            icon={LuKeyRound}
                            label="Saved Passwords"
                            value={47}
                            change="+5"
                            trend="up"
                            accent="#10b981"
                        />
                        <StatCard
                            icon={LuActivity}
                            label="Logins Today"
                            value={8}
                            change="+3"
                            trend="up"
                            accent="#f59e0b"
                        />
                        <StatCard
                            icon={LuLock}
                            label="Security Score"
                            value="87%"
                            change="+4%"
                            trend="up"
                            accent="#ef4444"
                        />
                    </div>
                </section>

                {/* ---------- MAIN 2-COLUMN ---------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Recently used apps */}
                        <Card padding="sm">
                            <div className="flex items-center justify-between p-4 pb-3">
                                <h2 className="text-white font-medium">Recently used</h2>
                                <Link
                                    to="/details"
                                    className="text-xs text-[#7C5CFC] hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            <ul className="divide-y divide-gray-800">
                                {[
                                    { name: 'GitHub', color: '#24292e', time: '2 min ago', action: 'SSO login' },
                                    { name: 'Figma', color: '#a259ff', time: '1 hour ago', action: 'Password updated' },
                                    { name: 'Slack', color: '#611f69', time: '3 hours ago', action: 'New device' },
                                    { name: 'Notion', color: '#000000', time: 'Yesterday', action: 'SSO login' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <button className="w-full flex items-center gap-3 p-4 hover:bg-[#2D2D3A] transition-colors text-left">
                                            <AppIcon name={item.name} color={item.color} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{item.action}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 shrink-0">{item.time}</span>
                                            <LuChevronRight size={16} className="text-gray-500 shrink-0" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Security checklist */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-white font-medium">Security checklist</h2>
                                <span className="text-xs text-gray-500">2 of 4 done</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-[#2D2D3A] rounded-full overflow-hidden mb-5">
                                <div className="h-full bg-[#7C5CFC] rounded-full" style={{ width: '50%' }} />
                            </div>

                            <ul className="space-y-3">
                                {[
                                    { icon: LuCircleCheck, label: 'Set a strong master password', done: true },
                                    { icon: LuCircleCheck, label: 'Add a recovery email', done: true },
                                    { icon: LuCircleAlert, label: 'Enable two-factor authentication', done: false, link: '/mfa' },
                                    { icon: LuCircleAlert, label: 'Review connected apps', done: false, link: '/details' },
                                ].map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <li key={item.label} className="flex items-center gap-3">
                                            <Icon
                                                size={18}
                                                className={item.done ? 'text-emerald-400 shrink-0' : 'text-amber-400 shrink-0'}
                                            />
                                            <span className={`text-sm flex-1 ${item.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                                {item.label}
                                            </span>
                                            {!item.done && item.link && (
                                                <Link
                                                    to={item.link}
                                                    className="text-xs text-[#7C5CFC] hover:underline shrink-0"
                                                >
                                                    Fix
                                                </Link>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </Card>
                    </div>

                    {/* Right column */}
                    <aside className="space-y-6">

                        {/* Account status */}
                        <Card>
                            <h2 className="text-white font-medium mb-4">Account status</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <LuSmartphone size={14} /> 2FA
                                    </span>
                                    <span className="text-amber-400 text-xs">Off</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <LuMail size={14} /> Recovery email
                                    </span>
                                    <span className="text-emerald-400 text-xs">Set</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <LuShieldCheck size={14} /> Plan
                                    </span>
                                    <span className="text-[#7C5CFC] text-xs">Pro</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <LuActivity size={14} /> Last backup
                                    </span>
                                    <span className="text-gray-300 text-xs">2h ago</span>
                                </li>
                            </ul>

                            <Link
                                to="/settings"
                                className="block text-center w-full mt-5 py-2.5 bg-[#2D2D3A] hover:bg-[#3A3A4A] text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Manage settings
                            </Link>
                        </Card>

                        {/* Quick actions */}
                        <Card>
                            <h2 className="text-white font-medium mb-4">Quick actions</h2>
                            <ul className="space-y-2">
                                {[
                                    { label: 'Generate password', icon: LuKeyRound, to: '/dashboard' },
                                    { label: 'Enable 2FA', icon: LuSmartphone, to: '/mfa' },
                                    { label: 'View activity', icon: LuActivity, to: '/dashboard' },
                                    { label: 'Get help', icon: LuCircleAlert, to: '/help' },
                                ].map(({ label, icon: Icon, to }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] transition-colors"
                                        >
                                            <Icon size={16} className="text-[#7C5CFC]" />
                                            <span className="text-sm text-white flex-1">{label}</span>
                                            <LuChevronRight size={14} className="text-gray-500" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        {/* Upgrade card */}
                        <div className="bg-linear-to-br from-[#7C5CFC] to-[#5B3FD9] rounded-2xl p-5 text-white">
                            <h3 className="font-semibold mb-1">Upgrade to Team Plan</h3>
                            <p className="text-xs text-white/80 mb-4">
                                Share vaults, manage teammates, and get admin controls.
                            </p>
                            <button className="w-full py-2.5 bg-white text-[#7C5CFC] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
                                Learn more
                            </button>
                        </div>

                    </aside>
                </div>

            </div>
        </div>
    )
}

export default HomePage