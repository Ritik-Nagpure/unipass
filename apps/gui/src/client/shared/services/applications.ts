import api from './api';

export interface Application {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  clientId: string;
  redirectUris: string[];
  scopes: string[];
  homepageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  name: string;
  description?: string;
  logoUrl?: string;
  redirectUris: string[];
  scopes: string[];
  homepageUrl?: string;
}

export interface UpdateApplicationData {
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
  redirectUris?: string[];
  scopes?: string[];
  homepageUrl?: string | null;
  isActive?: boolean;
}

// ========================================
// APPLICATIONS API
// ========================================
export const applicationsApi = {
  create: async (data: CreateApplicationData) => {
    const response = await api.post('/api/applications', data);
    return response.data;
  },

  list: async () => {
    const response = await api.get<{ applications: Application[] }>('/api/applications');
    return response.data.applications;
  },

  get: async (id: string) => {
    const response = await api.get<{ application: Application }>(`/api/applications/${id}`);
    return response.data.application;
  },

  update: async (id: string, data: UpdateApplicationData) => {
    const response = await api.patch<{ application: Application }>(`/api/applications/${id}`, data);
    return response.data.application;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/applications/${id}`);
    return response.data;
  },

  regenerateSecret: async (id: string) => {
    const response = await api.post<{ clientSecret: string }>(`/api/applications/${id}/regenerate-secret`);
    return response.data;
  },

  getConsents: async (id: string) => {
    const response = await api.get(`/api/applications/${id}/consents`);
    return response.data.consents;
  },
};