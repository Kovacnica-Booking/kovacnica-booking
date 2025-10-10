import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/components/calendar/AppHeader';
import { CalendarNavigation } from '@/components/calendar/CalendarNavigation';
import { Calendar } from '@/components/Calendar';
import { BookingModal } from '@/components/BookingModal';
import { BookingDetails } from '@/components/BookingDetails';
import { PasswordModal } from '@/components/PasswordModal';
import { useBookings } from '@/hooks/useBookings';
import type { Booking, Room, TimeRange } from '@/types';

const AUTH_TIMEOUT_MS = 5 * 60 * 1000;
const AUTH_TIMESTAMP_KEY = 'authTimestamp';

function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const elapsed = Date.now() - parseInt(timestamp, 10);
    return elapsed < AUTH_TIMEOUT_MS;
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room>('Sejna 1');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number; right: number; width: number } | null>(null);
  const [previewTimeRange, setPreviewTimeRange] = useState<TimeRange | null>(null);

  const { bookings, createBooking, deleteBooking, updateBooking } = useBookings(selectedDate);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAuth = () => {
      const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
      if (!timestamp) {
        setIsAuthenticated(false);
        return;
      }

      const elapsed = Date.now() - parseInt(timestamp, 10);
      if (elapsed >= AUTH_TIMEOUT_MS) {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      }
    };

    const intervalId = setInterval(checkAuth, 1000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleAuthenticate = () => {
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    setIsAuthenticated(true);
  };

  const handleTimeRangeSelect = (range: TimeRange, position: { top: number; left: number; right: number; width: number }) => {
    setSelectedTimeRange(range);
    setModalPosition(position);
    setPreviewTimeRange(range);
  };

  const handleTimeChange = (start: Date, end: Date) => {
    if (selectedTimeRange) {
      setPreviewTimeRange({ start, end });
    }
  };

  const handleBooking = async (title: string, pin: string) => {
    if (!previewTimeRange) return;

    const success = await createBooking({
      room: selectedRoom,
      start_time: previewTimeRange.start.toISOString(),
      end_time: previewTimeRange.end.toISOString(),
      title,
      pin
    });

    if (success) {
      handleModalClose();
    }
  };

  const handleDeleteBooking = async (pin: string) => {
    if (!selectedBooking || pin !== selectedBooking.pin) return;

    const success = await deleteBooking(selectedBooking.id);
    if (success) {
      setSelectedBooking(null);
    }
  };

  const handleUpdateBooking = async (bookingId: string, startTime: Date, endTime: Date, pin: string, title: string) => {
    if (!selectedBooking || pin !== selectedBooking.pin) return;

    const success = await updateBooking(bookingId, {
      room: selectedBooking.room,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      title,
      pin: selectedBooking.pin
    });

    if (success) {
      setSelectedBooking(null);
    }
  };

  const handleModalClose = () => {
    setSelectedTimeRange(null);
    setModalPosition(null);
    setPreviewTimeRange(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: 'hsl(240 3% 8%)' }}>
      <AppHeader
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
      />

      <CalendarNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <Calendar
        selectedDate={selectedDate}
        bookings={bookings}
        selectedRoom={selectedRoom}
        onTimeRangeSelect={handleTimeRangeSelect}
        onBookingClick={setSelectedBooking}
        previewTimeRange={selectedTimeRange ? previewTimeRange : null}
      />

      {selectedTimeRange && (
        <BookingModal
          timeRange={selectedTimeRange}
          room={selectedRoom}
          bookings={bookings}
          onClose={handleModalClose}
          onSubmit={handleBooking}
          position={modalPosition}
          onTimeChange={handleTimeChange}
        />
      )}

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          bookings={bookings}
          onClose={() => setSelectedBooking(null)}
          onDelete={handleDeleteBooking}
          onUpdate={handleUpdateBooking}
        />
      )}

      {!isAuthenticated && (
        <PasswordModal onAuthenticate={handleAuthenticate} />
      )}
    </div>
  );
}

export default App;