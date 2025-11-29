import { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComplaintWithMetadata } from '../types/complaints';

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
        }, 800);

        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(index + 2);
          showNextMessage(index + 2);
        }, 2000);
      } else {
        setTimeout(() => {
          setVisibleMessages(index + 1);
          showNextMessage(index + 1);
        }, 1200);
      }
    };

    // Start the animation
    const timer = setTimeout(() => {
      showNextMessage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [complaint]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#FFE5CC] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D62300] via-[#FF8732] to-[#D62300] px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{complaint.customer.name}</h2>
                <p className="text-white/80 text-sm">{complaint.customer.phone}</p>
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
                    className={`px-5 py-3 rounded-3xl shadow-lg ${
                      isCustomer
                        ? 'bg-gradient-to-br from-[#4A5568] to-[#2D3748] text-white rounded-bl-md'
                        : isWelcome
                        ? 'bg-gradient-to-br from-[#FFD93D] to-[#FFB03B] text-[#4A2800] rounded-br-md border-2 border-[#FF8732]'
                        : isFinal
                        ? 'bg-gradient-to-br from-[#FF8732] to-[#D62300] text-white rounded-br-md shadow-2xl'
                        : 'bg-gradient-to-br from-[#FF8732] to-[#FF6B35] text-white rounded-br-md'
                    }`}
                  >
                    <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                      isCustomer ? 'font-normal' : 'font-medium'
                    }`}>
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
                  <span className="text-xs text-[#8B7355] px-3 font-medium">
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
                <div className="bg-gradient-to-br from-[#FF8732] to-[#FF6B35] px-6 py-4 rounded-3xl rounded-br-md shadow-lg">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2.5 h-2.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2.5 h-2.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2.5 h-2.5 bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white/50 backdrop-blur-sm border-t border-[#FF8732]/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              complaint.anger.category === 'furious' ? 'bg-red-100 text-red-700' :
              complaint.anger.category === 'angry' ? 'bg-orange-100 text-orange-700' :
              complaint.anger.category === 'annoyed' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {complaint.anger.category.toUpperCase()}
            </div>
            <span className="text-sm text-[#8B7355] font-medium">
              {complaint.location.city}, {complaint.location.stateAbbr}
            </span>
          </div>
          <span className="text-xs text-[#8B7355] font-bold">
            ID #{complaint.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
