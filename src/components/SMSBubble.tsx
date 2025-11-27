import { Crown, Image, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ThreadMessage } from '../types/complaints';

interface SMSBubbleProps {
  message: ThreadMessage;
  timestamp: string;
  index: number;
}

export function SMSBubble({ message, timestamp, index }: SMSBubbleProps) {
  const isCustomer = message.role === 'customer';

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

          {/* CEO Badge */}
          {message.animation && (
            <div className="mt-2 flex items-center gap-1 px-2 py-1 rounded bg-white/20 border border-white/30">
              <Crown className="w-3.5 h-3.5" fill="white" />
              <span className="text-xs font-semibold">Sent to CEO</span>
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 px-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
          <span className="text-[10px] text-[#86868B]">{timestamp}</span>
          {!isCustomer && (
            <CheckCheck className="w-3 h-3 text-[#007AFF]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
