import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, HelpCircle } from 'lucide-react';
import type { ComplaintWithMetadata } from '../types/complaints';

interface HeaderProps {
  complaints: ComplaintWithMetadata[];
  onStartTutorial?: () => void;
  isTourRunning?: boolean;
}

export function Header({ complaints, onStartTutorial, isTourRunning }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

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

  return (
    <header className="bg-gradient-to-br from-orange-50/60 via-white to-red-50/40 border-b-2 border-[#FF8732]/30 shadow-lg">
      <div className="px-3 md:px-6 py-2 md:py-1">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src="/bk-logo.png"
                  alt="Burger King"
                  className="w-20 h-20 sm:w-32 sm:h-32 lg:w-[160px] lg:h-[160px] object-contain drop-shadow-xl"
                  style={{ objectPosition: 'center', transform: 'scale(1.15)' }}
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 shadow-md" data-tour="live-indicator">
                  <div className="status-dot status-live pulse-subtle" />
                  <span className="text-[10px] sm:text-[12px] font-bold text-[#34C759]">Live</span>
                </div>

                <div className="text-left">
                  <div className="text-[9px] sm:text-[11px] text-[#86868B] font-medium">
                    {currentTime.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-[#1D1D1F] tracking-tight">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block h-16 w-0.5 bg-gradient-to-b from-transparent via-[#FF8732]/40 to-transparent"></div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D62300] via-[#FF8732] to-[#D62300] tracking-tight leading-none mb-1 drop-shadow-sm">
                  BK Elevation
                </h1>
                <p className="text-[11px] sm:text-[13px] text-[#86868B] font-semibold leading-none">Customer Feedback War Room</p>
              </div>

              <div className="hidden sm:block h-10 w-0.5 bg-gradient-to-b from-transparent via-[#FF8732]/40 to-transparent"></div>

              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200 shadow-md">
                <span className="text-[9px] sm:text-[11px] text-[#86868B] font-medium hidden sm:inline">Routing to</span>
                <span className="text-[9px] sm:text-[11px] font-bold text-[#1D1D1F]">Tom Curtis, President</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full lg:w-auto" data-tour="header-stats">
            {/* Total */}
            <div className="stat-card min-w-[80px] sm:min-w-[100px] px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 shadow-md" style={{ backgroundColor: 'rgba(142, 142, 147, 0.12)' }}>
              <div className="text-[8px] sm:text-[9px] text-[#86868B] uppercase tracking-widest font-bold mb-0.5 sm:mb-1">Total</div>
              <div className="text-[20px] sm:text-[26px] font-black text-[#1D1D1F] leading-none mb-0.5">{totalComplaints}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868B] font-semibold">messages</div>
            </div>

            {/* Today */}
            <div className="stat-card min-w-[80px] sm:min-w-[100px] px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-blue-200 shadow-md" style={{ backgroundColor: 'rgba(0, 122, 255, 0.15)' }}>
              <div className="text-[8px] sm:text-[9px] text-[#86868B] uppercase tracking-widest font-bold mb-0.5 sm:mb-1">Today</div>
              <div className="text-[20px] sm:text-[26px] font-black text-[#007AFF] leading-none mb-0.5">{todayCount}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868B] font-semibold">new</div>
            </div>

            {/* High Priority */}
            <div className="stat-card min-w-[80px] sm:min-w-[100px] px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-red-200 shadow-md" style={{ backgroundColor: 'rgba(255, 59, 48, 0.15)' }}>
              <div className="text-[8px] sm:text-[9px] text-[#86868B] uppercase tracking-widest font-bold mb-0.5 sm:mb-1">Priority</div>
              <div className="text-[20px] sm:text-[26px] font-black text-[#FF3B30] leading-none mb-0.5 flex items-center gap-1.5">
                {highPriority}
                {highPriority > 0 && <span className="text-[12px] sm:text-[14px] pulse-subtle">🔴</span>}
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#86868B] font-semibold">urgent</div>
            </div>

            {/* Avg Anger */}
            <div className="stat-card min-w-[80px] sm:min-w-[100px] px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-orange-200 shadow-md" style={{ backgroundColor: 'rgba(255, 135, 50, 0.15)' }}>
              <div className="text-[8px] sm:text-[9px] text-[#86868B] uppercase tracking-widest font-bold mb-0.5 sm:mb-1">Avg Anger</div>
              <div className="text-[20px] sm:text-[26px] font-black text-[#FF8732] leading-none mb-0.5">{avgAnger}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868B] font-semibold">out of 10</div>
            </div>

            {/* Tour Button - Desktop Only */}
            {location.pathname === '/' && onStartTutorial && (
              <button
                onClick={onStartTutorial}
                className={`hidden lg:flex stat-card min-w-[100px] sm:min-w-[140px] px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all cursor-pointer group ${!isTourRunning ? 'tour-button-glow' : ''}`}
                style={{ backgroundColor: 'rgba(147, 51, 234, 0.12)' }}
                title="Start Feature Tour"
              >
                <div className="flex items-center justify-center gap-2 h-full">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-start leading-none">
                    <div className="text-[11px] sm:text-[13px] font-black text-purple-600">Welcome</div>
                    <div className="text-[11px] sm:text-[13px] font-black text-purple-600">Tour</div>
                  </div>
                </div>
              </button>
            )}

            {/* Analytics Link */}
            {location.pathname === '/' && (
              <Link
                to="/analytics"
                data-tour="analytics-link"
                className="stat-card min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#007AFF] shadow-md hover:shadow-xl transition-all cursor-pointer group"
                style={{ backgroundColor: 'rgba(0, 122, 255, 0.15)' }}
              >
                <div className="flex items-center justify-center gap-2 h-full">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#007AFF] group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[11px] sm:text-[13px] font-black text-[#007AFF] leading-none">Keyword</div>
                    <div className="text-[11px] sm:text-[13px] font-black text-[#007AFF] leading-none">Analytics</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
