import { useState, useEffect } from 'react';
import { X, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComplaintWithMetadata } from '../types/complaints';
import { getCategoryEmoji, normalizeCategoryName } from '../utils/formatters';

interface LiveChatViewProps {
  complaint: ComplaintWithMetadata;
  onClose: () => void;
}

export function LiveChatView({ complaint, onClose }: LiveChatViewProps) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset when complaint changes
    setVisibleMessages(0);

    // Show messages one by one with typing indicator
    const showNextMessage = (index: number) => {
      if (index >= complaint.thread.length) return;

      const currentMessage = complaint.thread[index];
      const nextMessage = complaint.thread[index + 1];

      // Show typing indicator for BK messages (except welcome message)
      if (currentMessage.role === 'customer' && nextMessage?.role === 'bk') {
        setTimeout(() => {
          setIsTyping(true);
        }, 1200);

        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(index + 2);
          showNextMessage(index + 2);
        }, 3500);
      } else {
        setTimeout(() => {
          setVisibleMessages(index + 1);
          showNextMessage(index + 1);
        }, 1800);
      }
    };

    // Start the animation
    const timer = setTimeout(() => {
      showNextMessage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [complaint]);

  // Get anger color
  const getAngerColor = (category: string) => {
    switch (category) {
      case 'furious': return '#FF3B30';
      case 'angry': return '#FF9500';
      case 'annoyed': return '#FFCC00';
      case 'calm': return '#34C759';
      default: return '#8E8E93';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#FFE5CC] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D62300] via-[#FF8732] to-[#D62300] px-6 py-5 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                  {complaint.customer.name}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{complaint.customer.phone}</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{complaint.location.city}, {complaint.location.stateAbbr}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/40"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date */}
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold">
              📅 {complaint.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            {/* Anger Level with Bar */}
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center gap-2">
              <span className="text-lg">{complaint.anger.emoji}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-xs font-bold uppercase tracking-wide">{complaint.anger.category}</span>
                <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(complaint.anger.level / 10) * 100}%`,
                      backgroundColor: getAngerColor(complaint.anger.category)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold">
              {getCategoryEmoji(complaint.category)} {normalizeCategoryName(complaint.category)}
            </div>

            {/* Priority */}
            {(complaint.priority === 'high' || complaint.anger.category === 'furious') && (
              <div className="px-3 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm border border-white/40 text-white text-xs font-bold shadow-lg animate-pulse">
                🔴 PRIORITY
              </div>
            )}

            {/* ID */}
            <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold">
              ID #{complaint.id}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {complaint.thread.slice(0, visibleMessages).map((message, index) => {
            const isCustomer = message.role === 'customer';
            const isWelcome = message.type === 'welcome';
            const isFinal = message.type === 'final';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isCustomer ? -50 : 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] ${isCustomer ? 'items-start' : 'items-end'} flex flex-col gap-1`}>
                  {/* Bubble */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`px-5 py-3.5 rounded-3xl shadow-lg ${
                      isCustomer
                        ? 'bg-gradient-to-br from-[#4A5568] to-[#2D3748] text-white rounded-bl-md'
                        : isWelcome
                        ? 'bg-gradient-to-br from-[#FFD93D] to-[#FFB03B] text-[#4A2800] rounded-br-md border-2 border-[#FF8732]'
                        : isFinal
                        ? 'bg-gradient-to-br from-[#FF8732] to-[#D62300] text-white rounded-br-md shadow-2xl'
                        : 'bg-gradient-to-br from-[#FF8732] to-[#FF6B35] text-white rounded-br-md'
                    }`}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
                  >
                    <p className={`text-[16px] leading-relaxed whitespace-pre-wrap ${
                      isCustomer ? 'font-normal' : 'font-medium'
                    }`} style={{ letterSpacing: '-0.01em' }}>
                      {message.message}
                    </p>

                    {/* Animation badge for final message */}
                    {message.animation && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mt-3 flex items-center gap-2 px-3 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/40"
                      >
                        <span className="text-lg">👑</span>
                        <span className="text-xs font-bold text-white">Escalated to President</span>
                      </motion.div>
                    )}

                    {/* Welcome message badge */}
                    {isWelcome && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mt-3 flex items-center gap-2 px-3 py-2 rounded-full bg-[#4A2800]/20 border border-[#4A2800]/30"
                      >
                        <span className="text-sm">🤖</span>
                        <span className="text-xs font-bold text-[#4A2800]">Automated Message</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Timestamp */}
                  <span className="text-[11px] text-[#8B7355] px-3 font-normal opacity-70" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}>
                    {new Date(complaint.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex justify-end"
              >
                <div className="bg-gradient-to-br from-[#FF8732] to-[#FF6B35] px-7 py-4 rounded-3xl rounded-br-md shadow-lg">
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
