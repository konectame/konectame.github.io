import { createBrowserRouter } from 'react-router-dom';
import AdminAuth from './admin/auth/AdminAuth';
import AdminConsole from './admin/console/AdminConsole';
import AdminRoute from './admin/auth/AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/admin/auth',
    element: <AdminAuth />
  },
  {
    path: '/admin/console',
    element: (
      <AdminRoute>
        <AdminConsole />
      </AdminRoute>
    )
  }
  // Add other routes here
]);
