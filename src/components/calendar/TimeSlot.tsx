import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { startOfDay, isBefore } from 'date-fns';

interface TimeSlotProps {
  isInDragRange: boolean;
  onDragStart: () => void;
  position: 'top' | 'bottom';
  isMobile?: boolean;
  day: Date;
  hour: number;
}

export function TimeSlot({ isInDragRange, onDragStart, position, isMobile = false, day, hour }: TimeSlotProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const today = startOfDay(new Date());
  const slotDay = startOfDay(day);
  const isPastDay = isBefore(slotDay, today);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPastDay) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (isMobile) {
      e.preventDefault();
      onDragStart();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPastDay) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!isMobile) {
      onDragStart();
    }
  };

  return (
    <div
      className={`absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-1/2 ${isPastDay ? 'cursor-not-allowed' : ''} relative`}
      onMouseDown={handleMouseDown}
      onClick={isMobile ? handleClick : undefined}
      onMouseEnter={() => isPastDay && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && isPastDay && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-md shadow-lg border border-[#333333] whitespace-nowrap z-50 pointer-events-none">
          {t('bookings.pastSlotTooltip')}
        </div>
      )}
    </div>
  );
}