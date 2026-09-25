import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartsRowProps {
  timeframe: string;
  setTimeframe?: (tf: string) => void;
}

export const ChartsRow: React.FC<ChartsRowProps> = ({ timeframe, setTimeframe }) => {
  const [chartTimeframe, setChartTimeframe] = useState<string>(timeframe || '30d');
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [trafficChannels, setTrafficChannels] = useState<any[]>([]);
  const [trafficTotal, setTrafficTotal] = useState<string>('2.8k');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setChartTimeframe(timeframe);
  }, [timeframe]);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/dashboard/charts?timeframe=${chartTimeframe}`);
        setEngagementData(res.data.engagement);
        setTrafficChannels(res.data.trafficChannels);
        setTrafficTotal(res.data.trafficTotal);
      } catch {
        // Fallback default mock
        setEngagementData([
          { date: 'Sep 01', sessions: 1420 },
          { date: 'Sep 05', sessions: 1650 },
          { date: 'Sep 10', sessions: 1920 },
          { date: 'Sep 15', sessions: 2150 },
          { date: 'Sep 20', sessions: 2480 },
          { date: 'Sep 25', sessions: 2847 },
        ]);
        setTrafficChannels([
          { name: 'Direct', percentage: 40, color: '#4F46E5' },
          { name: 'Organic', percentage: 35, color: '#10B981' },
          { name: 'Referral', percentage: 15, color: '#F59E0B' },
          { name: 'Social', percentage: 10, color: '#EF4444' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [chartTimeframe]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* User Engagement Trends Area Chart (7 or 8 cols) */}
      <div className="lg:col-span-8 p-6 bg-white border border-saasflow-slate-border rounded-xl shadow-card flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-saasflow-slate-textPrimary tracking-tight">
              User Engagement Trends
            </h3>
            <p className="text-xs text-saasflow-slate-textSecondary">
              Daily active sessions over selected timeframe
            </p>
          </div>

          {/* Timeframe tabs */}
          <div className="flex items-center p-1 bg-saasflow-slate-canvas rounded-lg border border-slate-200 text-xs">
            {['7d', '30d', '90d'].map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setChartTimeframe(tf);
                  setTimeframe?.(tf);
                }}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  chartTimeframe === tf
                    ? 'bg-white text-saasflow-slate-textPrimary font-semibold shadow-sm'
                    : 'text-saasflow-slate-textSecondary hover:text-saasflow-slate-textPrimary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Body */}
        <div className="h-[260px] w-full">
          {isLoading ? (
            <div className="h-full w-full bg-slate-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="engagementColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#engagementColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Traffic by Source Donut Chart (4 cols) */}
      <div className="lg:col-span-4 p-6 bg-white border border-saasflow-slate-border rounded-xl shadow-card flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-saasflow-slate-textPrimary tracking-tight">
            Traffic by Source
          </h3>
          <p className="text-xs text-saasflow-slate-textSecondary mb-4">
            Primary attribution routes
          </p>
        </div>

        {/* Donut and Legend */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficChannels}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {trafficChannels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-saasflow-slate-textMuted font-normal">Total</span>
              <span className="text-lg font-bold text-saasflow-slate-textPrimary tracking-tight">
                {trafficTotal}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
            {trafficChannels.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-saasflow-slate-textSecondary font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-saasflow-slate-textPrimary">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
