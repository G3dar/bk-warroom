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

  // Get theme colors based on anger level
  const getTheme = (category: string) => {
    switch (category) {
      case 'furious':
        return {
          bg: 'from-[#FFE5E5] via-[#FFF0F0] to-[#FFDBDB]', // Light red/pink background
          header: 'from-[#DC2626] via-[#EF4444] to-[#DC2626]', // Deep red header
          accent: '#DC2626',
        };
      case 'angry':
        return {
          bg: 'from-[#FFF4E5] via-[#FFF8F0] to-[#FFEDD5]', // Light orange background
          header: 'from-[#EA580C] via-[#F97316] to-[#EA580C]', // Orange header
          accent: '#EA580C',
        };
      case 'annoyed':
        return {
          bg: 'from-[#FEFCE8] via-[#FFF9E6] to-[#FEF3C7]', // Light yellow background
          header: 'from-[#CA8A04] via-[#EAB308] to-[#CA8A04]', // Yellow/gold header
          accent: '#CA8A04',
        };
      case 'calm':
        return {
          bg: 'from-[#ECFDF5] via-[#F0FDF4] to-[#D1FAE5]', // Light green background
          header: 'from-[#059669] via-[#10B981] to-[#059669]', // Green header
          accent: '#059669',
        };
      default:
        return {
          bg: 'from-[#F5E6D3] via-[#FFF8F0] to-[#FFE5CC]',
          header: 'from-[#D62300] via-[#FF8732] to-[#D62300]',
          accent: '#FF8732',
        };
    }
  };

  const theme = getTheme(complaint.anger.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.bg} flex flex-col`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.header} px-3 sm:px-6 py-3 sm:py-5 shadow-lg`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-2 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-lg flex-shrink-0">
                <span className="text-2xl sm:text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg sm:text-xl tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                  {complaint.customer.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-xs sm:text-sm font-medium">{complaint.customer.phone}</span>
                  </div>
                  <span className="hidden sm:inline text-white/60">•</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-xs sm:text-sm font-medium">{complaint.location.city}, {complaint.location.stateAbbr}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/40 flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
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
                <div className={`max-w-[85%] sm:max-w-[70%] ${isCustomer ? 'items-start' : 'items-end'} flex flex-col gap-1`}>
                  {/* Bubble */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-3xl shadow-lg rounded-br-md ${
                      isCustomer
                        ? 'bg-gradient-to-br from-[#4A5568] to-[#2D3748] text-white rounded-bl-md'
                        : isWelcome
                        ? 'text-[#4A2800] border-2'
                        : 'text-white shadow-2xl'
                    }`}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                      ...(!isCustomer && (isWelcome ? {
                        background: 'linear-gradient(to bottom right, #FFD93D, #FFB03B)',
                        borderColor: theme.accent
                      } : isFinal ? {
                        background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}DD)`
                      } : {
                        background: `linear-gradient(to bottom right, ${theme.accent}EE, ${theme.accent}CC)`
                      }))
                    }}
                  >
                    <p className={`text-[14px] sm:text-[16px] leading-relaxed whitespace-pre-wrap ${
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
                <div
                  className="px-7 py-4 rounded-3xl rounded-br-md shadow-lg"
                  style={{ background: `linear-gradient(to bottom right, ${theme.accent}EE, ${theme.accent}CC)` }}
                >
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
