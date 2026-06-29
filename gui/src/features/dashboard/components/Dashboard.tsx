import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import { useAuth } from '../../auth/hooks/useAuth';
import { useApps } from '../../apps/hooks/useApps';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const { userApps, loading: appsLoading } = useApps();
  const [stats, setStats] = useState({
    totalApps: 0,
    connectedApps: 0,
    availableApps: 0,
  });

  useEffect(() => {
    if (userApps) {
      setStats({
        totalApps: userApps.connected.length + userApps.available.length,
        connectedApps: userApps.connected.length,
        availableApps: userApps.available.length,
      });
    }
  }, [userApps]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Here's what's happening with your Unipass account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.totalApps}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Applications
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className={`text-3xl font-bold text-green-600 dark:text-green-400`}>
              {stats.connectedApps}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Connected Apps
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className={`text-3xl font-bold text-blue-600 dark:text-blue-400`}>
              {stats.availableApps}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Available Apps
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/apps"
            className={`p-4 rounded-lg border-2 border-dashed text-center transition-colors ${
              isDark 
                ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
          >
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Manage Apps
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              View and manage your connected applications
            </div>
          </a>

          <a
            href="/profile"
            className={`p-4 rounded-lg border-2 border-dashed text-center transition-colors ${
              isDark 
                ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
          >
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Update Profile
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Keep your personal information up to date
            </div>
          </a>
        </div>
      </Card>

      {/* Connected Apps List */}
      {userApps.connected.length > 0 && (
        <Card title="Your Connected Apps">
          <div className="space-y-2">
            {userApps.connected.map((app) => (
              <div
                key={app.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </div>
                  {app.description && (
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {app.description}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>
                  Connected
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;