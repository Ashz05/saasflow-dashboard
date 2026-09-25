import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DollarSign, Users, Target, Clock, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricItem {
  key: string;
  title: string;
  value: string;
  delta: string;
  deltaDirection: string;
  icon: string;
}

interface KpiCardsProps {
  timeframe: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ timeframe }) => {
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (showLoading: boolean = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await api.get(`/dashboard/stats?timeframe=${timeframe}`);
      setMetrics(res.data.metrics);
      setError(null);
    } catch {
      setError('Unable to load telemetry metrics');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(true);

    // 30s background polling engine
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMetrics(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const getIcon = (key: string) => {
    switch (key) {
      case 'total_revenue':
        return <DollarSign className="w-5 h-5 text-saasflow-accent" />;
      case 'active_users':
        return <Users className="w-5 h-5 text-saasflow-accent" />;
      case 'conversion_rate':
        return <Target className="w-5 h-5 text-saasflow-accent" />;
      case 'avg_response_time':
        return <Clock className="w-5 h-5 text-saasflow-accent" />;
      default:
        return <DollarSign className="w-5 h-5 text-saasflow-accent" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 bg-white border border-saasflow-slate-border rounded-xl shadow-card animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            </div>
            <div className="flex items-end justify-between pt-2">
              <div className="h-8 bg-slate-200 rounded w-28" />
              <div className="h-6 bg-slate-100 rounded-md w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && metrics.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-saasflow-status-danger text-sm flex items-center justify-between">
        <span>{error}</span>
        <button
          onClick={() => fetchMetrics(true)}
          className="font-semibold underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const isPositive = item.deltaDirection === 'positive';
        const isNeutral = item.deltaDirection === 'neutral';
        return (
          <div
            key={item.key}
            className="p-6 bg-white border border-saasflow-slate-border rounded-xl shadow-card flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-saasflow-slate-textSecondary">
                {item.title}
              </span>
              <div className="w-10 h-10 rounded-lg bg-saasflow-accent-light flex items-center justify-center">
                {getIcon(item.key)}
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
              <span className="text-[28px] font-bold tracking-tight text-saasflow-slate-textPrimary leading-none">
                {item.value}
              </span>
              <div
                className={`flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-semibold ${
                  isNeutral
                    ? 'bg-slate-100 text-saasflow-slate-textSecondary'
                    : isPositive
                    ? 'bg-saasflow-status-successBg text-saasflow-status-success'
                    : 'bg-saasflow-status-dangerBg text-saasflow-status-danger'
                }`}
              >
                {isNeutral ? (
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{item.delta}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
