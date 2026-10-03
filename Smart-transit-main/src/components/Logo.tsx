import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const TransitLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_8px_rgba(76,215,246,0.5)]"
      >
        {/* Outer dark pill/circle frame */}
        <rect width="100" height="100" rx="24" fill="#050d25" />
        
        {/* Outer dashed guide circle */}
        <circle cx="50" cy="50" r="38" stroke="#2c344d" strokeWidth="1.5" strokeDasharray="4 4" />
        
        {/* Top-left Blue/Cyan Arc */}
        <path
          d="M 24 50 A 28 28 0 0 1 50 22"
          stroke="#4cd7f6"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Top-right Pink/Red Arc */}
        <path
          d="M 50 22 A 28 28 0 0 1 76 50"
          stroke="#ff6b81"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Bottom-right Green Arc */}
        <path
          d="M 76 50 A 28 28 0 0 1 35 74"
          stroke="#4edea3"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Diagonal dashed guide rod */}
        <line x1="33" y1="71" x2="67" y2="33" stroke="#4cd7f6" strokeWidth="2.5" strokeDasharray="3 3" />

        {/* Central Rings */}
        <circle cx="50" cy="50" r="14" stroke="#4cd7f6" strokeWidth="4" fill="#050d25" />
        <circle cx="50" cy="50" r="6" fill="#4cd7f6" />

        {/* Orbit Node 1 (Cyan Left) */}
        <circle cx="23" cy="50" r="5.5" fill="#4cd7f6" stroke="#050d25" strokeWidth="2" />
        
        {/* Orbit Node 2 (Red/Pink Top) */}
        <circle cx="50" cy="22" r="5.5" fill="#ff6b81" stroke="#050d25" strokeWidth="2" />

        {/* Orbit Node 3 (Green Right) */}
        <circle cx="76" cy="50" r="5.5" fill="#4edea3" stroke="#050d25" strokeWidth="2" />

        {/* Orbit Node 4 (Amber/Yellow Bottom Left) */}
        <circle cx="33" cy="71" r="5.5" fill="#f59e0b" stroke="#050d25" strokeWidth="2" />
      </svg>
    </div>
  );
};
