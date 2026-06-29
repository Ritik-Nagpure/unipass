import { type User, type LoginResponse, type RegisterResponse } from '../types/auth.types';

// Use relative URL - Vite proxy will handle it
const API_BASE = '/api/auth';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('🔄 Login request to:', `${API_BASE}/login`);
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(error.error || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      console.log('🔄 Register request to:', `${API_BASE}/register`);
      console.log('📦 Data:', { name, email });
      
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: RegisterResponse = await response.json();
      console.log('✅ Registration successful:', data);
      return data.user;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  },

  async googleLogin(): Promise<void> {
    window.location.href = `${API_BASE}/google`;
  },
};