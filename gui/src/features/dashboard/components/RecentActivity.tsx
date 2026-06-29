import React from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';

interface Activity {
  id: number;
  action: string;
  resource?: string;
  details?: any;
  createdAt: string;
  user?: {
    name?: string;
    email: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
  maxItems?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
  maxItems = 10,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getActivityIcon = (action: string) => {
    const icons: Record<string, string> = {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      REGISTER: '📝',
      UPDATE_PROFILE: '✏️',
      GRANT_ACCESS: '🔗',
      REVOKE_ACCESS: '🔓',
      CREATE_APP: '📱',
      UPDATE_APP: '⚙️',
      DELETE_APP: '🗑️',
      REGENERATE_SECRET: '🔑',
    };
    return icons[action] || '📋';
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'text-green-600 dark:text-green-400',
      LOGOUT: 'text-gray-600 dark:text-gray-400',
      REGISTER: 'text-blue-600 dark:text-blue-400',
      UPDATE_PROFILE: 'text-purple-600 dark:text-purple-400',
      GRANT_ACCESS: 'text-green-600 dark:text-green-400',
      REVOKE_ACCESS: 'text-red-600 dark:text-red-400',
      CREATE_APP: 'text-blue-600 dark:text-blue-400',
      UPDATE_APP: 'text-yellow-600 dark:text-yellow-400',
      DELETE_APP: 'text-red-600 dark:text-red-400',
      REGENERATE_SECRET: 'text-orange-600 dark:text-orange-400',
    };
    return colors[action] || 'text-gray-600 dark:text-gray-400';
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className={`h-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card title="Recent Activity">
      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg transition-colors
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              `}
            >
              <div className="text-2xl flex-shrink-0">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium ${getActionColor(activity.action)}`}>
                    {activity.action.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  {activity.resource && (
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                      {activity.resource}
                    </span>
                  )}
                </div>
                {activity.details && (
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {typeof activity.details === 'string' 
                      ? activity.details 
                      : JSON.stringify(activity.details)}
                  </div>
                )}
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                  {formatDate(activity.createdAt)}
                  {activity.user?.name && (
                    <span> • {activity.user.name}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;