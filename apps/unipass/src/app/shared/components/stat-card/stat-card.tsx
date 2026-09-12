import { IconType } from 'react-icons'

interface StatCardProps {
  icon: IconType
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  accent?: string
}

const trendColor = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  trend = 'neutral',
  accent = '#7C5CFC',
}: StatCardProps) => {
  return (
    <div className="bg-[#232330] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}22` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        {change && (
          <span className={`text-xs font-medium ${trendColor[trend]}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-white text-2xl font-semibold">{value}</p>
    </div>
  )
}

export default StatCard