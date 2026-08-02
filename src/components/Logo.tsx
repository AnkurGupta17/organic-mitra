import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  isHindi?: boolean;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 40, 
  showText = false, 
  isHindi = false,
  variant = 'dark'
}) => {
  const primaryColor = variant === 'dark' ? '#2D5A27' : '#FFFFFF';
  const accentColor = '#FFB800';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        style={{ width: size, height: size }} 
        className="relative flex items-center justify-center shrink-0"
      >
        {/* Outer Circle / Shield */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Circle */}
          <circle cx="50" cy="50" r="48" fill={variant === 'dark' ? '#F0F7EE' : 'rgba(255,255,255,0.2)'} />
          
          {/* Stylized Leaf / Sprout */}
          <path 
            d="M50 85C50 85 50 60 50 45C50 30 65 15 80 15C80 15 65 15 50 30C35 15 20 15 20 15C35 15 50 30 50 45" 
            stroke={primaryColor} 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Central Stem */}
          <path 
            d="M50 85V45" 
            stroke={primaryColor} 
            strokeWidth="6" 
            strokeLinecap="round" 
          />

          {/* Sun / Growth Sparkle */}
          <circle cx="80" cy="20" r="8" fill={accentColor} />
          <path d="M80 8V12M80 28V32M68 20H72M88 20H92" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 
            className={`font-black tracking-tight leading-none ${variant === 'dark' ? 'text-organic-green' : 'text-white'}`}
            style={{ fontSize: size * 0.5 }}
          >
            {isHindi ? 'ऑर्गेनिक मित्र' : 'Organic Mitra'}
          </h1>
          <p 
            className={`font-bold uppercase tracking-[0.2em] opacity-70 ${variant === 'dark' ? 'text-organic-green' : 'text-white'}`}
            style={{ fontSize: size * 0.18, marginTop: size * 0.05 }}
          >
            {isHindi ? 'कृषि विज्ञान केंद्र जबलपुर' : 'Krishi Vigyan Kendra Jabalpur'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
