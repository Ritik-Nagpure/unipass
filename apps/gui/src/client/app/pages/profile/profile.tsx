import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { updateUser } from '../../../store/authSlice';
import { authApi } from '../../../shared/services/auth';
import { getApiError } from '../../../shared/services/api';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      dispatch(updateUser(updatedUser));
      setProfileMessage('Profile updated successfully');
      setProfileError(null);
    },
    onError: (err) => {
      setProfileError(getApiError(err));
      setProfileMessage(null);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      setPasswordMessage(data.message || 'Password changed successfully');
      setPasswordError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err) => {
      setPasswordError(getApiError(err));
      setPasswordMessage(null);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    updateProfileMutation.mutate({ name });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (!user) {
    return (
      <div className="py-12 text-center text-text-secondary" data-testid="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-3xl mx-auto" data-testid="profile-page">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account details</p>
      </div>

      {/* Account summary */}
      <div className="bg-card-bg rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
            <p className="text-text-secondary text-sm">{user.email}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {user.role}
              </span>
              <span className={user.emailVerifiedAt ? 'text-success' : 'text-warning'}>
                {user.emailVerifiedAt ? '✓ Email verified' : 'Email not verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update profile */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-card-bg rounded-2xl border border-border p-6 shadow-card space-y-4"
        data-testid="profile-update-form"
      >
        <h3 className="text-lg font-semibold text-text-primary">Account Details</h3>

        {profileMessage && (
          <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm" role="status">
            {profileMessage}
          </div>
        )}
        {profileError && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm" role="alert">
            {profileError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="profile-name">
            Full Name
          </label>
          <input
            type="text"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            aria-label="Full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="profile-email">
            Email Address
          </label>
          <input
            type="email"
            id="profile-email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-tertiary cursor-not-allowed"
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Change password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-card-bg rounded-2xl border border-border p-6 shadow-card space-y-4"
        data-testid="profile-password-form"
      >
        <h3 className="text-lg font-semibold text-text-primary">Change Password</h3>

        {passwordMessage && (
          <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm" role="status">
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm" role="alert">
            {passwordError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="current-password">
            Current Password
          </label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            aria-label="Current password"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              aria-label="New password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              aria-label="Confirm new password"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;