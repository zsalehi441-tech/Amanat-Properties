
import React from 'react';

interface Props {
  className?: string;
  size?: number | string;
  hideText?: boolean;
}

const AmanatLogo: React.FC<Props> = ({ className, size = "100%", hideText = false }) => {
  return (
    <svg 
      viewBox="0 0 400 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ width: size, height: 'auto' }}
    >
      <defs>
        {/* Deep Premium Gold Gradient */}
        <linearGradient id="logoGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#926e2a" />
          <stop offset="20%" stopColor="#c5a059" />
          <stop offset="50%" stopColor="#f3e1ad" />
          <stop offset="80%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#7d5d21" />
        </linearGradient>
        
        {/* Metallic Shine Overlay */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.2" />
        </linearGradient>

        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="black" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#logoShadow)">
        {/* THE ARCHITECTURAL ICON */}
        <g transform="translate(140, 40) scale(0.6)">
          {/* Main Pillars */}
          {/* Left Pillar */}
          <rect x="0" y="50" width="18" height="150" fill="url(#logoGoldGradient)" />
          <rect x="-5" y="45" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Cap */}
          <rect x="-5" y="200" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Base */}
          
          {/* Right Pillar */}
          <rect x="182" y="50" width="18" height="150" fill="url(#logoGoldGradient)" />
          <rect x="177" y="45" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Cap */}
          <rect x="177" y="200" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Base */}
          
          {/* Center High Pillar Structure forming 'A' */}
          <rect x="91" y="0" width="18" height="200" fill="url(#logoGoldGradient)" />
          <rect x="86" y="-5" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Top Cap */}
          <rect x="86" y="200" width="28" height="8" fill="url(#logoGoldGradient)" /> {/* Bottom Base */}

          {/* Diagonal Connectors for 'A' */}
          <path d="M100 0 L191 200 H173 L100 40 L27 200 H9 L100 0 Z" fill="url(#logoGoldGradient)" />
          
          {/* Lintel / Crossbar */}
          <rect x="40" y="115" width="120" height="12" fill="url(#logoGoldGradient)" />
          
          {/* Interior Detail Lines (for 3D effect) */}
          <path d="M100 15 L175 185 H165 L100 50 L35 185 H25 L100 15 Z" fill="black" fillOpacity="0.1" />
        </g>

        {!hideText && (
          <g>
            {/* ENGLISH TEXT: AMANAT */}
            <text 
              x="200" 
              y="225" 
              textAnchor="middle" 
              fill="url(#logoGoldGradient)" 
              style={{ 
                fontFamily: 'serif', 
                fontSize: '48px', 
                fontWeight: 'bold', 
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              AMANAT
            </text>

            {/* DARI TEXT: امانت */}
            <text 
              x="200" 
              y="275" 
              textAnchor="middle" 
              fill="white" 
              style={{ 
                fontFamily: '"Noto Sans Arabic", sans-serif', 
                fontSize: '38px', 
                fontWeight: '500',
                letterSpacing: '0.05em'
              }}
            >
              امانت
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

export default AmanatLogo;
