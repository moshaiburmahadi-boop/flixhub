import React from 'react';

interface FlixDairyLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const FlixDairyLogo: React.FC<FlixDairyLogoProps> = ({
  className = 'h-8 sm:h-10 w-auto',
  showSubtitle = false,
}) => {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 580 165"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
              .flixdairy-title {
                font-family: 'Bebas Neue', Impact, 'Arial Black', sans-serif;
                font-size: 118px;
                font-weight: 900;
                letter-spacing: 3px;
                fill: #4D8BC9;
              }
            `}
          </style>
        </defs>

        {/* FLIXDAIRY in exact bold cornflower blue */}
        <text x="290" y="100" textAnchor="middle" className="flixdairy-title">
          FLIXDAIRY
        </text>

        {/* Curved Smile Arrow in Vibrant Red (under IXDAI) */}
        <g transform="translate(18, 5)">
          {/* Main swoosh arc */}
          <path
            d="M 145 116
               C 185 148, 245 170, 315 170
               C 375 170, 420 150, 442 128
               C 448 120, 440 114, 434 122
               C 410 144, 365 158, 312 158
               C 250 158, 195 138, 155 110
               C 150 106, 142 112, 145 116 Z"
            fill="#E52E2D"
          />
          {/* Arrowhead at the right tip */}
          <path
            d="M 432 124
               C 445 114, 460 104, 465 100
               C 468 98, 469 102, 467 106
               C 462 120, 452 140, 440 158
               C 437 162, 433 158, 434 154
               C 437 142, 438 132, 432 124 Z"
            fill="#E52E2D"
          />
        </g>
      </svg>

      {showSubtitle && (
        <span className="hidden sm:inline-block text-[9px] tracking-widest text-slate-400 font-semibold uppercase border-l border-slate-700 pl-2">
          Movie Vault
        </span>
      )}
    </div>
  );
};
