import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AuthProvider } from './contexts/auth';
import { ProfileProvider } from '@/contexts/profile';
import AdminAuth from './admin/auth/AdminAuth';
import AdminConsole from './admin/console/AdminConsole';
import AdminRoute from './admin/auth/AdminRoute';
import Profile from './admin/profile/Profile';

// Get the base URL from Vite environment
const base = import.meta.env.BASE_URL;

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/auth" replace />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route
              path="/admin/console"
              element={
                <AdminRoute>
                  <AdminConsole />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <AdminRoute>
                  <Profile />
                </AdminRoute>
              }
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/admin/auth" replace />} />
          </Routes>
        </ProfileProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
