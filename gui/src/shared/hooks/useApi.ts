import { useState, useCallback } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(
    url: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: options.credentials || 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(<T>(url: string) => {
    return request<T>(url, { method: 'GET' });
  }, [request]);

  const post = useCallback(<T>(url: string, body: any) => {
    return request<T>(url, { method: 'POST', body });
  }, [request]);

  const put = useCallback(<T>(url: string, body: any) => {
    return request<T>(url, { method: 'PUT', body });
  }, [request]);

  const del = useCallback(<T>(url: string) => {
    return request<T>(url, { method: 'DELETE' });
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
};