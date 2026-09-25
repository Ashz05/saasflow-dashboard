import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KpiCards } from '../components/KpiCards';
import { ChartsRow } from '../components/ChartsRow';
import { ActivityTable } from '../components/ActivityTable';
import { CommandPalette } from '../components/CommandPalette';

export const Dashboard: React.FC = () => {
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

        {/* 4 KPI Cards Ribbon */}
        <KpiCards timeframe={timeframe} />

        {/* Dual Chart Visualizations (Engagement Area & Traffic Donut) */}
        <ChartsRow timeframe={timeframe} setTimeframe={setTimeframe} />

        {/* Paginated Activity Log Audit Table */}
        <ActivityTable />
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
