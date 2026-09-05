import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../../../shared/services/auth';
import { getApiError } from '../../../../shared/services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      setSuccess(data.message || 'If an account exists, a reset link has been sent.');
      setError(null);
    },
    onError: (err) => {
      setError(getApiError(err));
      setSuccess(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    forgotMutation.mutate({ email });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card-bg rounded-2xl border border-border p-6 md:p-8 shadow-card">
        <div className="text-center mb-6">
          <span className="text-4xl" role="img" aria-label="Lock icon">🔐</span>
          <h3 className="text-2xl font-bold text-text-primary mt-3">Forgot Password</h3>
          <p className="text-text-secondary text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="forgot-email">
              Email Address
            </label>
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              aria-label="Email address"
            />
          </div>

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 hover:shadow-heavy disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotMutation.isPending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-text-tertiary text-sm hover:text-primary transition-colors duration-200"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;