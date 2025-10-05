import React from 'react';

interface TimeSlotProps {
  isInDragRange: boolean;
  onDragStart: () => void;
  position: 'top' | 'bottom';
}

export function TimeSlot({ isInDragRange, onDragStart, position }: TimeSlotProps) {
  return (
    <div
      className={`absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-1/2`}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    />
  );
}