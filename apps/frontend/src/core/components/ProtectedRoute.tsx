import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(!isAuthenticated);

  useEffect(() => {
    const verifySession = async () => {
      if (isAuthenticated) return;
      try {
        const response = await api.get('/api/auth/me');
        if (response.data.success) {
          setAuth(response.data.data);
        } else {
          clearAuth();
        }
      } catch (err) {
        clearAuth();
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [isAuthenticated, setAuth, clearAuth]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};