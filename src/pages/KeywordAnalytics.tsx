import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ComplaintWithMetadata } from '../types/complaints';

interface KeywordAnalyticsProps {
  complaints: ComplaintWithMetadata[];
}

export function KeywordAnalytics({ complaints }: KeywordAnalyticsProps) {
  // Calculate keyword counts
  const keywordData = useMemo(() => {
    const keywordCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      c.keywords?.forEach((keyword) => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });

    // Get top 20 keywords by frequency
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({
        keyword,
        count,
      }));
  }, [complaints]);

  // Color palette for bars
  const colors = [
    '#007AFF', // blue
    '#FF8732', // orange
    '#9333EA', // purple
    '#34C759', // green
    '#FF3B30', // red
    '#EC4899', // pink
    '#6366F1', // indigo
    '#14B8A6', // teal
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-50/60 via-white to-red-50/40 border-b-2 border-[#FF8732]/30 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white transition-all font-semibold shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="h-10 w-0.5 bg-gradient-to-b from-transparent via-[#FF8732]/40 to-transparent"></div>
              <div>
                <h1 className="text-[28px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D62300] via-[#FF8732] to-[#D62300] tracking-tight leading-none mb-1">
                  Keyword Analytics
                </h1>
                <p className="text-[13px] text-[#86868B] font-semibold">Top 20 Most Frequent Keywords</p>
              </div>
            </div>
            <div className="stat-card px-4 py-2 border-2 border-blue-200 shadow-md" style={{ backgroundColor: 'rgba(0, 122, 255, 0.15)' }}>
              <div className="text-[9px] text-[#86868B] uppercase tracking-widest font-bold mb-1">Total Keywords</div>
              <div className="text-[24px] font-black text-[#007AFF] leading-none">{keywordData.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Bar Chart */}
          <div className="card p-6 mb-6">
            <h2 className="text-[20px] font-bold text-[#1D1D1F] mb-4">Keyword Frequency Distribution</h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={keywordData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="keyword"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: '12px', fontWeight: 600, fill: '#1D1D1F' }}
                />
                <YAxis style={{ fontSize: '12px', fontWeight: 600, fill: '#1D1D1F' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #007AFF',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#1D1D1F' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {keywordData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Keyword List */}
          <div className="grid grid-cols-2 gap-4">
            {keywordData.map((item, index) => {
              const percentage = ((item.count / complaints.length) * 100).toFixed(1);
              const color = colors[index % colors.length];

              return (
                <div key={item.keyword} className="card p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ backgroundColor: color }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-[#1D1D1F] capitalize">{item.keyword}</h3>
                        <p className="text-[12px] text-[#86868B]">{percentage}% of messages</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[24px] font-black" style={{ color }}>
                        {item.count}
                      </div>
                      <div className="text-[10px] text-[#86868B] font-semibold">occurrences</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
