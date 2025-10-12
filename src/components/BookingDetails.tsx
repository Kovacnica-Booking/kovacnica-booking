import React, { useState, useEffect, useRef } from 'react';
import { format, setHours, setMinutes, addMinutes, parseISO, isBefore, isAfter } from 'date-fns';
import { X, Trash, Clock, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '@/components/ui/number-input';
import { Select } from '@/components/ui/select';
import type { Booking } from '@/types';

interface BookingDetailsProps {
  booking: Booking;
  bookings: Booking[];
  onClose: () => void;
  onDelete: (pin: string) => void;
  onUpdate: (bookingId: string, startTime: Date, endTime: Date, pin: string, title: string) => void;
}

export function BookingDetails({ booking, bookings, onClose, onDelete, onUpdate }: BookingDetailsProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [startTime, setStartTime] = useState(parseISO(booking.start_time));
  const [endTime, setEndTime] = useState(parseISO(booking.end_time));
  const [title, setTitle] = useState(booking.title);
  const [key, setKey] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const scrollableElements = document.querySelectorAll('.overflow-y-auto');
    const scrollPositions = new Map<Element, number>();

    scrollableElements.forEach(el => {
      scrollPositions.set(el, el.scrollTop);
    });

    const preventScrollReset = () => {
      scrollableElements.forEach(el => {
        const savedPosition = scrollPositions.get(el);
        if (savedPosition !== undefined && el.scrollTop !== savedPosition) {
          el.scrollTop = savedPosition;
        }
      });
    };

    const intervalId = setInterval(preventScrollReset, 16);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (isVerified) {
      titleInputRef.current?.focus();
    }
  }, [isVerified]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === booking.pin) {
        setIsVerified(true);
        setError('');
      } else {
        setError(t('bookings.incorrectPin'));
        setTimeout(() => {
          setPin('');
          setError('');
          setKey(prev => prev + 1);
        }, 1000);
      }
    }
  }, [pin, booking.pin, t]);

  const isTimeSlotAvailable = (time: Date, isStart: boolean) => {
    return !bookings.some(otherBooking => {
      if (otherBooking.id === booking.id) return false;
      const otherStart = parseISO(otherBooking.start_time);
      const otherEnd = parseISO(otherBooking.end_time);
      
      if (isStart) {
        // For start time, check if it overlaps with any booking
        return (time >= otherStart && time < otherEnd);
      } else {
        // For end time, check if the time range overlaps with any booking
        return (
          (startTime < otherEnd && time > otherStart) || // Overlaps with booking
          time <= startTime // End time can't be before or equal to start time
        );
      }
    });
  };

  const generateTimeOptions = () => {
    const options = [];
    const baseDate = parseISO(booking.start_time);
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(baseDate, hour), minute);
        options.push({
          value: format(time, 'HH:mm'),
          label: format(time, 'HH:mm'),
          disabled: !isTimeSlotAvailable(time, true)
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleStartTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const baseDate = parseISO(booking.start_time);
    const newStartTime = setMinutes(setHours(baseDate, hours), minutes);
    setStartTime(newStartTime);
    
    if (endTime <= newStartTime) {
      setEndTime(addMinutes(newStartTime, 30));
    }
  };

  const handleEndTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const baseDate = parseISO(booking.start_time);
    const newEndTime = setMinutes(setHours(baseDate, hours), minutes);
    setEndTime(newEndTime);
    
    if (startTime >= newEndTime) {
      setStartTime(addMinutes(newEndTime, -30));
    }
  };

  const handleDelete = () => {
    onDelete(pin);
  };

  const handleSave = () => {
    if (!isVerified) return;
    onUpdate(booking.id, startTime, endTime, pin, title);
  };

  const formatDateTime = (start: Date, end: Date) => {
    const day = format(start, 'd');
    const month = format(start, 'M');
    const year = format(start, 'yyyy');
    return `${day}. ${month}. ${year}, ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="rounded-lg p-6 w-full max-w-md relative border border-[#333333]" 
        style={{ backgroundColor: 'hsl(210, 3%, 12%)' }}
      >
        <div className="flex justify-between items-center mb-8">
          {!isVerified ? (
            <h2 className="text-xl font-semibold">{booking.title}</h2>
          ) : (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-0 border-b border-transparent hover:border-gray-600 focus:border-white focus:outline-none px-0 w-full transition-colors"
              tabIndex={1}
            />
          )}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 hover:bg-[#333333] rounded-full"
            tabIndex={5}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          {!isVerified ? (
            <>
            </>
          ) : (
            <>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={format(startTime, 'HH:mm')}
                    onChange={handleStartTimeChange}
                    options={timeOptions}
                    tabIndex={2}
                  />
                  <span className="text-gray-400">{t('common.to')}</span>
                  <Select
                    value={format(endTime, 'HH:mm')}
                    onChange={handleEndTimeChange}
                    options={timeOptions.filter(option => {
                      const [hours, minutes] = option.value.split(':').map(Number);
                      const time = setMinutes(setHours(endTime, hours), minutes);
                      return time > startTime && isTimeSlotAvailable(time, false);
                    })}
                    tabIndex={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {!isVerified && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('bookings.enterPinToManage')}
            </label>
            <NumberInput
              key={key}
              value={pin}
              onChange={setPin}
              error={!!error}
              tabIndex={1}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {isVerified && (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                tabIndex={5}
              >
                <Trash size={16} />
                {t('common.delete')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                tabIndex={6}
              >
                <Save size={16} />
                {t('common.save')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}