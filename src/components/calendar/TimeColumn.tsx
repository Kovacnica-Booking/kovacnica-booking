import React from 'react';
import { format, parseISO, isSameDay, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BookingDisplay } from './BookingDisplay';
import { TimeSlot } from './TimeSlot';
import { PreviewTimeRange } from './PreviewTimeRange';
import { DragOverlay } from './DragOverlay';
import { CurrentTimeLine } from './CurrentTimeLine';
import type { Booking, TimeRange } from '@/types';
import type { DragState } from '@/hooks/useCalendarDrag';

interface TimeColumnProps {
  day: Date;
  hours: number[];
  bookings: Booking[];
  isInDragRange: (day: Date, hour: number, isFirstHalf: boolean) => boolean;
  onDragStart: (day: Date, hour: number, isFirstHalf: boolean) => void;
  onDragMove: (day: Date, clientY: number) => void;
  onBookingClick: (booking: Booking) => void;
  previewTimeRange?: TimeRange | null;
  isDragging?: boolean;
  dragStart?: DragState | null;
  dragEnd?: DragState | null;
  isValidTimeSlot?: boolean;
  isMobile?: boolean;
}

export function TimeColumn({
  day,
  hours,
  bookings,
  isInDragRange,
  onDragStart,
  onDragMove,
  onBookingClick,
  previewTimeRange,
  isDragging,
  dragStart,
  dragEnd,
  isValidTimeSlot = true,
  isMobile = false
}: TimeColumnProps) {
  const { t } = useTranslation();
  const cellHeight = isMobile ? '64px' : '48px';

  const dayBookings = bookings.filter(booking => {
    const bookingStart = new Date(booking.start_time);
    return isSameDay(bookingStart, day);
  });

  return (
    <div
      className="col-span-1 border-l relative"
      style={{ borderColor: 'hsl(217 6% 26% / 1)' }}
      data-day={format(day, 'yyyy-MM-dd')}
      onMouseMove={!isMobile ? (e) => onDragMove(day, e.clientY) : undefined}
    >
      {hours.map(hour => (
        <div
          key={hour}
          className="relative"
          style={{ height: cellHeight }}
        >
          <div 
            className="absolute inset-x-0 -top-px h-px" 
            style={{ backgroundColor: 'hsl(217 6% 26% / 1)' }} 
          />
          <TimeSlot
            isInDragRange={isInDragRange(day, hour, true)}
            onDragStart={() => onDragStart(day, hour, true)}
            position="top"
            isMobile={isMobile}
            day={day}
            hour={hour}
          />
          <TimeSlot
            isInDragRange={isInDragRange(day, hour, false)}
            onDragStart={() => onDragStart(day, hour, false)}
            position="bottom"
            isMobile={isMobile}
            day={day}
            hour={hour}
          />
        </div>
      ))}

      {dayBookings.map(booking => (
        <BookingDisplay
          key={booking.id}
          booking={booking}
          onBookingClick={onBookingClick}
          isMobile={isMobile}
        />
      ))}

      {isDragging && dragStart && dragEnd && isSameDay(dragStart.day, day) && (
        <DragOverlay
          dragStart={dragStart}
          dragEnd={dragEnd}
          isValid={isValidTimeSlot}
          isMobile={isMobile}
        />
      )}

      {previewTimeRange && isSameDay(previewTimeRange.start, day) && (
        <PreviewTimeRange timeRange={previewTimeRange} isValid={true} isMobile={isMobile} />
      )}

      {isToday(day) && <CurrentTimeLine isMobile={isMobile} />}
    </div>
  );
}