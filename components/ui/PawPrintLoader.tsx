"use client";
import { useTranslations } from "next-intl";

export default function PawPrintLoader() {
  const t = useTranslations('general');

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-gradient-to-br from-[#fff9ec] via-[#fff1b8] to-[#fef3c7] relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#d4a017] blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#f59e0b] blur-3xl"></div>
      </div>

      {/* Main loader container */}
      <div className="relative">
        {/* Premium card container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d4a017]/20 p-12 relative overflow-hidden">
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fef3c7]/30 to-transparent rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Animated paw container */}
            <div className="relative w-24 h-24 mb-6">
              
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#d4a017] border-r-[#f59e0b] animate-spin"></div>
              
              {/* Left paw */}
              <div className="absolute left-[25%] top-[40%] animate-bounce" style={{ animationDelay: '0s', animationDuration: '1.2s' }}>
                <PawIcon />
              </div>
              
              {/* Right paw */}
              <div className="absolute right-[25%] top-[50%] animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.2s' }}>
                <PawIcon />
              </div>
              
              {/* Center glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#facc15] to-[#d4a017] rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Premium text */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#d4a017] to-[#f59e0b] bg-clip-text text-transparent">
                {t('loading')}
              </h3>
              <p className="text-sm text-[#92400e] font-medium">
                {t('petOnWay')}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-[#d4a017] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#d4a017] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#d4a017] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4a017]/30 rounded-tl-lg"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4a017]/30 rounded-tr-lg"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4a017]/30 rounded-bl-lg"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4a017]/30 rounded-br-lg"></div>
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/10 blur-xl rounded-full"></div>
      </div>

      <style jsx>{`
        .paw-left {
          animation: leftStep 1s ease-in-out infinite;
        }

        .paw-right {
          animation: rightStep 1s ease-in-out infinite;
        }

        @keyframes leftStep {
          0% {
            transform: translateY(0px) scale(0.9) rotate(-10deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) scale(1.1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) scale(0.9) rotate(-10deg);
            opacity: 0.5;
          }
        }

        @keyframes rightStep {
          0% {
            transform: translateY(-10px) scale(1.1) rotate(10deg);
            opacity: 1;
          }
          50% {
            transform: translateY(0px) scale(0.9) rotate(0deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-10px) scale(1.1) rotate(10deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* Premium paw icon with gradient */
function PawIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-lg">
      <defs>
        <linearGradient id="pawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="pawShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      <g fill="url(#pawGradient)" filter="url(#pawShadow)">
        {/* Main paw pad */}
        <ellipse cx="12" cy="17" rx="3.5" ry="4.5" />
        {/* Toe pads */}
        <ellipse cx="7.5" cy="9" rx="2" ry="3" />
        <ellipse cx="16.5" cy="9" rx="2" ry="3" />
        <ellipse cx="5" cy="13" rx="1.5" ry="2.2" />
        <ellipse cx="19" cy="13" rx="1.5" ry="2.2" />
      </g>
    </svg>
  );
}