import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api';
import { 
  LayoutDashboard, 
  Receipt, 
  Pill, 
  History, 
  BrainCircuit, 
  LogOut, 
  Menu, 
  X, 
  User 
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/billing', label: 'Billing Counter', icon: Receipt },
    { to: '/inventory', label: 'Inventory', icon: Pill },
    { to: '/sales', label: 'Sales History', icon: History },
    { to: '/ai-assistant', label: 'AI Assistant', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* --- SIDEBAR: DESKTOP --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <span className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
            🌿 PHARMO
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                    : 'hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR: MOBILE OVERLAY --- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fadeIn">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 max-w-sm bg-slate-900 text-slate-300 h-full p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
              <span className="text-lg font-bold text-white tracking-wide">🌿 PHARMO</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 p-1 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </button>
          </aside>
        </div>
      )}

      {/* --- MAIN WORKSPACE VIEW CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="bg-slate-100 p-2 rounded-full text-slate-600">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-3 uppercase">{user?.username || 'Staff Profile'}</p>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
        </header>

        {/* Inner Route View Outlet Wrapper */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};