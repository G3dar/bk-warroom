export function Loader() {
  const words = ["LET'S", "MAKE", "SOMETHING", "REAL."];

  return (
    <div className="fixed inset-0 bg-[#3D2817] flex items-center justify-center z-50">
      <div className="max-w-4xl w-full px-6 sm:px-12 -mt-6 sm:-mt-12">
        {/* Animated Text */}
        <div className="relative">
          {/* Opening Quote */}
          <div className="text-[#FF8732] text-4xl sm:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 animate-fade-in" style={{ fontFamily: 'Rubik, sans-serif' }}>
            "
          </div>

          {/* Main Text */}
          <div className="space-y-0.5 sm:space-y-1">
            {words.map((word, index) => (
              <div
                key={word}
                className="text-[#F5E6D3] font-black uppercase overflow-hidden"
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontSize: word === 'REAL.' ? 'clamp(3rem, 8vw, 6rem)' : 'clamp(2.5rem, 7vw, 5rem)',
                  lineHeight: '1',
                  letterSpacing: '-0.02em',
                  animation: `slide-in 0.8s ease-out ${index * 0.15}s both`,
                }}
              >
                {word}
                {word === 'REAL.' && (
                  <div
                    className="h-1 sm:h-1.5 bg-[#FF8732] mt-1 sm:mt-2"
                    style={{
                      animation: `expand 0.6s ease-out ${(words.length * 0.15) + 0.3}s both`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Closing Quote */}
          <div
            className="text-[#FF8732] text-4xl sm:text-5xl lg:text-6xl font-black text-right mt-2 sm:mt-3"
            style={{
              fontFamily: 'Rubik, sans-serif',
              animation: `fade-in 0.5s ease-out ${(words.length * 0.15) + 0.5}s both`,
            }}
          >
            "
          </div>
        </div>

        {/* Loading indicator */}
        <div
          className="flex items-center justify-center gap-2 mt-12"
          style={{
            animation: `fade-in 0.5s ease-out ${(words.length * 0.15) + 0.8}s both`,
          }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF8732] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2.5 h-2.5 bg-[#FF8732] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2.5 h-2.5 bg-[#FF8732] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(50px) translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes expand {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
