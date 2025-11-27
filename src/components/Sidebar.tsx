import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ComplaintWithMetadata } from '../types/complaints';
import { getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface SidebarProps {
  complaints: ComplaintWithMetadata[];
  selectedCategory: string | null;
  selectedAnger: string | null;
  selectedState: string | null;
  onCategoryChange: (category: string | null) => void;
  onAngerChange: (anger: string | null) => void;
  onStateChange: (state: string | null) => void;
}

export function Sidebar({
  complaints,
  selectedCategory,
  selectedAnger,
  selectedState,
  onCategoryChange,
  onAngerChange,
  onStateChange,
}: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('category');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    const normalized = normalizeCategoryName(c.category);
    categoryCounts[normalized] = (categoryCounts[normalized] || 0) + 1;
  });

  // Calculate anger counts
  const angerCounts: Record<string, number> = {
    furious: 0,
    angry: 0,
    annoyed: 0,
    calm: 0,
  };
  complaints.forEach((c) => {
    angerCounts[c.anger.category]++;
  });

  // Calculate state counts
  const stateCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    if (c.location.stateAbbr !== 'XX') {
      stateCounts[c.location.stateAbbr] = (stateCounts[c.location.stateAbbr] || 0) + 1;
    }
  });

  const totalComplaints = complaints.length;

  return (
    <aside className="w-80 bg-[#FAFAFA] border-r border-[#E5E5E5] overflow-y-auto shadow-sm">
      <div className="p-4">
        <h2 className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-6">
          Filters
        </h2>

        {/* Category Filter */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3 text-[#1D1D1F] font-semibold hover:text-[#007AFF] transition-colors text-[15px]"
          >
            <span>Complaint Type</span>
            {expandedSection === 'category' ? (
              <ChevronDown className="w-4 h-4 text-[#86868B]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#86868B]" />
            )}
          </button>

          {expandedSection === 'category' && (
            <div className="space-y-2.5">
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const percentage = ((count / totalComplaints) * 100).toFixed(0);
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(isSelected ? null : category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-[#007AFF] text-white shadow-md'
                          : 'hover:bg-[#F5F5F7]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[18px]">{getCategoryEmoji(category)}</span>
                          <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                            {category}
                          </span>
                        </div>
                        <span className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-[#007AFF]'}`}>
                          {count}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-[#007AFF]'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Anger Filter */}
        <div className="mb-8">
          <button
            onClick={() => toggleSection('anger')}
            className="flex items-center justify-between w-full mb-3 text-[#1D1D1F] font-semibold hover:text-[#007AFF] transition-colors text-[15px]"
          >
            <span>Anger Level</span>
            {expandedSection === 'anger' ? (
              <ChevronDown className="w-4 h-4 text-[#86868B]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#86868B]" />
            )}
          </button>

          {expandedSection === 'anger' && (
            <div className="space-y-2.5">
              {(['furious', 'angry', 'annoyed', 'calm'] as const).map((level) => {
                const count = angerCounts[level];
                const isSelected = selectedAnger === level;
                const colors = {
                  furious: { bg: '#FF3B30', badge: 'badge-red' },
                  angry: { bg: '#FF9500', badge: 'badge-orange' },
                  annoyed: { bg: '#FFCC00', badge: 'badge-orange' },
                  calm: { bg: '#34C759', badge: 'badge-green' },
                };

                return (
                  <button
                    key={level}
                    onClick={() => onAngerChange(isSelected ? null : level)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#007AFF] text-white shadow-md'
                        : 'hover:bg-[#F5F5F7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: isSelected ? 'white' : colors[level].bg }}
                      />
                      <span className={`text-[15px] font-medium capitalize ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                        {level}
                      </span>
                    </div>
                    <span
                      className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-[#007AFF]'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* State Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('state')}
            className="flex items-center justify-between w-full mb-3 text-[#1D1D1F] font-semibold hover:text-[#007AFF] transition-colors text-[15px]"
          >
            <span>State</span>
            {expandedSection === 'state' ? (
              <ChevronDown className="w-4 h-4 text-[#86868B]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#86868B]" />
            )}
          </button>

          {expandedSection === 'state' && (
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {Object.entries(stateCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([state, count]) => {
                  const isSelected = selectedState === state;

                  return (
                    <button
                      key={state}
                      onClick={() => onStateChange(isSelected ? null : state)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#007AFF] text-white shadow-md'
                          : 'hover:bg-[#F5F5F7]'
                      }`}
                    >
                      <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                        {state}
                      </span>
                      <span className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-[#007AFF]'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
