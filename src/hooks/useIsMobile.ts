import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
  });

  useEffect(() => {
    const checkIsMobile = () => {
      const isSmallScreen = window.innerWidth < breakpoint;
      const isTouchDevice = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
      setIsMobile(isSmallScreen || isTouchDevice);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
