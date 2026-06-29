import { type Application, type UserApps, type CreateAppData, type UpdateAppData } from '../types/apps.types';

const API_BASE = '/api';

export const appsService = {
    // Get all applications (admin)
    async getApplications(): Promise<Application[]> {
        const response = await fetch(`${API_BASE}/applications/admin/all`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        return response.json();
    },

    // Get user's applications
    async getUserApps(): Promise<UserApps> {
        const response = await fetch(`${API_BASE}/applications/public`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user apps');
        }

        const apps = await response.json();
        return {
            connected: apps.filter((app: Application & { isConnected?: boolean }) => app.isConnected),
            available: apps.filter((app: Application & { isConnected?: boolean }) => !app.isConnected),
        };
    },

    // Create application (admin)
    async createApplication(data: CreateAppData): Promise<Application> {
        const response = await fetch(`${API_BASE}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create application');
        }

        return response.json();
    },

    // Update application (admin)
    async updateApplication(id: number, data: UpdateAppData): Promise<Application> {
        const response = await fetch(`${API_BASE}/applications/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update application');
        }

        return response.json();
    },

    // Delete/Deactivate application (admin)
    async deleteApplication(id: number): Promise<void> {
        const response = await fetch(`${API_BASE}/applications/admin/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete application');
        }
    },

    // Regenerate client secret (admin)
    async regenerateSecret(id: number): Promise<{ clientSecret: string }> {
        const response = await fetch(`${API_BASE}/applications/admin/${id}/regenerate-secret`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to regenerate secret');
        }

        return response.json();
    },

    // Grant access to application
    async grantAccess(applicationId: number): Promise<void> {
        const response = await fetch(`${API_BASE}/app-access/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to grant access');
        }
    },

    // Revoke access from application
    async revokeAccess(applicationId: number): Promise<void> {
        const response = await fetch(`${API_BASE}/app-access/disconnect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to revoke access');
        }
    },
};
