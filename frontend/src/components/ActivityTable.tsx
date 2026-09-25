import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api/client';
import { ListFilter, Search } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  ipAddress: string;
  status: string;
  timestamp: string;
}

interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const ActivityTable: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    limit: 4,
    totalRecords: 48,
    totalPages: 12,
    hasNextPage: true,
    hasPrevPage: false,
  });
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '4',
      });
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/dashboard/activities?${params.toString()}`);
      setActivities(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      // Fallback
      setActivities([
        {
          id: '1',
          user: { name: 'Marcus Aurelius', email: 'marcus@rome.net' },
          action: 'Upgraded subscription',
          ipAddress: '192.168.1.45',
          status: 'SUCCESS',
          timestamp: '2 mins ago',
        },
        {
          id: '2',
          user: { name: 'Helena Carter', email: 'helena@sky.io' },
          action: 'API key generated',
          ipAddress: '10.0.42.12',
          status: 'SUCCESS',
          timestamp: '14 mins ago',
        },
        {
          id: '3',
          user: { name: 'Devon Lane', email: 'devon@pulse.tech' },
          action: 'Failed payment attempt',
          ipAddress: '172.56.9.110',
          status: 'FAILED',
          timestamp: '1 hour ago',
        },
        {
          id: '4',
          user: { name: 'Siddharth Sen', email: 'sid@global.co' },
          action: 'Workspace integration requested',
          ipAddress: '192.168.4.11',
          status: 'PENDING',
          timestamp: '3 hours ago',
        },
      ]);
      setPagination({
        currentPage: 1,
        limit: 4,
        totalRecords: 4,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchActivities();
    }, 250);
    return () => clearTimeout(handler);
  }, [page, statusFilter, search]);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saasflow-status-successBg text-saasflow-status-success">
            Success
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saasflow-status-dangerBg text-saasflow-status-danger">
            Failed
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saasflow-status-warningBg text-saasflow-status-warning">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const startEntry = (pagination.currentPage - 1) * pagination.limit + 1;
  const endEntry = Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords);

  return (
    <div className="p-6 bg-white border border-saasflow-slate-border rounded-xl shadow-card">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-saasflow-slate-border gap-4 flex-wrap">
        <h3 className="text-base font-bold text-saasflow-slate-textPrimary tracking-tight">
          Recent Activity
        </h3>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filter actions or user..."
              className="h-8 px-3 pl-8 text-xs text-saasflow-slate-textPrimary bg-white border border-saasflow-slate-border rounded-lg focus:outline-none focus:border-saasflow-accent w-48 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-saasflow-slate-textMuted absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="p-1.5 rounded-lg border border-saasflow-slate-border text-saasflow-slate-textSecondary hover:bg-slate-50 transition-colors"
            >
              <ListFilter className="w-4 h-4" />
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 p-1 bg-white border border-saasflow-slate-border rounded-lg shadow-xl z-50 text-xs">
                {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setPage(1);
                      setFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded hover:bg-slate-50 capitalize font-medium ${
                      statusFilter === st ? 'text-saasflow-accent font-semibold bg-indigo-50/50' : 'text-saasflow-slate-textPrimary'
                    }`}
                  >
                    {st.toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-saasflow-slate-border text-[11px] font-semibold text-saasflow-slate-textSecondary uppercase tracking-wider">
              <th className="py-3 px-2">User</th>
              <th className="py-3 px-2">Action</th>
              <th className="py-3 px-2">IP Address</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="w-24 h-3.5 bg-slate-200 rounded" />
                        <div className="w-32 h-3 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2"><div className="w-36 h-3.5 bg-slate-200 rounded" /></td>
                  <td className="py-3.5 px-2"><div className="w-24 h-3.5 bg-slate-100 rounded" /></td>
                  <td className="py-3.5 px-2"><div className="w-16 h-5 bg-slate-200 rounded-full" /></td>
                  <td className="py-3.5 px-2 text-right"><div className="w-20 h-3.5 bg-slate-100 rounded ml-auto" /></td>
                </tr>
              ))
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-saasflow-slate-textMuted">
                  No activity logs found.
                </td>
              </tr>
            ) : (
              activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-saasflow-accent text-xs shrink-0 ring-1 ring-slate-200">
                        {item.user.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-saasflow-slate-textPrimary text-[13px]">
                          {item.user.name}
                        </div>
                        <div className="text-saasflow-slate-textSecondary text-xs">
                          {item.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-[13px] text-saasflow-slate-textSecondary font-normal">
                    {item.action}
                  </td>
                  <td className="py-3.5 px-2 font-mono text-xs text-saasflow-slate-textSecondary">
                    {item.ipAddress}
                  </td>
                  <td className="py-3.5 px-2">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3.5 px-2 text-right text-xs text-saasflow-slate-textMuted">
                    {item.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-saasflow-slate-border mt-2 text-xs">
        <span className="text-saasflow-slate-textSecondary font-normal">
          Showing {pagination.totalRecords === 0 ? 0 : startEntry} to {endEntry} of {pagination.totalRecords} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-1.5 rounded-lg border border-saasflow-slate-border text-saasflow-accent font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1.5 rounded-lg border border-saasflow-slate-border text-saasflow-accent font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
