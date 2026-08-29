import React from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { type Application } from '../types/apps.types';

interface AppCardProps {
  app: Application;
  onEdit?: (app: Application) => void;
  onDelete?: (id: number) => void;
  onRegenerateSecret?: (id: number) => void;
  onConnect?: (id: number) => void;
  onDisconnect?: (id: number) => void;
  showActions?: boolean;
  isConnected?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  onEdit,
  onDelete,
  onRegenerateSecret,
  onConnect,
  onDisconnect,
  showActions = true,
  isConnected = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {app.logo ? (
                <img
                  src={app.logo}
                  alt={app.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                `}>
                  <span className={`text-lg font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {app.name}
                </h3>
                {app.description && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {app.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          {isConnected !== undefined && (
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${isConnected 
                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
              }
            `}>
              {isConnected ? 'Connected' : 'Available'}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm">
          {app.website && (
            <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              <span className="font-medium">Website:</span>
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-2 hover:underline ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {app.website}
              </a>
            </div>
          )}
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            <span className="font-medium">Status:</span>
            <span className={`ml-2 ${
              app.isActive 
                ? isDark ? 'text-green-400' : 'text-green-600'
                : isDark ? 'text-red-400' : 'text-red-600'
            }`}>
              {app.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {app.scopes && app.scopes.length > 0 && (
            <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              <span className="font-medium">Scopes:</span>
              <span className="ml-2">
                {app.scopes.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {onConnect && !isConnected && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onConnect(app.id)}
              >
                Connect
              </Button>
            )}
            {onDisconnect && isConnected && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDisconnect(app.id)}
              >
                Disconnect
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(app)}
              >
                Edit
              </Button>
            )}
            {onRegenerateSecret && (
              <Button
                size="sm"
                variant="warning"
                onClick={() => onRegenerateSecret(app.id)}
              >
                Regenerate Secret
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(app.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppCard;