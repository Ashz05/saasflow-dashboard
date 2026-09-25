import React, { useEffect, useState } from 'react';
import { Search, X, LayoutDashboard, LineChart, Users, Network, Settings, FileText } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { label: 'View Analytics Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Inspect Real-time Revenue Trends', icon: LineChart, category: 'Metrics' },
    { label: 'Manage Team Members & Permissions', icon: Users, category: 'Access' },
    { label: 'Configure API Integrations & Webhooks', icon: Network, category: 'Settings' },
    { label: 'Workspace Preferences', icon: Settings, category: 'Settings' },
    { label: 'Export Security Audit Logs (CSV)', icon: FileText, category: 'Audit' },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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
        onSelectAction?.(filteredCommands[selectedIndex].label);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onToggle, filteredCommands, selectedIndex, onSelectAction]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-saasflow-slate-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-saasflow-slate-border">
          <Search className="w-5 h-5 text-saasflow-slate-textMuted mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search entities..."
            className="w-full text-sm text-saasflow-slate-textPrimary placeholder:text-saasflow-slate-textMuted bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-saasflow-slate-textMuted hover:text-saasflow-slate-textPrimary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-saasflow-slate-textMuted">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.label}
                  onClick={() => {
                    onSelectAction?.(cmd.label);
                    onClose();
                  }}
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
                  <span className="text-[10px] font-medium text-saasflow-slate-textMuted bg-slate-100 px-2 py-0.5 rounded">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-saasflow-slate-canvas border-t border-slate-100 flex items-center justify-between text-[11px] text-saasflow-slate-textMuted">
          <span>Navigate with ↑ / ↓ and Enter</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
