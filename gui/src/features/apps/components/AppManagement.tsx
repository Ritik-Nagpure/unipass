import React, { useState } from 'react';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { useApps } from '../hooks/useApps';
import { type Application, type CreateAppData } from '../types/apps.types';

const AppManagement: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { apps, loading, createApp, updateApp, deleteApp, regenerateSecret } = useApps();
  
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newSecret, setNewSecret] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState<CreateAppData>({
    name: '',
    description: '',
    redirectUri: '',
    website: '',
    logo: '',
    scopes: ['profile', 'email'],
  });
  const [formError, setFormError] = useState<string>('');
  const [formLoading, setFormLoading] = useState(false);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      redirectUri: '',
      website: '',
      logo: '',
      scopes: ['profile', 'email'],
    });
    setFormError('');
    setFormLoading(false);
  };

  // Handle create app
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Application name is required');
      }
      if (!formData.redirectUri.trim()) {
        throw new Error('Redirect URI is required');
      }
      try {
        new URL(formData.redirectUri);
      } catch {
        throw new Error('Invalid redirect URI');
      }

      const result = await createApp(formData);
      setNewSecret(result.clientSecret);
      setIsCreateModalOpen(false);
      setIsSecretModalOpen(true);
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create application');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit app
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (!selectedApp) return;
      
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Application name is required');
      }
      if (!formData.redirectUri.trim()) {
        throw new Error('Redirect URI is required');
      }
      try {
        new URL(formData.redirectUri);
      } catch {
        throw new Error('Invalid redirect URI');
      }

      await updateApp(selectedApp.id, formData);
      setIsEditModalOpen(false);
      resetForm();
      setSelectedApp(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update application');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete app
  const handleDelete = async (app: Application) => {
    if (!window.confirm(`Are you sure you want to deactivate "${app.name}"?`)) {
      return;
    }

    try {
      await deleteApp(app.id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete application');
    }
  };

  // Handle regenerate secret
  const handleRegenerateSecret = async (app: Application) => {
    if (!window.confirm(`This will invalidate the current secret for "${app.name}". Continue?`)) {
      return;
    }

    try {
      const result = await regenerateSecret(app.id);
      setNewSecret(result.clientSecret);
      setIsSecretModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate secret');
    }
  };

  // Open edit modal
  const openEditModal = (app: Application) => {
    setSelectedApp(app);
    setFormData({
      name: app.name,
      description: app.description || '',
      redirectUri: app.redirectUri,
      website: app.website || '',
      logo: app.logo || '',
      scopes: app.scopes || ['profile', 'email'],
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Application Management
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Register and manage applications that use Unipass SSO
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
        >
          + Register New App
        </Button>
      </div>

      {/* App List */}
      {apps.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No Applications Registered
            </h3>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Get started by registering your first application
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
            >
              Register Your First App
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {apps.map((app) => (
            <Card key={app.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* App Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {app.logo ? (
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                      `}>
                        <span className={`text-lg font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {app.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {app.name}
                        </h3>
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0
                          ${app.isActive 
                            ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            : isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {app.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {app.description && (
                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {app.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-1 text-xs">
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                          Client ID: <code className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {app.clientId.substring(0, 12)}...
                          </code>
                        </span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                          Redirect: <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {app.redirectUri}
                          </span>
                        </span>
                        {app.scopes && app.scopes.length > 0 && (
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                            Scopes: <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {app.scopes.join(', ')}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(app)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleRegenerateSecret(app)}
                  >
                    New Secret
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(app)}
                  >
                    {app.isActive ? 'Deactivate' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Register New Application"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className={`p-4 rounded-lg text-sm ${
              isDark ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formError}
            </div>
          )}

          <Input
            label="Application Name *"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Awesome App"
            required
            fullWidth
            disabled={formLoading}
          />

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className={`
                w-full px-4 py-2 rounded-lg border transition-colors
                ${isDark ? 
                  'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              placeholder="What does your app do?"
              disabled={formLoading}
            />
          </div>

          <Input
            label="Redirect URI *"
            name="redirectUri"
            value={formData.redirectUri}
            onChange={(e) => setFormData({ ...formData, redirectUri: e.target.value })}
            placeholder="https://yourapp.com/callback"
            required
            fullWidth
            disabled={formLoading}
            helper="The URL where users will be redirected after authentication"
          />

          <Input
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourapp.com"
            fullWidth
            disabled={formLoading}
          />

          <Input
            label="Logo URL"
            name="logo"
            value={formData.logo || ''}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="https://yourapp.com/logo.png"
            fullWidth
            disabled={formLoading}
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
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Register Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedApp(null);
        }}
        title={`Edit: ${selectedApp?.name || 'Application'}`}
        size="lg"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {formError && (
            <div className={`p-4 rounded-lg text-sm ${
              isDark ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formError}
            </div>
          )}

          <Input
            label="Application Name *"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="My Awesome App"
            required
            fullWidth
            disabled={formLoading}
          />

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className={`
                w-full px-4 py-2 rounded-lg border transition-colors
                ${isDark ? 
                  'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500' : 
                  'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              placeholder="What does your app do?"
              disabled={formLoading}
            />
          </div>

          <Input
            label="Redirect URI *"
            name="redirectUri"
            value={formData.redirectUri}
            onChange={(e) => setFormData({ ...formData, redirectUri: e.target.value })}
            placeholder="https://yourapp.com/callback"
            required
            fullWidth
            disabled={formLoading}
            helper="The URL where users will be redirected after authentication"
          />

          <Input
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourapp.com"
            fullWidth
            disabled={formLoading}
          />

          <Input
            label="Logo URL"
            name="logo"
            value={formData.logo || ''}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="https://yourapp.com/logo.png"
            fullWidth
            disabled={formLoading}
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
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
                setSelectedApp(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Update Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Secret Display Modal */}
      <Modal
        isOpen={isSecretModalOpen}
        onClose={() => {
          setIsSecretModalOpen(false);
          setNewSecret('');
        }}
        title="Client Secret Generated"
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-800'}`}>
              ✅ New client secret generated successfully!
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
                {newSecret}
              </code>
            </div>
            <p className={`mt-2 text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
              ⚠️ Save this secret now. It won't be shown again!
            </p>
          </div>

          <Button
            onClick={() => {
              setIsSecretModalOpen(false);
              setNewSecret('');
            }}
            fullWidth
          >
            I've Saved It
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AppManagement;