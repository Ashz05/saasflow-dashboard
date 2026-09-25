import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  LayoutDashboard,
  LineChart,
  Users,
  Network,
  Settings,
  LogOut,
  ChevronDown,
  Briefcase,
  X,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'Dashboard',
  setActiveTab,
  isOpen = false,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { label: 'Analytics', icon: LineChart, adminOnly: false },
    { label: 'Users', icon: Users, adminOnly: true },
    { label: 'Integrations', icon: Network, adminOnly: true },
    { label: 'Settings', icon: Settings, adminOnly: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[260px] h-screen bg-saasflow-slate-sidebar flex flex-col justify-between p-4 sm:p-6 select-none shrink-0 fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header with Close button on mobile */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-8 rounded-md bg-saasflow-accent flex items-center justify-center text-white shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SaaSflow</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md text-saasflow-slate-textMuted hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Workspace Switcher */}
          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-saasflow-slate-surfaceDark border border-saasflow-slate-borderDark text-left hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-saasflow-slate-textMuted shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px] font-semibold text-white truncate">
                {user?.workspace?.name || 'Vortex Workspace'}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-saasflow-slate-textMuted transition-transform duration-200 shrink-0 ${
                workspaceMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-lg bg-saasflow-slate-surfaceDark border border-saasflow-slate-borderDark shadow-xl z-50 space-y-1">
              <button
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:bg-slate-700/50 rounded flex items-center justify-between"
              >
                <span>Vortex Workspace</span>
                <span className="text-[10px] text-saasflow-accent font-semibold">Active</span>
              </button>
              <button
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-saasflow-slate-textMuted hover:bg-slate-700/50 rounded"
              >
                Starlight Labs
              </button>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab && setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-saasflow-accent text-white shadow-sm'
                    : 'text-saasflow-slate-textMuted hover:bg-saasflow-slate-surfaceDark hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-saasflow-slate-textMuted'}`} />
                  <span>{item.label}</span>
                </div>
                {item.adminOnly && !isAdmin && (
                  <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="p-3 rounded-[10px] bg-saasflow-slate-surfaceDark border border-saasflow-slate-borderDark flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
            }
            alt={user?.fullName || 'Alex Devon'}
            className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
          />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[13px] font-semibold text-white truncate max-w-[90px]">
                {user?.fullName || 'Alex Devon'}
              </h4>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 ${
                isAdmin
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
            <p className="text-[11px] text-saasflow-slate-textMuted truncate">
              {user?.email || 'alex.d@saasflow.co'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="p-1.5 text-saasflow-slate-textMuted hover:text-saasflow-status-danger transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  </>
);
};
