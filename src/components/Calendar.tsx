import React, { useRef } from 'react';
import { startOfWeek, addDays, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CalendarHeader } from './calendar/CalendarHeader';
import { TimeGrid } from './calendar/TimeGrid';
import { useCalendarDrag } from '@/hooks/useCalendarDrag';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { Booking, Room, TimeRange } from '@/types';

interface CalendarProps {
  selectedDate: Date;
  bookings: Booking[];
  selectedRoom: Room;
  onTimeRangeSelect: (range: TimeRange, position: { top: number; left: number; right: number; width: number }) => void;
  onBookingClick: (booking: Booking) => void;
  previewTimeRange?: TimeRange | null;
}

export function Calendar({
  selectedDate,
  bookings,
  selectedRoom,
  onTimeRangeSelect,
  onBookingClick,
  previewTimeRange
}: CalendarProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  // Filter bookings by selected room
  const roomBookings = bookings.filter(booking => booking.room === selectedRoom);

  const isTimeSlotAvailable = (start: Date, end: Date) => {
    return !roomBookings.some(booking => {
      const bookingStart = parseISO(booking.start_time);
      const bookingEnd = parseISO(booking.end_time);
      
      return (
        (start >= bookingStart && start < bookingEnd) ||
        (end > bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      );
    });
  };

  const {
    gridRef,
    isDragging,
    dragStart,
    dragEnd,
    handleDragStart,
    handleDragMove,
    isInDragRange,
    hasMoved,
    isValidTimeSlot
  } = useCalendarDrag(isTimeSlotAvailable, onTimeRangeSelect, isMobile);

  return (
    <div className="flex flex-col flex-1">
      <CalendarHeader days={days} />

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'auto' }}>
        <TimeGrid
          days={days}
          hours={hours}
          bookings={roomBookings}
          isInDragRange={isInDragRange}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onBookingClick={onBookingClick}
          gridRef={gridRef}
          previewTimeRange={previewTimeRange}
          isDragging={isDragging}
          dragStart={dragStart}
          dragEnd={dragEnd}
          isValidTimeSlot={isValidTimeSlot}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}