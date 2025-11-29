import { useState } from 'react';
import { Crown, Image, CheckCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ThreadMessage } from '../types/complaints';

interface SMSBubbleProps {
  message: ThreadMessage;
  timestamp: string;
  index: number;
  complaintId: number;
  onRatingChange?: (complaintId: number, messageIndex: number, rating: 'up' | 'down' | null) => void;
}

export function SMSBubble({ message, timestamp, index, complaintId, onRatingChange }: SMSBubbleProps) {
  const isCustomer = message.role === 'customer';
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const handleRating = (newRating: 'up' | 'down') => {
    const finalRating = rating === newRating ? null : newRating;
    setRating(finalRating);
    onRatingChange?.(complaintId, index, finalRating);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-3`}
    >
      <div className={`max-w-[70%] ${isCustomer ? 'items-start' : 'items-end'} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`${
            isCustomer
              ? 'bubble-received'
              : 'bubble-sent'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>

          {/* Attachment indicator */}
          {message.attachment && (
            <div className={`mt-2 flex items-center gap-2 px-2 py-1 rounded ${
              isCustomer ? 'bg-black/5' : 'bg-white/20'
            }`}>
              <Image className="w-3.5 h-3.5" />
              <span className="text-xs">Photo</span>
            </div>
          )}

          {/* President Badge */}
          {message.animation && (
            <div className="mt-2 flex items-center gap-1 px-2 py-1 rounded bg-white/20 border border-white/30">
              <Crown className="w-3.5 h-3.5" fill="white" />
              <span className="text-xs font-semibold">Sent to President</span>
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-2 mt-1 px-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
          <span className="text-[10px] text-[#86868B]">{timestamp}</span>
          {!isCustomer && (
            <>
              <CheckCheck className="w-3 h-3 text-[#007AFF]" />

              {/* Tone Rating Buttons */}
              <div className="flex items-center gap-1 ml-2 border-l border-[#E5E5E5] pl-2">
                <button
                  onClick={() => handleRating('up')}
                  className={`p-1 rounded-md transition-all hover:scale-110 ${
                    rating === 'up'
                      ? 'bg-green-100 text-green-600'
                      : 'text-[#86868B] hover:bg-green-50 hover:text-green-600'
                  }`}
                  title="Good tone"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${rating === 'up' ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleRating('down')}
                  className={`p-1 rounded-md transition-all hover:scale-110 ${
                    rating === 'down'
                      ? 'bg-red-100 text-red-600'
                      : 'text-[#86868B] hover:bg-red-50 hover:text-red-600'
                  }`}
                  title="Poor tone"
                >
                  <ThumbsDown className={`w-3.5 h-3.5 ${rating === 'down' ? 'fill-current' : ''}`} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
