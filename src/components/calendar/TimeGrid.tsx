import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TimeColumn } from './TimeColumn';
import type { Booking, TimeRange } from '@/types';
import type { DragState } from '@/hooks/useCalendarDrag';

interface TimeGridProps {
  days: Date[];
  hours: number[];
  bookings: Booking[];
  isInDragRange: (day: Date, hour: number, isFirstHalf: boolean) => boolean;
  onDragStart: (day: Date, hour: number, isFirstHalf: boolean) => void;
  onDragMove: (day: Date, clientY: number) => void;
  onBookingClick: (booking: Booking) => void;
  gridRef: React.RefObject<HTMLDivElement>;
  previewTimeRange?: TimeRange | null;
  isDragging?: boolean;
  dragStart?: DragState | null;
  dragEnd?: DragState | null;
  isValidTimeSlot?: boolean;
  isMobile?: boolean;
}

export function TimeGrid({
  days,
  hours,
  bookings,
  isInDragRange,
  onDragStart,
  onDragMove,
  onBookingClick,
  gridRef,
  previewTimeRange,
  isDragging,
  dragStart,
  dragEnd,
  isValidTimeSlot,
  isMobile = false
}: TimeGridProps) {
  const { t } = useTranslation();
  const cellHeight = isMobile ? '64px' : '48px';

  return (
    <div
      className="grid grid-cols-[2.5rem_repeat(7,1fr)] sm:grid-cols-[4rem_repeat(7,1fr)]"
      ref={gridRef}
    >
      <div className="col-span-1">
        {hours.map(hour => (
          <div
            key={hour}
            className="text-right pr-1 sm:pr-2 text-sm relative"
            style={{
              color: 'hsl(217 6% 44% / 1)',
              height: cellHeight
            }}
          >
            <span className="absolute -top-2.5 right-1 sm:right-2 whitespace-nowrap text-[10px] sm:text-sm">
              {hour > 7 && `${hour.toString().padStart(2, '0')}:00`}
            </span>
          </div>
        ))}
      </div>

      {days.map(day => (
        <TimeColumn
          key={format(day, 'yyyy-MM-dd')}
          day={day}
          hours={hours}
          bookings={bookings}
          isInDragRange={isInDragRange}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onBookingClick={onBookingClick}
          previewTimeRange={previewTimeRange}
          isDragging={isDragging}
          dragStart={dragStart}
          dragEnd={dragEnd}
          isValidTimeSlot={isValidTimeSlot}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}