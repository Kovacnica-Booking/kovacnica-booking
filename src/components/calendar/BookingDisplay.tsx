import React from 'react';
import { format, parseISO, differenceInMinutes, isBefore } from 'date-fns';
import type { Booking } from '@/types';

interface BookingDisplayProps {
  booking: Booking;
  onBookingClick: (booking: Booking) => void;
  isMobile?: boolean;
}

export function BookingDisplay({ booking, onBookingClick, isMobile = false }: BookingDisplayProps) {
  const start = parseISO(booking.start_time);
  const end = parseISO(booking.end_time);
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const duration = differenceInMinutes(end, start);

  const cellHeight = isMobile ? 64 : 48;
  const top = (startHour - 7) * cellHeight + startMinute * (cellHeight / 60);
  const height = duration * (cellHeight / 60);

  const isShortBooking = duration <= 30;
  const timePart = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;

  const now = new Date();
  const isPastBooking = isBefore(end, now);
  const bookingColor = isPastBooking ? 'hsl(160, 34%, 21%)' : 'hsl(158 48% 51%)';

  return (
    <div
      className="absolute left-0 w-11/12 px-1.5 sm:px-2 cursor-pointer overflow-hidden z-0 rounded-md ml-px"
      style={{
        top: `${top + 1}px`,
        height: `${height - 2}px`,
        backgroundColor: bookingColor,
        color: 'hsl(158 3% 8%)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onBookingClick(booking);
      }}
    >
      <div 
        className={`flex flex-col whitespace-pre-line ${!isShortBooking ? 'text-[10px] sm:text-xs' : ''}`}
        style={{
          fontSize: isShortBooking ? '10px' : undefined,
          lineHeight: duration <= 30 ? '0.65rem' : undefined
        }}
      >
        <span className="font-medium whitespace-nowrap">{booking.title}</span>
        <span>{timePart}</span>
      </div>
    </div>
  );
}