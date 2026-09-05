// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppDispatch } from '../../../../store/store';
import { loginStart, loginSuccess, loginFailure } from '../../../../store/authSlice';
import { authApi } from '../../../../shared/services/auth';
import { getApiError } from '../../../../shared/services/api';

interface LoginProps {
  onModeChange: (mode: 'identify' | 'signup') => void;
}

const Login: React.FC<LoginProps> = ({ onModeChange }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginStart());
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      dispatch(loginSuccess({ user: data.user }));
      navigate({ to: '/dashboard' });
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      dispatch(loginFailure(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
        {/* Left Side - Brand Info */}
        <div className="hidden lg:block">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl" role="img" aria-label="UniPass logo">🔐</span>
              <h1 className="text-3xl font-bold text-text-primary">
                Uni<span className="text-primary">Pass</span>
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
              Welcome Back! <br />
              <span className="text-primary">Sign in to continue.</span>
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed">
              Access your secure vault and manage your passwords from anywhere.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="text-primary">✓</span>
                <span>End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="text-primary">✓</span>
                <span>Zero-knowledge architecture</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="text-primary">✓</span>
                <span>Secure & private by default</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:col-start-2">
          <div className="bg-card-bg rounded-2xl border border-border p-6 md:p-8 shadow-card max-w-md mx-auto lg:mx-0 w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary">Sign In</h3>
              <p className="text-text-secondary text-sm mt-1">
                Don't have an account? 
                <button 
                  onClick={() => onModeChange('signup')}
                  className="text-primary hover:underline ml-1 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm" role="alert">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="login-email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  aria-label="Email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    aria-label="Remember me"
                  />
                  Remember me
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-card-bg text-text-tertiary">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg hover:border-primary hover:bg-bg-tertiary transition-all duration-200">
                  <span role="img" aria-label="Google icon">🔴</span>
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg hover:border-primary hover:bg-bg-tertiary transition-all duration-200">
                  <span role="img" aria-label="GitHub icon">🐙</span>
                  <span className="text-sm font-medium">GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => onModeChange('identify')}
                className="text-text-tertiary text-sm hover:text-primary transition-colors duration-200"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;