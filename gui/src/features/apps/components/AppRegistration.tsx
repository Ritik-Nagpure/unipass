import React, { useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import { useApps } from '../hooks/useApps';
import { type CreateAppData } from '../types/apps.types';

interface AppRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  editingApp?: any;
}

const AppRegistration: React.FC<AppRegistrationProps> = ({
  isOpen,
  onClose,
  editingApp,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { createApp, updateApp } = useApps();
  
  const [formData, setFormData] = useState<CreateAppData>({
    name: editingApp?.name || '',
    description: editingApp?.description || '',
    redirectUri: editingApp?.redirectUri || '',
    website: editingApp?.website || '',
    logo: editingApp?.logo || '',
    scopes: editingApp?.scopes || ['profile', 'email'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate redirect URI
      try {
        new URL(formData.redirectUri);
      } catch {
        throw new Error('Invalid redirect URI');
      }

      let result;
      if (editingApp) {
        result = await updateApp(editingApp.id, formData);
      } else {
        result = await createApp(formData);
        setGeneratedSecret(result.clientSecret);
      }

      // Don't close modal if showing secret
      if (!generatedSecret) {
        onClose();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      redirectUri: '',
      website: '',
      logo: '',
      scopes: ['profile', 'email'],
    });
    setError('');
    setGeneratedSecret(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingApp ? 'Edit Application' : 'Register New Application'}
      size="lg"
    >
      {generatedSecret ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-800'}`}>
              ✅ Application registered successfully!
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Client Secret
            </label>
            <div className={`
              p-4 rounded-lg border
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
            `}>
              <code className="text-sm break-all select-all">
                {generatedSecret}
              </code>
            </div>
            <p className={`mt-2 text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
              ⚠️ Save this secret now. It won't be shown again!
            </p>
          </div>
          <Button onClick={handleClose} fullWidth>
            I've Saved It
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`p-4 rounded-lg text-sm ${
              isDark ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          <Input
            label="Application Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="My Awesome App"
            required
            fullWidth
            disabled={loading}
          />

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className={`
                w-full px-4 py-2 rounded-lg border transition-colors
                ${isDark ? 
                  'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              placeholder="What does your app do?"
              disabled={loading}
            />
          </div>

          <Input
            label="Redirect URI *"
            name="redirectUri"
            value={formData.redirectUri}
            onChange={handleChange}
            placeholder="https://yourapp.com/callback"
            required
            fullWidth
            disabled={loading}
            helper="The URL where users will be redirected after authentication"
          />

          <Input
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://yourapp.com"
            fullWidth
            disabled={loading}
          />

          <Input
            label="Logo URL"
            name="logo"
            value={formData.logo || ''}
            onChange={handleChange}
            placeholder="https://yourapp.com/logo.png"
            fullWidth
            disabled={loading}
          />

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Scopes
            </label>
            <div className="flex flex-wrap gap-3">
              {['profile', 'email', 'phone', 'address'].map((scope) => (
                <label key={scope} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.scopes?.includes(scope) || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        scopes: checked
                          ? [...(prev.scopes || []), scope]
                          : (prev.scopes || []).filter(s => s !== scope),
                      }));
                    }}
                    className={`
                      w-4 h-4 rounded border transition-colors
                      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                      focus:ring-2 focus:ring-blue-500
                    `}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {scope.charAt(0).toUpperCase() + scope.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingApp ? 'Update Application' : 'Register Application'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AppRegistration;