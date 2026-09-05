import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

// ========================================
// AUTH API
// ========================================
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post<LoginResponse>('/api/auth/refresh');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<{ user: User }>('/api/auth/me');
    return response.data.user;
  },

  updateProfile: async (data: { name?: string; avatarUrl?: string | null }) => {
    const response = await api.patch<{ user: User }>('/api/auth/profile', data);
    return response.data.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/api/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await api.post('/api/auth/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post('/api/auth/verify-email', { token });
    return response.data;
  },
};