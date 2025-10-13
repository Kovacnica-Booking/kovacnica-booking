import React, { useState, useEffect } from 'react';

interface CurrentTimeLineProps {
  isMobile?: boolean;
}

export function CurrentTimeLine({ isMobile = false }: CurrentTimeLineProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  if (hours < 7 || hours >= 21) {
    return null;
  }

  const cellHeight = isMobile ? 64 : 48;
  const top = (hours - 7) * cellHeight + minutes * (cellHeight / 60);

  return (
    <>
      <div
        className="absolute left-0 w-2 h-2 rounded-full z-20"
        style={{
          top: `${top}px`,
          backgroundColor: 'hsl(0, 84%, 60%)',
          transform: 'translateY(-50%)'
        }}
      />
      <div
        className="absolute left-2 right-0 h-0.5 z-10"
        style={{
          top: `${top}px`,
          backgroundColor: 'hsl(0, 84%, 60%)',
          transform: 'translateY(-50%)'
        }}
      />
    </>
  );
}
