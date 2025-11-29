import { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star } from 'lucide-react';
import type { ComplaintWithMetadata } from '../types/complaints';
import { formatRelativeTime, getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface ComplaintCardProps {
  complaint: ComplaintWithMetadata;
  isSelected: boolean;
  onClick: () => void;
  isFocused?: boolean;
  onKeywordClick?: (keyword: string) => void;
  isStarred?: boolean;
  onStarToggle?: (id: number) => void;
  selectedKeywords?: string[];
}

// Color palette for keywords
const keywordColors = [
  { bg: '#007AFF', bgLight: 'rgba(0, 122, 255, 0.1)', border: '#007AFF' }, // blue
  { bg: '#FF8732', bgLight: 'rgba(255, 135, 50, 0.1)', border: '#FF8732' }, // orange
  { bg: '#9333EA', bgLight: 'rgba(147, 51, 234, 0.1)', border: '#9333EA' }, // purple
  { bg: '#34C759', bgLight: 'rgba(52, 199, 89, 0.1)', border: '#34C759' }, // green
  { bg: '#FF3B30', bgLight: 'rgba(255, 59, 48, 0.1)', border: '#FF3B30' }, // red
  { bg: '#EC4899', bgLight: 'rgba(236, 72, 153, 0.1)', border: '#EC4899' }, // pink
  { bg: '#6366F1', bgLight: 'rgba(99, 102, 241, 0.1)', border: '#6366F1' }, // indigo
  { bg: '#14B8A6', bgLight: 'rgba(20, 184, 166, 0.1)', border: '#14B8A6' }, // teal
];

// Generate consistent color for keyword based on its text
const getKeywordColor = (keyword: string) => {
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
  }
  return keywordColors[Math.abs(hash) % keywordColors.length];
};

export const ComplaintCard = memo(function ComplaintCard({ complaint, isSelected, onClick, isFocused, onKeywordClick, isStarred, onStarToggle, selectedKeywords = [] }: ComplaintCardProps) {
  // Get first customer message for preview
  const firstMessage = complaint.thread.find((m) => m.role === 'customer')?.message || '';
  const preview = firstMessage.length > 85 ? firstMessage.slice(0, 85) + '...' : firstMessage;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.005 }}
      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
        isSelected
          ? 'card-selected'
          : 'card'
      } ${isFocused ? 'ring-4 ring-[#007AFF]/30' : ''}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[17px] text-[#1D1D1F] truncate">{complaint.customer.name}</span>
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: complaint.anger.color }}
            />
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-[#86868B]">
            <span className="font-medium">{complaint.customer.phone}</span>
            <span className="text-[#C7C7CC]">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{complaint.location.city}, {complaint.location.stateAbbr}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 ml-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle?.(complaint.id);
              }}
              className="group p-1 rounded-lg hover:bg-yellow-100 transition-all"
              title={isStarred ? "Unstar message" : "Star message"}
            >
              <Star
                className={`w-5 h-5 transition-all ${
                  isStarred
                    ? 'fill-yellow-400 stroke-yellow-500'
                    : 'stroke-[#86868B] group-hover:stroke-yellow-500 group-hover:fill-yellow-100'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5 text-[12px] text-[#86868B]">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatRelativeTime(complaint.timestamp)}</span>
            </div>
          </div>
          <span className="text-[13px] font-semibold text-[#007AFF]">#{complaint.id}</span>
        </div>
      </div>

      {/* Message Preview */}
      <div className="mb-2">
        <p className="text-[14px] text-[#1D1D1F] line-clamp-2 leading-snug">
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="badge badge-gray text-[13px]">
          {getCategoryEmoji(complaint.category)} {normalizeCategoryName(complaint.category)}
        </span>
        {(complaint.priority === 'high' || complaint.anger.category === 'furious') && (
          <span className="badge badge-red pulse-subtle text-[13px]">
            🔴 Priority
          </span>
        )}
        {/* Display first 2-3 keywords */}
        {complaint.keywords?.slice(0, 3).map((keyword, idx) => {
          const color = getKeywordColor(keyword);
          const isKeywordSelected = selectedKeywords.includes(keyword);

          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onKeywordClick?.(keyword);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border-2 ${
                isKeywordSelected
                  ? 'text-white shadow-md scale-105'
                  : 'hover:scale-105 shadow-sm'
              }`}
              style={
                isKeywordSelected
                  ? { backgroundColor: color.bg, borderColor: color.bg }
                  : { backgroundColor: color.bgLight, borderColor: color.border, color: color.bg }
              }
            >
              {keyword}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
});
