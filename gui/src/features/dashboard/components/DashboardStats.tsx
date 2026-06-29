import React from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';

interface DashboardStatsProps {
  stats: {
    totalApps: number;
    connectedApps: number;
    availableApps: number;
    totalUsers?: number;
  };
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="h-20 animate-pulse">
              <div className={`h-8 w-24 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
              <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Applications',
      value: stats.totalApps,
      icon: '📱',
      color: 'blue',
    },
    {
      label: 'Connected Apps',
      value: stats.connectedApps,
      icon: '🔗',
      color: 'green',
    },
    {
      label: 'Available Apps',
      value: stats.availableApps,
      icon: '📦',
      color: 'purple',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers || 0,
      icon: '👥',
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600',
    green: isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600',
    purple: isDark ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-50 text-purple-600',
    orange: isDark ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl
              ${colorClasses[item.color as keyof typeof colorClasses]}
            `}>
              {item.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.value}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;