import { useState, useEffect } from 'react';
import { appsService } from '../services/apps.service';
import { type Application, type UserApps, type CreateAppData, type UpdateAppData } from '../types/apps.types';

export const useApps = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [userApps, setUserApps] = useState<UserApps>({ connected: [], available: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const [allApps, userAppsData] = await Promise.all([
          appsService.getApplications(),
          appsService.getUserApps(),
        ]);
        setApps(allApps);
        setUserApps(userAppsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const createApp = async (data: CreateAppData) => {
    const newApp = await appsService.createApplication(data);
    setApps(prev => [...prev, newApp]);
    return newApp;
  };

  const updateApp = async (id: number, data: UpdateAppData) => {
    const updated = await appsService.updateApplication(id, data);
    setApps(prev => prev.map(app => app.id === id ? updated : app));
    return updated;
  };

  const deleteApp = async (id: number) => {
    await appsService.deleteApplication(id);
    setApps(prev => prev.filter(app => app.id !== id));
    // Refresh user apps
    const updated = await appsService.getUserApps();
    setUserApps(updated);
  };

  const regenerateSecret = async (id: number) => {
    return await appsService.regenerateSecret(id);
  };

  const grantAccess = async (applicationId: number) => {
    await appsService.grantAccess(applicationId);
    const updated = await appsService.getUserApps();
    setUserApps(updated);
  };

  const revokeAccess = async (applicationId: number) => {
    await appsService.revokeAccess(applicationId);
    const updated = await appsService.getUserApps();
    setUserApps(updated);
  };

  return {
    apps,
    userApps,
    loading,
    error,
    createApp,
    updateApp,
    deleteApp,
    regenerateSecret,
    grantAccess,
    revokeAccess,
  };
};