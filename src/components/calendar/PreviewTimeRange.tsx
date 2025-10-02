import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { TimeRange } from '@/types';

interface PreviewTimeRangeProps {
  timeRange: TimeRange;
  isValid?: boolean;
}

export function PreviewTimeRange({ timeRange, isValid = true }: PreviewTimeRangeProps) {
  const { t } = useTranslation();
  const cellHeight = window.innerWidth < 640 ? 64 : 48;
  const startHour = timeRange.start.getHours();
  const startMinute = timeRange.start.getMinutes();
  const top = (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);
  const duration = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
  const height = duration * (cellHeight / 60);

  return (
    <div
      className="absolute left-0 w-11/12 px-1.5 sm:px-2 overflow-hidden z-10 rounded-md ml-px select-none"
      style={{
        top: `${top + 1}px`,
        height: `${height - 2}px`,
        backgroundColor: isValid ? 'hsl(217 91% 60% / 0.8)' : 'hsl(0 91% 60% / 0.8)',
        color: 'white'
      }}
    >
      <div className="flex flex-col text-[10px] sm:text-xs">
        <span className="font-medium">{t('bookings.newBooking')}</span>
        <span>{format(timeRange.start, 'HH:mm')} – {format(timeRange.end, 'HH:mm')}</span>
      </div>
    </div>
  );
}