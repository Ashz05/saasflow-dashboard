import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KpiCards } from '../components/KpiCards';
import { ChartsRow } from '../components/ChartsRow';
import { ActivityTable } from '../components/ActivityTable';
import { CommandPalette } from '../components/CommandPalette';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const [timeframe, setTimeframe] = useState<string>('30d');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  const handleSelectAction = (action: string) => {
    if (action.includes('Analytics')) {
      setActiveTab('Analytics');
    } else if (action.includes('Users') || action.includes('Team')) {
      setActiveTab('Users');
    } else if (action.includes('Integrations') || action.includes('API')) {
      setActiveTab('Integrations');
    } else if (action.includes('Settings') || action.includes('Preferences')) {
      setActiveTab('Settings');
    } else if (action.includes('Dashboard')) {
      setActiveTab('Dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-saasflow-slate-canvas flex">
      {/* 260px Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Responsive margin) */}
      <main className="flex-1 ml-0 lg:ml-[260px] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full min-w-0">
        {/* Header Bar */}
        <Header
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Access Barrier: Normal users are prevented from accessing Admin tabs */}
        {!isAdmin && (activeTab === 'Users' || activeTab === 'Integrations' || activeTab === 'Settings') ? (
          <div className="p-8 sm:p-12 bg-white/90 backdrop-blur-md border border-saasflow-slate-border rounded-xl shadow-card text-center max-w-2xl mx-auto my-12 space-y-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-saasflow-slate-textPrimary">
                Administrator Access Restricted
              </h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Permission Denied (Role: Member)
              </span>
            </div>
            <p className="text-sm text-saasflow-slate-textSecondary max-w-md mx-auto leading-relaxed">
              You are signed in as <span className="font-semibold text-saasflow-slate-textPrimary">{user?.email}</span> with standard member privileges. Administrative actions including team permissions, API secret rotation, and workspace billing require an organization owner account.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('Dashboard')}
                className="px-4 py-2 bg-saasflow-accent text-white rounded-lg text-sm font-semibold hover:bg-saasflow-accent-hover transition-colors shadow-sm"
              >
                Return to Overview
              </button>
            </div>
          </div>
        ) : isAdmin && (activeTab === 'Users' || activeTab === 'Integrations' || activeTab === 'Settings') ? (
          <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md border border-saasflow-slate-border rounded-xl shadow-card space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-saasflow-slate-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-saasflow-slate-textPrimary">
                    Admin Console: {activeTab}
                  </h2>
                  <p className="text-xs text-saasflow-slate-textSecondary">
                    Organization owner control panel for {user?.workspace?.name || 'Vortex Workspace'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('Dashboard')}
                className="text-xs font-semibold text-saasflow-accent hover:underline"
              >
                ← Back to Overview
              </button>
            </div>

            {activeTab === 'Users' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-saasflow-slate-textPrimary">Team Members & Role Assignments</h4>
                <div className="divide-y divide-saasflow-slate-border border border-saasflow-slate-border rounded-lg overflow-hidden text-sm">
                  <div className="p-3.5 flex items-center justify-between bg-slate-50 font-semibold text-xs text-saasflow-slate-textSecondary">
                    <span>User</span>
                    <span>Role</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-saasflow-slate-textPrimary">Alex Devon (You)</p>
                      <p className="text-xs text-saasflow-slate-textSecondary">alex.d@saasflow.co</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">Owner (Admin)</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-saasflow-slate-textPrimary">Sarah Connor</p>
                      <p className="text-xs text-saasflow-slate-textSecondary">sarah.c@saasflow.co</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Member</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Integrations' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-saasflow-slate-textPrimary">Production API Secrets</h4>
                <div className="p-4 rounded-lg bg-slate-50 border border-saasflow-slate-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-saasflow-slate-textPrimary">Live Webhook Secret</p>
                    <p className="text-xs font-mono text-saasflow-slate-textMuted">whsec_••••••••••••••••••••••••••••••••</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-saasflow-slate-border text-xs font-semibold rounded hover:bg-slate-50 text-saasflow-slate-textPrimary shadow-2xs">
                    Rotate Secret
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-saasflow-slate-textPrimary">Security Policy</h4>
                <div className="p-4 rounded-lg bg-slate-50 border border-saasflow-slate-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-saasflow-slate-textPrimary">Mandatory 2FA Enforcement</p>
                      <p className="text-xs text-saasflow-slate-textSecondary">Require two-factor authentication for all workspace members</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">Enabled</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 4 KPI Cards Ribbon */}
            <KpiCards timeframe={timeframe} />

            {/* Dual Chart Visualizations (Engagement Area & Traffic Donut) */}
            <ChartsRow timeframe={timeframe} setTimeframe={setTimeframe} />

            {/* Paginated Activity Log Audit Table */}
            <ActivityTable />
          </>
        )}
      </main>

      {/* Global ⌘K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggle={() => setIsCommandPaletteOpen((prev) => !prev)}
        onSelectAction={handleSelectAction}
      />
    </div>
  );
};
