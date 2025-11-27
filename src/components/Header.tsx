import { useEffect, useState } from 'react';
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
    <header className="bg-gradient-to-br from-white via-orange-50/30 to-red-50/20 border-b border-orange-100 shadow-md">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8732] to-[#D62300] rounded-2xl blur-sm opacity-40"></div>
              <img
                src="/bk-logo.png"
                alt="Burger King"
                className="relative w-16 h-16 object-contain drop-shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D62300] via-[#FF8732] to-[#D62300] tracking-tight leading-none mb-1">
                BK Elevation
              </h1>
              <p className="text-[14px] text-[#86868B] font-medium leading-none">Customer Feedback War Room</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <span className="text-[12px] text-[#86868B]">Routing to</span>
            <span className="text-[12px] font-semibold text-[#1D1D1F]">Tom Curtis, CEO</span>
          </div>

          <div className="flex gap-3">
            {/* Total */}
            <div className="stat-card min-w-[120px] px-4 py-3 border border-gray-100" style={{ backgroundColor: 'rgba(142, 142, 147, 0.08)' }}>
              <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-1.5">Total</div>
              <div className="text-[32px] font-bold text-[#1D1D1F] leading-none mb-1">{totalComplaints}</div>
              <div className="text-[12px] text-[#86868B] font-medium">messages</div>
            </div>

            {/* Today */}
            <div className="stat-card min-w-[120px] px-4 py-3 border border-blue-100" style={{ backgroundColor: 'rgba(0, 122, 255, 0.08)' }}>
              <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-1.5">Today</div>
              <div className="text-[32px] font-bold text-[#007AFF] leading-none mb-1">{todayCount}</div>
              <div className="text-[12px] text-[#86868B] font-medium">new</div>
            </div>

            {/* High Priority */}
            <div className="stat-card min-w-[120px] px-4 py-3 border border-red-100" style={{ backgroundColor: 'rgba(255, 59, 48, 0.08)' }}>
              <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-1.5">Priority</div>
              <div className="text-[32px] font-bold text-[#FF3B30] leading-none mb-1 flex items-center gap-2">
                {highPriority}
                {highPriority > 0 && <span className="text-[16px] pulse-subtle">🔴</span>}
              </div>
              <div className="text-[12px] text-[#86868B] font-medium">urgent</div>
            </div>

            {/* Avg Anger */}
            <div className="stat-card min-w-[120px] px-4 py-3 border border-orange-100" style={{ backgroundColor: 'rgba(255, 149, 0, 0.08)' }}>
              <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-1.5">Avg Anger</div>
              <div className="text-[32px] font-bold text-[#FF9500] leading-none mb-1">{avgAnger}</div>
              <div className="text-[12px] text-[#86868B] font-medium">out of 10</div>
            </div>

            {/* Top Issue */}
            <div className="stat-card min-w-[140px] px-4 py-3 border border-purple-100" style={{ backgroundColor: 'rgba(147, 51, 234, 0.08)' }}>
              <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-1.5">Top Issue</div>
              <div className="text-[18px] font-bold text-[#9333EA] capitalize truncate leading-none mb-1">{topCategory}</div>
              <div className="text-[12px] text-[#86868B] font-medium">most common</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
