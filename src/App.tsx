import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AuthProvider } from './contexts/auth';
import AdminAuth from './admin/auth/AdminAuth';
import AdminConsole from './admin/console/AdminConsole';
import AdminRoute from './admin/auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/admin/console" />} />
          </Route>
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route
            path="/admin/console"
            element={
              <AdminRoute>
                <AdminConsole />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
