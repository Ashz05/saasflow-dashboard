import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  timeframe,
  setTimeframe,
  onToggleSidebar,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between pb-6 border-b border-saasflow-slate-border select-none">
      {/* Left side: Hamburger button + Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-white border border-saasflow-slate-border text-saasflow-slate-textSecondary hover:text-saasflow-slate-textPrimary shadow-sm"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-saasflow-slate-textSecondary font-normal">Dashboard</span>
          <span className="text-saasflow-slate-textMuted">/</span>
          <span className="text-saasflow-slate-textPrimary font-semibold">Overview</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3.5">
        {/* Search Bar / Command Palette trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-2 bg-white border border-saasflow-slate-border rounded-lg text-saasflow-slate-textMuted text-xs w-56 hover:border-slate-300 transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-saasflow-slate-textMuted" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-saasflow-slate-canvas border border-slate-200 text-[10px] font-semibold text-saasflow-slate-textSecondary">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-lg bg-white border border-saasflow-slate-border flex items-center justify-center text-saasflow-slate-textSecondary hover:text-saasflow-slate-textPrimary transition-colors relative shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-saasflow-status-danger ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 bg-white border border-saasflow-slate-border rounded-xl shadow-xl z-50 space-y-2 text-xs">
              <div className="font-semibold text-saasflow-slate-textPrimary pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] text-saasflow-accent font-medium">Mark read</span>
              </div>
              <div className="p-2 rounded-lg bg-red-50/50 border border-red-100/80">
                <span className="font-semibold text-saasflow-status-danger block">Failed payment attempt</span>
                <span className="text-saasflow-slate-textSecondary text-[11px]">IP 172.56.9.110 flagged</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-saasflow-slate-textPrimary block">New user invite</span>
                <span className="text-saasflow-slate-textSecondary text-[11px]">Devon Lane accepted invite</span>
              </div>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-9 px-3.5 rounded-lg bg-white border border-saasflow-slate-border flex items-center gap-2 text-xs font-semibold text-saasflow-accent hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {timeframe === '7d' ? 'Last 7 Days' : timeframe === '90d' ? 'Last 90 Days' : 'Last 30 Days'}
            </span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 py-1 bg-white border border-saasflow-slate-border rounded-lg shadow-xl z-50 text-xs">
              {['7d', '30d', '90d'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    timeframe === tf ? 'text-saasflow-accent font-semibold bg-indigo-50/50' : 'text-saasflow-slate-textPrimary'
                  }`}
                >
                  <span>{tf === '7d' ? 'Last 7 Days' : tf === '90d' ? 'Last 90 Days' : 'Last 30 Days'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
