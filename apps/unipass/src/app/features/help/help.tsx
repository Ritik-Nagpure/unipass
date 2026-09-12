import {
  LuLifeBuoy,
  LuBookOpen,
  LuMessageSquare,
  LuMail,
  LuPhone,
  LuChevronRight,
  LuSearch,
  LuPlus,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
  LuTriangleAlert,
  LuFileText,
  LuVideo,
  LuUsers,
  LuShieldCheck,
} from 'react-icons/lu'

interface Ticket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  updatedAt: string
}

const tickets: Ticket[] = [
  {
    id: '#UP-1042',
    subject: 'Unable to enable 2FA on new device',
    status: 'open',
    priority: 'high',
    updatedAt: '2 hours ago',
  },
  {
    id: '#UP-1039',
    subject: 'Password vault sync issue',
    status: 'pending',
    priority: 'medium',
    updatedAt: '1 day ago',
  },
  {
    id: '#UP-1031',
    subject: 'Requesting access to Team Plan',
    status: 'resolved',
    priority: 'low',
    updatedAt: '3 days ago',
  },
  {
    id: '#UP-1024',
    subject: 'Billing question about annual plan',
    status: 'resolved',
    priority: 'low',
    updatedAt: '1 week ago',
  },
]

const statusStyles: Record<Ticket['status'], string> = {
  open: 'bg-red-500/15 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

const priorityStyles: Record<Ticket['priority'], string> = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-gray-400',
}

const StatusIcon = ({ status }: { status: Ticket['status'] }) => {
  if (status === 'resolved') return <LuCircleCheck size={14} />
  if (status === 'pending') return <LuClock size={14} />
  return <LuCircleAlert size={14} />
}

const HelpPage = () => {
  return (
    // 🎯 Fills whatever box the parent gives it
    <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ---------- HERO ---------- */}
        <section className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#7C5CFC]/20 flex items-center justify-center shrink-0">
                <LuLifeBuoy className="text-[#7C5CFC]" size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                  Help Center
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Find answers, browse guides, or open a support ticket.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white text-sm font-medium rounded-lg transition-colors self-start sm:self-auto shrink-0">
              <LuPlus size={16} />
              New Ticket
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-6 flex items-center gap-2 px-4 py-3 bg-[#2D2D3A] border border-gray-700 rounded-lg focus-within:border-[#7C5CFC] transition-colors">
            <LuSearch size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none min-w-0"
            />
          </div>
        </section>

        {/* ---------- QUICK CATEGORIES ---------- */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: LuShieldCheck, label: 'Security & 2FA', count: 12 },
              { icon: LuFileText,    label: 'Account Setup',  count: 8 },
              { icon: LuUsers,       label: 'Team & Sharing', count: 15 },
              { icon: LuVideo,       label: 'Video Tutorials', count: 6 },
            ].map(({ icon: Icon, label, count }) => (
              <button
                key={label}
                className="group flex items-start gap-3 p-4 bg-[#232330] border border-gray-800 hover:border-[#7C5CFC]/50 hover:bg-[#2D2D3A] rounded-lg text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-[#7C5CFC]/15 flex items-center justify-center shrink-0">
                  <Icon className="text-[#7C5CFC]" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{count} articles</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- MAIN 2-COLUMN LAYOUT ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ---------- LEFT: TICKETS ---------- */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm uppercase tracking-wider text-gray-500">
                Your Tickets
              </h2>
              <button className="text-xs text-[#7C5CFC] hover:underline">
                View all
              </button>
            </div>

            <div className="bg-[#232330] border border-gray-800 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-800">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <button className="w-full flex items-start gap-3 sm:gap-4 p-4 hover:bg-[#2D2D3A] transition-colors text-left">
                      {/* Left — status badge (stack on mobile) */}
                      <div className="flex flex-col items-start gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium capitalize ${
                            statusStyles[ticket.status]
                          }`}
                        >
                          <StatusIcon status={ticket.status} />
                          {ticket.status}
                        </span>
                      </div>

                      {/* Middle — subject + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {ticket.subject}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                          <span>{ticket.id}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Updated {ticket.updatedAt}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className={priorityStyles[ticket.priority]}>
                            {ticket.priority} priority
                          </span>
                        </div>
                      </div>

                      {/* Right — chevron */}
                      <LuChevronRight
                        size={18}
                        className="text-gray-500 shrink-0 mt-1"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- RIGHT: SIDEBAR SECTIONS ---------- */}
          <aside className="space-y-6">

            {/* Contact support */}
            <section className="bg-[#232330] border border-gray-800 rounded-lg p-5">
              <h3 className="text-white font-medium mb-1">Need more help?</h3>
              <p className="text-xs text-gray-400 mb-4">
                Reach out to our support team — we usually reply within 24 hours.
              </p>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] text-left transition-colors">
                  <LuMessageSquare className="text-[#7C5CFC] shrink-0" size={16} />
                  <span className="text-sm text-white flex-1">Live Chat</span>
                  <LuChevronRight size={14} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] text-left transition-colors">
                  <LuMail className="text-[#7C5CFC] shrink-0" size={16} />
                  <span className="text-sm text-white flex-1">Email Support</span>
                  <LuChevronRight size={14} className="text-gray-500" />
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] text-left transition-colors">
                  <LuPhone className="text-[#7C5CFC] shrink-0" size={16} />
                  <span className="text-sm text-white flex-1">Call Us</span>
                  <LuChevronRight size={14} className="text-gray-500" />
                </button>
              </div>
            </section>

            {/* System status */}
            <section className="bg-[#232330] border border-gray-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">System Status</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operational
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                {['Web App', 'API', 'Authentication', 'Sync Service'].map((svc) => (
                  <li key={svc} className="flex items-center justify-between">
                    <span className="text-gray-400">{svc}</span>
                    <LuCircleCheck className="text-emerald-400" size={14} />
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            <section className="bg-[#232330] border border-gray-800 rounded-lg p-5">
              <h3 className="text-white font-medium mb-3">Popular FAQs</h3>
              <ul className="space-y-2">
                {[
                  'How do I enable 2FA?',
                  'How do I reset my master password?',
                  'Can I share vaults with my team?',
                  'What happens if I lose my device?',
                ].map((q) => (
                  <li key={q}>
                    <button className="w-full flex items-start gap-2 text-left text-sm text-gray-400 hover:text-white transition-colors">
                      <LuBookOpen size={14} className="text-gray-500 shrink-0 mt-0.5" />
                      <span className="flex-1">{q}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Warning card */}
            <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <LuTriangleAlert className="text-amber-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h3 className="text-amber-200 font-medium text-sm">
                    Report a security issue
                  </h3>
                  <p className="text-xs text-amber-200/70 mt-1">
                    If you've found a vulnerability, please contact our security team
                    directly instead of opening a public ticket.
                  </p>
                </div>
              </div>
            </section>

          </aside>
        </div>

      </div>
    </div>
  )
}

export default HelpPage