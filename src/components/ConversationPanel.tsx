import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Phone, MapPin, X, Info, Maximize2 } from 'lucide-react';
import { SMSBubble } from './SMSBubble';
import { LiveChatView } from './LiveChatView';
import type { ComplaintWithMetadata } from '../types/complaints';
import { getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface ConversationPanelProps {
  complaint: ComplaintWithMetadata | null;
  onClose: () => void;
  isFeedFocused: boolean;
  onFocusChange: (focused: boolean) => void;
}

export function ConversationPanel({ complaint, onClose, isFeedFocused, onFocusChange }: ConversationPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLiveView, setShowLiveView] = useState(false);

  // Handle tone ratings
  const handleToneRating = (complaintId: number, messageIndex: number, rating: 'up' | 'down' | null) => {
    console.log('Tone rating:', {
      complaintId,
      messageIndex,
      rating,
      timestamp: new Date().toISOString(),
    });
    // TODO: Send to API for model fine-tuning
  };

  useEffect(() => {
    if (!complaint || isFeedFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          container.scrollBy({ top: 100, behavior: 'smooth' });
          break;

        case 'ArrowUp':
          e.preventDefault();
          container.scrollBy({ top: -100, behavior: 'smooth' });
          break;

        case 'ArrowLeft':
          e.preventDefault();
          onFocusChange(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [complaint, isFeedFocused, onFocusChange]);
  if (!complaint) {
    return (
      <div className="w-full lg:w-[600px] h-full bg-white border-l border-[#E5E5E5] flex items-center justify-center">
        <div className="text-center p-4 sm:p-8">
          <div className="text-5xl sm:text-7xl mb-4">💬</div>
          <div className="text-lg sm:text-xl font-medium text-[#1D1D1F] mb-2">Select a Message</div>
          <div className="text-sm text-[#86868B]">Choose a conversation from the list to view details</div>
        </div>
      </div>
    );
  }

  // Generate fake timestamps for messages (spaced 1-3 min apart)
  const timestamps = complaint.thread.map((_, i) => {
    const minutesAgo = (complaint.thread.length - i) * 2;
    const messageTime = new Date(complaint.timestamp.getTime() + minutesAgo * 60 * 1000);
    return messageTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed lg:relative
          inset-0 lg:inset-auto
          w-full lg:w-[600px]
          h-full
          bg-white border-l flex flex-col z-30
          ${isFeedFocused ? 'border-[#E5E5E5]' : 'border-[#007AFF] lg:border-l-4'}
        `}
        onClick={() => onFocusChange(false)}
        data-tour="conversation-panel"
      >
        {/* Header */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-[#E5E5E5] bg-gradient-to-r from-white to-[#FAFAFA] shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1D1D1F] mb-1">
                {complaint.customer.name}
              </h2>
              <div className="flex flex-col gap-1 text-sm text-[#86868B]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{complaint.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {complaint.location.city}, {complaint.location.stateAbbr}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowLiveView(true)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#FF8732] to-[#D62300] text-white hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm"
                title="View Full Screen"
                data-tour="live-view-button"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Full Screen</span>
                <span className="sm:hidden">Full</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#86868B]" />
              </button>
            </div>
          </div>

          {/* Meta badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`badge ${
                complaint.anger.category === 'furious'
                  ? 'badge-red'
                  : complaint.anger.category === 'angry'
                  ? 'badge-orange'
                  : complaint.anger.category === 'annoyed'
                  ? 'badge-orange'
                  : 'badge-green'
              }`}
            >
              {complaint.anger.emoji} {complaint.anger.label}
            </span>

            <span className="badge badge-gray">
              {getCategoryEmoji(complaint.category)} {normalizeCategoryName(complaint.category)}
            </span>

            <span className="badge badge-blue">#{complaint.id}</span>

            {(complaint.priority === 'high' || complaint.anger.category === 'furious') && (
              <span className="badge badge-red pulse-subtle">🔴 Priority</span>
            )}
          </div>
        </div>

        {/* Conversation Thread */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 bg-gradient-to-b from-[#F8F8F8] to-[#FAFAFA]">
          <div className="mb-4 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-white text-xs text-[#86868B] shadow-sm">
              {complaint.timestamp.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          </div>

          {complaint.thread.map((message, index) => (
            <SMSBubble
              key={index}
              message={message}
              timestamp={timestamps[index]}
              index={index}
              complaintId={complaint.id}
              onRatingChange={handleToneRating}
            />
          ))}
        </div>

        {/* Extracted Data Card */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] bg-gradient-to-r from-[#FAFAFA] to-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-[#86868B]" />
            <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wide">
              Details
            </h3>
          </div>

          <div className="card p-3 space-y-2">
            {complaint.extracted_data.location && (
              <DataRow label="Location" value={complaint.extracted_data.location} />
            )}
            {complaint.extracted_data.issue && (
              <DataRow label="Issue" value={complaint.extracted_data.issue} />
            )}
            {complaint.extracted_data.time && (
              <DataRow label="Time" value={complaint.extracted_data.time} />
            )}
            {complaint.extracted_data.order_details && (
              <DataRow label="Order" value={complaint.extracted_data.order_details} />
            )}
            {complaint.extracted_data.employee_name && (
              <DataRow label="Employee" value={complaint.extracted_data.employee_name} />
            )}
            {complaint.extracted_data.manager_name && (
              <DataRow label="Manager" value={complaint.extracted_data.manager_name} />
            )}
            {complaint.extracted_data.resolution_requested && (
              <DataRow label="Resolution" value={complaint.extracted_data.resolution_requested} />
            )}
            {complaint.extracted_data.frequency && (
              <DataRow label="Frequency" value={complaint.extracted_data.frequency} />
            )}

            {/* Priority flags */}
            {complaint.extracted_data.health_concern && (
              <div className="badge badge-red w-full justify-start">⚠️ Health Concern</div>
            )}
            {complaint.extracted_data.discrimination_complaint && (
              <div className="badge badge-red w-full justify-start">⚠️ Discrimination</div>
            )}

            {/* Status */}
            {complaint.extracted_data.status && (
              <div className="pt-2 border-t border-[#E5E5E5] mt-2">
                <DataRow
                  label="Status"
                  value={complaint.extracted_data.status}
                  highlight
                />
              </div>
            )}

            {/* Keywords */}
            {complaint.keywords && complaint.keywords.length > 0 && (
              <div className="pt-2 border-t border-[#E5E5E5] mt-2">
                <div className="text-sm">
                  <span className="text-[#86868B] font-medium">Keywords</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {complaint.keywords.map((keyword, idx) => (
                      <span key={idx} className="badge badge-blue text-[11px]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Chat View Modal */}
        <AnimatePresence>
          {showLiveView && (
            <LiveChatView complaint={complaint} onClose={() => setShowLiveView(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function DataRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-[#86868B] font-medium min-w-[80px]">{label}</span>
      <span
        className={`text-right flex-1 ${
          highlight ? 'font-semibold text-[#007AFF]' : 'text-[#1D1D1F]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
