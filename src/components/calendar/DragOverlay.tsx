import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { DragState } from '@/hooks/useCalendarDrag';

interface DragOverlayProps {
  dragStart: DragState;
  dragEnd: DragState;
  isValid: boolean;
  isMobile?: boolean;
}

export function DragOverlay({ dragStart, dragEnd, isValid, isMobile = false }: DragOverlayProps) {
  const { t } = useTranslation();
  const cellHeight = isMobile ? 64 : 48;

  const startTime = dragStart.time < dragEnd.time ? dragStart.time : dragEnd.time;
  const endTime = dragStart.time < dragEnd.time ? dragEnd.time : dragStart.time;
  
  const startHour = startTime.getHours();
  const startMinute = startTime.getMinutes();
  const top = (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const height = duration * (cellHeight / 60);

  return (
    <div
      className="absolute left-0 w-11/12 px-1.5 sm:px-2 overflow-hidden z-30 rounded-md ml-px backdrop-blur-[2px] transition-colors duration-150"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: isValid ? 'hsla(217, 91%, 60%, 0.9)' : 'hsla(0, 91%, 60%, 0.9)',
        border: `2px solid ${isValid ? 'hsl(217, 91%, 50%)' : 'hsl(0, 91%, 50%)'}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex flex-col text-white text-[10px] sm:text-xs">
        <span className="font-medium">{t('bookings.newBooking')}</span>
        <span>{format(startTime, 'HH:mm')} – {format(endTime, 'HH:mm')}</span>
      </div>
    </div>
  );
}