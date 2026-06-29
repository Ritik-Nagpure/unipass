import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './shared/theme/ThemeProvider';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import Dashboard from './features/dashboard/components/Dashboard';
import ProfileSettings from './features/profile/components/ProfileSettings';
import AppAccessList from './features/apps/components/AppAccessList';
import AppManagement from './features/apps/components/AppManagement';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes - No authentication required */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes - Authentication required */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/apps" element={<AppAccessList />} />
              <Route path="/admin/apps" element={<AppManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;