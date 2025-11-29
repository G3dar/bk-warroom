import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ComplaintWithMetadata } from '../types/complaints';
import { getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface SidebarProps {
  complaints: ComplaintWithMetadata[];
  selectedCategory: string | null;
  selectedAnger: string | null;
  selectedState: string | null;
  selectedKeywords: string[];
  onCategoryChange: (category: string | null) => void;
  onAngerChange: (anger: string | null) => void;
  onStateChange: (state: string | null) => void;
  onKeywordsChange: (keywords: string[]) => void;
}

export function Sidebar({
  complaints,
  selectedCategory,
  selectedAnger,
  selectedState,
  selectedKeywords,
  onCategoryChange,
  onAngerChange,
  onStateChange,
  onKeywordsChange,
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

  // Calculate keyword counts
  const keywordCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    c.keywords?.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });

  // Get top 20 keywords by frequency
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword]) => keyword);

  const totalComplaints = complaints.length;

  // Handler for toggling keyword selection
  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onKeywordsChange(selectedKeywords.filter((k) => k !== keyword));
    } else {
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  return (
    <aside className="w-80 h-full bg-[#FAFAFA] border-r border-[#E5E5E5] flex flex-col overflow-hidden shadow-sm">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
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
                .map(([category, count], index) => {
                  const percentage = ((count / totalComplaints) * 100).toFixed(0);
                  const isSelected = selectedCategory === category;

                  // Color palette for different categories
                  const categoryColors = [
                    { bg: 'from-blue-500 to-blue-600', text: '#007AFF', shadow: 'rgba(0, 122, 255, 0.3)', lightBg: 'rgba(0, 122, 255, 0.08)' },
                    { bg: 'from-orange-500 to-orange-600', text: '#FF8732', shadow: 'rgba(255, 135, 50, 0.3)', lightBg: 'rgba(255, 135, 50, 0.08)' },
                    { bg: 'from-purple-500 to-purple-600', text: '#9333EA', shadow: 'rgba(147, 51, 234, 0.3)', lightBg: 'rgba(147, 51, 234, 0.08)' },
                    { bg: 'from-green-500 to-green-600', text: '#34C759', shadow: 'rgba(52, 199, 89, 0.3)', lightBg: 'rgba(52, 199, 89, 0.08)' },
                    { bg: 'from-red-500 to-red-600', text: '#FF3B30', shadow: 'rgba(255, 59, 48, 0.3)', lightBg: 'rgba(255, 59, 48, 0.08)' },
                    { bg: 'from-pink-500 to-pink-600', text: '#EC4899', shadow: 'rgba(236, 72, 153, 0.3)', lightBg: 'rgba(236, 72, 153, 0.08)' },
                    { bg: 'from-indigo-500 to-indigo-600', text: '#6366F1', shadow: 'rgba(99, 102, 241, 0.3)', lightBg: 'rgba(99, 102, 241, 0.08)' },
                    { bg: 'from-teal-500 to-teal-600', text: '#14B8A6', shadow: 'rgba(20, 184, 166, 0.3)', lightBg: 'rgba(20, 184, 166, 0.08)' },
                  ];
                  const colorScheme = categoryColors[index % categoryColors.length];

                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(isSelected ? null : category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r ' + colorScheme.bg + ' text-white shadow-lg'
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                      style={
                        isSelected
                          ? { boxShadow: `0 4px 20px ${colorScheme.shadow}` }
                          : { backgroundColor: colorScheme.lightBg }
                      }
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[20px]">{getCategoryEmoji(category)}</span>
                          <span className={`text-[15px] font-semibold ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                            {category}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                            {count}
                          </span>
                          <span className={`text-[11px] font-medium ${isSelected ? 'text-white/80' : 'text-[#86868B]'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            isSelected
                              ? 'bg-white shadow-lg'
                              : 'bg-gradient-to-r ' + colorScheme.bg
                          }`}
                          style={{
                            width: `${percentage}%`,
                            boxShadow: isSelected ? 'none' : `0 2px 8px ${colorScheme.shadow}`
                          }}
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
        <div className="mb-8">
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

        {/* Keywords Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('keywords')}
            className="flex items-center justify-between w-full mb-3 text-[#1D1D1F] font-semibold hover:text-[#007AFF] transition-colors text-[15px]"
          >
            <div className="flex items-center gap-2">
              <span>Keywords</span>
              {selectedKeywords.length > 0 && (
                <span className="bg-[#007AFF] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {selectedKeywords.length}
                </span>
              )}
            </div>
            {expandedSection === 'keywords' ? (
              <ChevronDown className="w-4 h-4 text-[#86868B]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#86868B]" />
            )}
          </button>

          {expandedSection === 'keywords' && (
            <div className="space-y-3">
              {selectedKeywords.length > 0 && (
                <div className="pb-2 border-b border-[#E5E5E5]">
                  <button
                    onClick={() => onKeywordsChange([])}
                    className="text-[13px] text-[#007AFF] hover:text-[#0051D5] font-semibold transition-colors"
                  >
                    Clear all ({selectedKeywords.length})
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto pr-1">
                {topKeywords.map((keyword) => {
                  const isSelected = selectedKeywords.includes(keyword);
                  const count = keywordCounts[keyword];

                  return (
                    <button
                      key={keyword}
                      onClick={() => toggleKeyword(keyword)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        isSelected
                          ? 'bg-[#007AFF] text-white shadow-md'
                          : 'bg-white text-[#1D1D1F] hover:bg-[#007AFF]/10 hover:text-[#007AFF] border border-[#E5E5E5]'
                      }`}
                    >
                      <span>{keyword}</span>
                      <span className={`ml-1.5 text-[11px] font-bold ${isSelected ? 'text-white/80' : 'text-[#86868B]'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
