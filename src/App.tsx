import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AuthProvider } from './contexts/auth';
import { ProfileProvider } from '@/contexts/profile';
import AdminAuth from './admin/auth/AdminAuth';
import AdminConsole from './admin/console/AdminConsole';
import AdminRoute from './admin/auth/AdminRoute';
import Profile from './admin/profile/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/admin/console" />} />
            </Route>
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminConsole />
                </AdminRoute>
              }
            >
              <Route path="console" element={null} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </ProfileProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
