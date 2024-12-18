import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setIsAdmin(user?.email === import.meta.env.VITE_ADMIN_EMAIL);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" aria-label={t('common.loading')}></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
