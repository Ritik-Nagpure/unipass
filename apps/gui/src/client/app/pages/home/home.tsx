import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { toggleTheme } from '../../../store/themeSlice';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../../shared/services/auth';
import { getApiError } from '../../../shared/services/api';
import { loginSuccess, loginFailure, loginStart } from '../../../store/authSlice';

type AuthMode = 'login' | 'signup';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user }));
      navigate({ to: '/dashboard' });
    },
    onError: (err) => {
      const message = getApiError(err);
      setError(message);
      dispatch(loginFailure(message));
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user }));
      navigate({ to: '/dashboard' });
    },
    onError: (err) => {
      const message = getApiError(err);
      setError(message);
      dispatch(loginFailure(message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginStart());

    if (mode === 'login') {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text-primary hover:text-primary transition-colors duration-200">
              <span className="text-2xl" role="img" aria-label="Lock icon">🔐</span>
              <span>Uni<span className="text-primary">Pass</span></span>
            </Link>
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg text-text-secondary hover:bg-bg-secondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <span className="text-xl" role="img" aria-label="Moon icon">🌙</span>
              ) : (
                <span className="text-xl" role="img" aria-label="Sun icon">☀️</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - 70/30 Split */}
      <div className="pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-[7fr_3fr] gap-8 lg:gap-12 items-center min-h-[80vh]">
            {/* Left Side - App Info (70%) */}
            <div className="order-2 lg:order-1">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl" role="img" aria-label="UniPass logo">🔐</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
                    Uni<span className="text-primary">Pass</span>
                  </h1>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
                  One Identity. <br />
                  <span className="text-primary">All Your Apps.</span>
                </h2>

                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  The unified Single Sign-On platform that lets your users access every
                  application with one secure login. No more password sprawl, no more
                  separate auth systems.
                </p>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-primary transition-colors duration-200">
                    <span className="text-2xl" role="img" aria-label="SSO icon">🔑</span>
                    <h4 className="font-semibold text-text-primary mt-2">Unified SSO</h4>
                    <p className="text-text-secondary text-sm mt-1">
                      One login for all your applications. Seamless access everywhere.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-primary transition-colors duration-200">
                    <span className="text-2xl" role="img" aria-label="Security icon">🛡️</span>
                    <h4 className="font-semibold text-text-primary mt-2">Enterprise Security</h4>
                    <p className="text-text-secondary text-sm mt-1">
                      OAuth 2.0 + OIDC compliant. JWT-based with PKCE support.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-primary transition-colors duration-200">
                    <span className="text-2xl" role="img" aria-label="Developer icon">⚡</span>
                    <h4 className="font-semibold text-text-primary mt-2">Developer Friendly</h4>
                    <p className="text-text-secondary text-sm mt-1">
                      Simple API integration. Register your app and start in minutes.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-primary transition-colors duration-200">
                    <span className="text-2xl" role="img" aria-label="Privacy icon">🔒</span>
                    <h4 className="font-semibold text-text-primary mt-2">Privacy First</h4>
                    <p className="text-text-secondary text-sm mt-1">
                      Users control what they share. Granular consent management.
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    🔒 OAuth 2.0
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    🛡️ OpenID Connect
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    🌍 JWT + PKCE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form (30%) */}
            <div className="order-1 lg:order-2">
              <div className="bg-card-bg rounded-2xl border border-border p-6 md:p-8 shadow-card max-w-md mx-auto lg:mx-0 w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          onClick={() => { setMode('signup'); setError(null); }}
                          className="text-primary hover:underline ml-1 font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={() => { setMode('login'); setError(null); }}
                          className="text-primary hover:underline ml-1 font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="home-name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="home-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        aria-label="Full name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="home-email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="home-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      aria-label="Email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="home-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="home-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                        required
                        minLength={mode === 'signup' ? 8 : 1}
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
                    {mode === 'signup' && (
                      <p className="text-xs text-text-tertiary mt-1">
                        Must be at least 8 characters with a number and special character
                      </p>
                    )}
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          aria-label="Remember me"
                        />
                        Remember me
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? 'Please wait...'
                      : mode === 'login'
                        ? 'Sign In'
                        : 'Create Account'}
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
                  <p className="text-text-tertiary text-xs">
                    By continuing, you agree to our{' '}
                    <Link to="/terms-of-service" className="text-primary hover:underline mx-1">Terms</Link>
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline mx-1">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;