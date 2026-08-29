import React, { useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import AppCard from './AppCard';
import { type Application } from '../types/apps.types';

interface AppListProps {
  apps: Application[];
  loading?: boolean;
  onEdit?: (app: Application) => void;
  onDelete?: (id: number) => void;
  onRegenerateSecret?: (id: number) => void;
  onConnect?: (id: number) => void;
  onDisconnect?: (id: number) => void;
  showActions?: boolean;
  connectedAppIds?: number[];
}

const AppList: React.FC<AppListProps> = ({
  apps,
  loading = false,
  onEdit,
  onDelete,
  onRegenerateSecret,
  onConnect,
  onDisconnect,
  showActions = true,
  connectedAppIds = [],
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected' | 'available'>('all');

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const isConnected = connectedAppIds.includes(app.id);
    
    if (filter === 'connected') return matchesSearch && isConnected;
    if (filter === 'available') return matchesSearch && !isConnected;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            No applications found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'connected' ? 'primary' : 'secondary'}
            onClick={() => setFilter('connected')}
          >
            Connected
          </Button>
          <Button
            size="sm"
            variant={filter === 'available' ? 'primary' : 'secondary'}
            onClick={() => setFilter('available')}
          >
            Available
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Showing {filteredApps.length} of {apps.length} applications
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onEdit={onEdit}
            onDelete={onDelete}
            onRegenerateSecret={onRegenerateSecret}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            showActions={showActions}
            isConnected={connectedAppIds.includes(app.id)}
          />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              No applications match your search.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppList;