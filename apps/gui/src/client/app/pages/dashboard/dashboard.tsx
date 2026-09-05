import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type HeaderGroup,
  type Row,
  type Cell,
} from '@tanstack/react-table';
import { applicationsApi, Application } from '../../../shared/services/applications';
import { getApiError } from '../../../shared/services/api';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { setApplications, addApplication, removeApplication } from '../../../store/applicationsSlice';

interface CreateAppForm {
  name: string;
  description: string;
  redirectUris: string;
  homepageUrl: string;
}

const columnHelper = createColumnHelper<Application>();

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateAppForm>({
    name: '',
    description: '',
    redirectUris: '',
    homepageUrl: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { data: apps, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.list,
  });

  useEffect(() => {
    if (apps) {
      dispatch(setApplications(apps));
    }
  }, [apps, dispatch]);

  const createMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (data) => {
      dispatch(addApplication(data.application));
      setClientSecret(data.clientSecret);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', redirectUris: '', homepageUrl: '' });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (err) => {
      setFormError(getApiError(err));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: applicationsApi.delete,
    onSuccess: (_, id) => {
      dispatch(removeApplication(id));
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const redirectUris = formData.redirectUris
      .split('\n')
      .map((uri) => uri.trim())
      .filter(Boolean);

    if (redirectUris.length === 0) {
      setFormError('At least one redirect URI is required');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      description: formData.description || undefined,
      redirectUris,
      scopes: ['openid', 'profile', 'email'],
      homepageUrl: formData.homepageUrl || undefined,
    });
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Application',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
            {info.getValue().charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-text-primary">{info.getValue()}</div>
            <div className="text-xs text-text-tertiary">{info.row.original.clientId}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => (
        <span className="text-text-secondary text-sm line-clamp-2">
          {info.getValue() || 'No description'}
        </span>
      ),
    }),
    columnHelper.accessor('redirectUris', {
      header: 'Redirect URIs',
      cell: (info) => {
        const uris = info.getValue();
        return (
          <div className="flex flex-wrap gap-1">
            {uris.slice(0, 2).map((uri, i) => (
              <span key={i} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-xs text-text-secondary">
                {uri}
              </span>
            ))}
            {uris.length > 2 && (
              <span className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-xs text-text-tertiary">
                +{uris.length - 2} more
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue()
              ? 'bg-success/10 text-success'
              : 'bg-error/10 text-error'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => (
        <span className="text-text-secondary text-sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => deleteMutation.mutate(info.row.original.id)}
            className="px-3 py-1 text-xs font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: apps || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, {user?.name || 'User'}! Manage your applications and SSO integrations.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200"
        >
          {showCreateForm ? 'Cancel' : '+ Register App'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-card-bg rounded-2xl border border-border p-6 shadow-card">
          <h2 className="text-xl font-bold text-text-primary mb-4">Register New Application</h2>
          {formError && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="app-name">
                  Application Name *
                </label>
                <input
                  type="text"
                  id="app-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome App"
                  required
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="app-homepage">
                  Homepage URL
                </label>
                <input
                  type="url"
                  id="app-homepage"
                  value={formData.homepageUrl}
                  onChange={(e) => setFormData({ ...formData, homepageUrl: e.target.value })}
                  placeholder="https://myapp.com"
                  className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="app-desc">
                Description
              </label>
              <textarea
                id="app-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does your application do?"
                rows={2}
                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="app-redirects">
                Redirect URIs * (one per line)
              </label>
              <textarea
                id="app-redirects"
                value={formData.redirectUris}
                onChange={(e) => setFormData({ ...formData, redirectUris: e.target.value })}
                placeholder={'https://myapp.com/auth/callback\nhttps://localhost:3000/auth/callback'}
                rows={3}
                required
                className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Registering...' : 'Register Application'}
            </button>
          </form>
        </div>
      )}

      {clientSecret && (
        <div className="bg-success/10 border border-success/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-text-primary mb-2">Client Secret Generated</h3>
          <p className="text-text-secondary text-sm mb-3">
            Save this secret now. It will not be shown again!
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-2 bg-bg-secondary border border-border rounded-lg text-sm break-all">
              {clientSecret}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(clientSecret);
                setClientSecret(null);
              }}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
            >
              Copy & Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-card-bg rounded-2xl border border-border shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary">Loading applications...</div>
        ) : error ? (
          <div className="p-8 text-center text-error">{getApiError(error)}</div>
        ) : (apps?.length || 0) === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl" role="img" aria-label="Empty icon">📋</span>
            <h3 className="text-xl font-bold text-text-primary mt-4">No Applications Yet</h3>
            <p className="text-text-secondary mt-2">
              Register your first application to start using UniPass SSO.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200"
            >
              + Register App
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary border-b border-border">
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<Application>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider cursor-pointer select-none"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border-light">
                  {table.getRowModel().rows.map((row: Row<Application>) => (
                    <tr key={row.id} className="hover:bg-bg-secondary/50 transition-colors duration-150">
                      {row.getVisibleCells().map((cell: Cell<Application, unknown>) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-sm text-text-tertiary">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;