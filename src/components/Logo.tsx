import React from 'react';

export function Logo() {
  return (
    <div 
      className="relative group"
      style={{ width: 'fit-content' }}
    >
      <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2143_2775)">
          <path d="M22.1064 1.00635C33.7665 1.00656 43.2098 10.4072 43.21 21.9927C43.21 33.578 33.7666 42.9798 22.1064 42.98C10.4448 42.98 1 33.5781 1 21.9927C1.0002 10.4075 10.4449 1.00635 22.1064 1.00635Z" fill="#1B1B1D" stroke="#3e4146" strokeWidth="1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M25.4959 20.674L28.938 17.2804H23.9854L17.9599 23.22V13.2231H14.4579V28.9229H17.9599V23.4701L20.3096 25.7866L23.0193 23.1149L28.9539 28.965L31.4302 26.5235L25.4959 20.674Z" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_2143_2775">
            <rect width="44.3165" height="44" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <div 
        className="fixed opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1 rounded-md text-sm whitespace-nowrap z-50"
        style={{ 
          backgroundColor: 'hsl(0, 0%, 90%)',
          color: 'hsl(0, 0%, 10%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        Vibe‑Forged for Kovačnica by Darko 🛠️
      </div>
    </div>
  );
}