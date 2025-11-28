export function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-transparent border-t-orange-500 border-r-red-500 animate-spin"></div>
          </div>

          {/* Middle pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-transparent border-b-orange-400 border-l-red-400 animate-spin-slow"></div>
          </div>

          {/* Center BK Logo */}
          <div className="relative z-10 w-40 h-40 flex items-center justify-center">
            <div className="relative">
              {/* Flame effect background */}
              <div className="absolute -inset-4 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-400 rounded-full blur-xl opacity-60 animate-pulse-slow"></div>

              {/* BK Text */}
              <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 rounded-2xl px-8 py-6 shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-6xl font-black text-white tracking-tighter animate-pulse-subtle">
                  BK
                </div>
              </div>

              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-lg"></div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse" style={{ animationDelay: '0.5s' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 animate-gradient">
            BK ELEVATION
          </h2>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg font-semibold text-gray-600">Loading War Room</p>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto mt-4">
            <div className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-progress"></div>
          </div>
        </div>

        {/* Flame particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="flame-particle"></div>
          <div className="flame-particle" style={{ animationDelay: '0.5s', left: '60%' }}></div>
          <div className="flame-particle" style={{ animationDelay: '1s', left: '80%' }}></div>
          <div className="flame-particle" style={{ animationDelay: '1.5s', left: '20%' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes flame-rise {
          0% {
            bottom: 0;
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: translateX(20px) scale(0.5);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 1.5s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .flame-particle {
          position: absolute;
          bottom: 0;
          left: 40%;
          width: 8px;
          height: 8px;
          background: linear-gradient(to top, #FF3B30, #FF8732, #FFCC00);
          border-radius: 50%;
          animation: flame-rise 3s ease-in infinite;
          filter: blur(2px);
        }
      `}</style>
    </div>
  );
}
