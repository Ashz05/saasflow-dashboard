import React, { useEffect, useState } from 'react';
import { Search, X, LayoutDashboard, LineChart, Users, Network, Settings, FileText, Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  onSelectAction?: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggle,
  onSelectAction,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deniedMessage, setDeniedMessage] = useState<string | null>(null);

  const commands = [
    { label: 'View Analytics Dashboard', icon: LayoutDashboard, category: 'Navigation', adminOnly: false },
    { label: 'Inspect Real-time Revenue Trends', icon: LineChart, category: 'Metrics', adminOnly: false },
    { label: 'Manage Team Members & Permissions', icon: Users, category: 'Access', adminOnly: true },
    { label: 'Configure API Integrations & Webhooks', icon: Network, category: 'Settings', adminOnly: true },
    { label: 'Workspace Preferences', icon: Settings, category: 'Settings', adminOnly: true },
    { label: 'Export Security Audit Logs (CSV)', icon: FileText, category: 'Audit', adminOnly: true },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
    setDeniedMessage(null);
  }, [query, isOpen]);

  const handleExecuteCommand = (cmd: typeof commands[0]) => {
    if (cmd.adminOnly && !isAdmin) {
      setDeniedMessage(`Permission Denied: "${cmd.label}" requires Administrator privileges.`);
      return;
    }
    onSelectAction?.(cmd.label);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else if (onToggle) {
          onToggle();
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredCommands.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        handleExecuteCommand(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onToggle, filteredCommands, selectedIndex, isAdmin]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-saasflow-slate-border overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-saasflow-slate-border gap-3">
          <Search className="w-5 h-5 text-saasflow-slate-textMuted shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search actions..."
            className="w-full text-sm text-saasflow-slate-textPrimary placeholder:text-saasflow-slate-textMuted bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-saasflow-slate-textMuted hover:text-saasflow-slate-textPrimary hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission Denied Alert Banner */}
        {deniedMessage && (
          <div className="mx-3 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">{deniedMessage}</span>
          </div>
        )}

        {/* Command List */}
        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-saasflow-slate-textMuted">
              No matching actions found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.label}
                  onClick={() => handleExecuteCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors group ${
                    isSelected ? 'bg-indigo-50/70 border border-indigo-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-saasflow-accent text-white border-saasflow-accent'
                          : 'bg-saasflow-slate-canvas border-slate-200 text-saasflow-slate-textSecondary group-hover:text-saasflow-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-saasflow-accent' : 'text-saasflow-slate-textPrimary'
                      }`}
                    >
                      {cmd.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cmd.adminOnly && !isAdmin && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                        <Lock className="w-2.5 h-2.5" /> Admin Only
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-saasflow-slate-textMuted bg-slate-100 px-2 py-0.5 rounded">
                      {cmd.category}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-saasflow-slate-canvas border-t border-slate-100 flex items-center justify-between text-[11px] text-saasflow-slate-textMuted">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↵</kbd>
          </div>
          <span>Signed in as <strong className="text-saasflow-slate-textPrimary font-semibold">{isAdmin ? 'Admin' : 'Member'}</strong></span>
        </div>
      </div>
    </div>
  );
};
