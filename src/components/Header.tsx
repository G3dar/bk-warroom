import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import type { ComplaintWithMetadata } from '../types/complaints';

interface HeaderProps {
  complaints: ComplaintWithMetadata[];
}

export function Header({ complaints }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalComplaints = complaints.length;
  const highPriority = complaints.filter(
    (c) => c.priority === 'high' || c.anger.category === 'furious'
  ).length;
  const avgAnger = (
    complaints.reduce((sum, c) => sum + c.anger.level, 0) / totalComplaints
  ).toFixed(1);

  // Get complaints from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = complaints.filter((c) => c.timestamp >= today).length;

  // Get top issue category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <header className="bg-gradient-to-b from-white to-[#FAFAFA] border-b border-[#E5E5E5] shadow-sm">
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF8732] to-[#D62300] rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight leading-none mb-0.5">
                BK Elevation
              </h1>
              <p className="text-[13px] text-[#86868B] leading-none">Customer Feedback Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F7]">
              <div className="status-dot status-live pulse-subtle" />
              <span className="text-[12px] font-semibold text-[#34C759]">Live</span>
            </div>

            <div className="text-right">
              <div className="text-[12px] text-[#86868B]">
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F7]">
            <span className="text-[12px] text-[#86868B]">Routing to</span>
            <span className="text-[12px] font-semibold text-[#1D1D1F]">Tom Curtis, CEO</span>
          </div>

          <div className="flex gap-2.5">
            {/* Total */}
            <div className="stat-card min-w-[110px] px-3 py-2">
              <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold mb-1">Total</div>
              <div className="text-[26px] font-semibold text-[#1D1D1F] leading-none mb-0.5">{totalComplaints}</div>
              <div className="text-[11px] text-[#86868B]">messages</div>
            </div>

            {/* Today */}
            <div className="stat-card min-w-[110px] px-3 py-2">
              <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold mb-1">Today</div>
              <div className="text-[26px] font-semibold text-[#007AFF] leading-none mb-0.5">{todayCount}</div>
              <div className="text-[11px] text-[#86868B]">new</div>
            </div>

            {/* High Priority */}
            <div className="stat-card min-w-[110px] px-3 py-2">
              <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold mb-1">Priority</div>
              <div className="text-[26px] font-semibold text-[#FF3B30] leading-none mb-0.5 flex items-center gap-1.5">
                {highPriority}
                {highPriority > 0 && <span className="text-[14px] pulse-subtle">🔴</span>}
              </div>
              <div className="text-[11px] text-[#86868B]">urgent</div>
            </div>

            {/* Avg Anger */}
            <div className="stat-card min-w-[110px] px-3 py-2">
              <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold mb-1">Avg Anger</div>
              <div className="text-[26px] font-semibold text-[#FF9500] leading-none mb-0.5">{avgAnger}</div>
              <div className="text-[11px] text-[#86868B]">out of 10</div>
            </div>

            {/* Top Issue */}
            <div className="stat-card min-w-[130px] px-3 py-2">
              <div className="text-[10px] text-[#86868B] uppercase tracking-wider font-semibold mb-1">Top Issue</div>
              <div className="text-[17px] font-semibold text-[#1D1D1F] capitalize truncate leading-none mb-0.5">{topCategory}</div>
              <div className="text-[11px] text-[#86868B]">most common</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
