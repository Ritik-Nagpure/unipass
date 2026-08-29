import React, { useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';
import { useApps } from '../hooks/useApps';
import { type Application } from '../types/apps.types';

interface AppAccessListProps {
  userId?: number;
}

const AppAccessList: React.FC<AppAccessListProps> = ({ userId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { userApps, loading, grantAccess, revokeAccess } = useApps();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Apps */}
      {userApps.connected.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            Connected Apps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userApps.connected.map((app) => (
              <Card key={app.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {app.name}
                    </h4>
                    {app.description && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {app.description}
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => revokeAccess(app.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Apps */}
      {userApps.available.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            Available Apps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userApps.available.map((app) => (
              <Card key={app.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {app.name}
                    </h4>
                    {app.description && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {app.description}
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => grantAccess(app.id)}
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {userApps.connected.length === 0 && userApps.available.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No applications available.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppAccessList;