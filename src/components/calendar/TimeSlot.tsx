import React from 'react';

interface TimeSlotProps {
  isInDragRange: boolean;
  onDragStart: () => void;
  position: 'top' | 'bottom';
  isMobile?: boolean;
}

export function TimeSlot({ isInDragRange, onDragStart, position, isMobile = false }: TimeSlotProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      onDragStart();
    }
  };

  return (
    <div
      className={`absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-1/2`}
      onMouseDown={!isMobile ? onDragStart : undefined}
      onClick={isMobile ? handleClick : undefined}
    />
  );
}