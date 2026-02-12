import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/40">
            <span className="text-sm font-semibold text-emerald-600">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              AI Job Fraud Detector
            </span>
            <span className="text-xs text-slate-500">
              For HR & Security Teams
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-full transition-colors ${
              isActive('/dashboard')
                ? 'bg-slate-900 text-slate-50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/analyze"
            className={`px-3 py-2 rounded-full transition-colors ${
              isActive('/analyze')
                ? 'bg-slate-900 text-slate-50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Analyze
          </Link>
          <Link
            to="/history"
            className={`px-3 py-2 rounded-full transition-colors ${
              isActive('/history')
                ? 'bg-slate-900 text-slate-50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            History
          </Link>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
          >
            <span>GitHub</span>
          </a>
        </nav>

        {/* User / logout */}
        <div className="flex items-center gap-3">
          <div className="hidden text-xs text-slate-500 sm:block">
            <span className="font-medium text-slate-900">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-900 hover:text-slate-50 hover:border-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
