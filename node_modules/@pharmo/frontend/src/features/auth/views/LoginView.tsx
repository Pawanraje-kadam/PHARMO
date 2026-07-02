import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { loginRequest } from '../api/auth.api';
import { useAuthStore } from '../../../core/store/authStore';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Security Gate: If user is already logged in, skip login screen entirely
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(payload);
      if (response.success) {
        // Hydrate global memory store with user role parameters
        setAuth(response.data);
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.error || 'Authentication rejected by security core.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'System network timeout or connection lost.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 md:px-6">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-800/10">
        <div className="text-center space-y-1">
          <span className="text-3xl">🌿</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">PHARMO CORE</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Intelligent Pharmacy Management
          </p>
        </div>

        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={loading} 
          errorMessage={error} 
        />
        
        <p className="text-center text-[11px] text-slate-400 select-none">
          Authorized staff terminal access trace logged securely.
        </p>
      </div>
    </div>
  );
};