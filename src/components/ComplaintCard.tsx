import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ComplaintWithMetadata } from '../types/complaints';
import { formatRelativeTime, getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface ComplaintCardProps {
  complaint: ComplaintWithMetadata;
  isSelected: boolean;
  onClick: () => void;
  isFocused?: boolean;
}

export function ComplaintCard({ complaint, isSelected, onClick, isFocused }: ComplaintCardProps) {
  // Get first customer message for preview
  const firstMessage = complaint.thread.find((m) => m.role === 'customer')?.message || '';
  const preview = firstMessage.length > 85 ? firstMessage.slice(0, 85) + '...' : firstMessage;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-all ${
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
          <div className="flex items-center gap-1.5 text-[12px] text-[#86868B]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(complaint.timestamp)}</span>
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
      </div>
    </motion.button>
  );
}
