import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Card from '../../../shared/components/Card';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, googleLogin, loading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [googleConfigured, setGoogleConfigured] = useState<boolean>(true);

  useEffect(() => {
    const checkGoogleOAuth = async () => {
      try {
        const response = await fetch('/api/auth/google', { method: 'HEAD' });
        if (response.status === 503) {
          setGoogleConfigured(false);
        }
      } catch {
        setGoogleConfigured(false);
      }
    };
    checkGoogleOAuth();

    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');
    
    if (errorParam === 'google-auth-failed') {
      setLocalError('Google authentication failed. Please try again.');
    } else if (errorParam === '1') {
      setLocalError('Invalid credentials. Please try again.');
    } else if (successParam) {
      setSuccessMessage('Registration successful! Please login.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const displayError = localError || authError;

  return (
    <Card>
      {successMessage && (
        <div className={`p-4 rounded-lg text-sm mb-4 ${
          isDark ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {successMessage}
        </div>
      )}

      {displayError && (
        <div className={`p-4 rounded-lg text-sm mb-4 ${
          isDark ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          fullWidth
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          fullWidth
          disabled={loading}
        />

        <div className="flex justify-end">
          <a href="/forgot-password" className={`text-sm ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            Forgot password?
          </a>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Sign In
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-4 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
            or continue with
          </span>
        </div>
      </div>

      {googleConfigured ? (
        <Button variant="secondary" onClick={handleGoogleLogin} disabled={loading} fullWidth>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>
      ) : (
        <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} bg-gray-100 dark:bg-gray-800 rounded-lg py-2`}>
          Google login is currently unavailable
        </div>
      )}

      <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Don't have an account?{' '}
        <a href="/register" className={`font-semibold ${
          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
        }`}>
          Create one now
        </a>
      </p>
    </Card>
  );
};

export default Login;