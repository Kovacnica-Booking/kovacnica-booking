import React, { useState, useEffect, useRef } from 'react';
import { format, setHours, setMinutes, addMinutes, parseISO, isBefore, isAfter } from 'date-fns';
import { X, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { NumberInput } from '@/components/ui/number-input';
import { Select } from '@/components/ui/select';
import type { Room, TimeRange, Booking } from '@/types';

interface BookingModalProps {
  timeRange: TimeRange;
  room: Room;
  bookings: Booking[];
  onClose: () => void;
  onSubmit: (title: string, pin: string) => void;
  position?: { 
    top: number; 
    left: number; 
    right: number;
    width: number;
  };
  onTimeChange?: (start: Date, end: Date) => void;
}

export function BookingModal({ 
  timeRange, 
  room, 
  bookings, 
  onClose, 
  onSubmit,
  position,
  onTimeChange 
}: BookingModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [pin, setPin] = useState('');
  const [startTime, setStartTime] = useState(timeRange.start);
  const [endTime, setEndTime] = useState(timeRange.end);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

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
    onTimeChange?.(startTime, endTime);
  }, [startTime, endTime, onTimeChange]);

  const isTimeSlotAvailable = (time: Date, isStart: boolean) => {
    const roomBookings = bookings.filter(booking => booking.room === room);
    const proposedStart = isStart ? time : startTime;
    const proposedEnd = isStart ? endTime : time;

    // Ensure end time is after start time
    if (proposedEnd <= proposedStart) {
      return false;
    }

    // Check for overlaps with existing bookings
    return !roomBookings.some(booking => {
      const bookingStart = parseISO(booking.start_time);
      const bookingEnd = parseISO(booking.end_time);

      // Allow selecting a time that matches another booking's start/end time
      if (isStart) {
        return proposedStart < bookingEnd && proposedEnd > bookingStart;
      } else {
        return proposedStart < bookingEnd && proposedEnd > bookingStart;
      }
    });
  };

  const generateTimeOptions = () => {
    const options = [];
    const baseDate = startTime;
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(baseDate, hour), minute);
        options.push({
          value: format(time, 'HH:mm'),
          label: format(time, 'HH:mm'),
          disabled: false
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleStartTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newStartTime = setMinutes(setHours(startTime, hours), minutes);
    
    if (isTimeSlotAvailable(newStartTime, true)) {
      setStartTime(newStartTime);
      
      if (endTime <= newStartTime) {
        const newEndTime = addMinutes(newStartTime, 30);
        setEndTime(newEndTime);
      }
    }
  };

  const handleEndTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newEndTime = setMinutes(setHours(endTime, hours), minutes);
    
    if (isTimeSlotAvailable(newEndTime, false)) {
      setEndTime(newEndTime);
      
      if (startTime >= newEndTime) {
        const newStartTime = addMinutes(newEndTime, -30);
        setStartTime(newStartTime);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || pin.length !== 4 || !isTimeSlotAvailable(startTime, true)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA
      if (recaptchaRef.current) {
        const token = await recaptchaRef.current.executeAsync();
        if (token) {
          setRecaptchaToken(token);
          onSubmit(title, pin);
        } else {
          console.error('reCAPTCHA verification failed');
        }
        // Reset reCAPTCHA for next use
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const weekday = format(date, 'EEEE').toLowerCase();
    const day = format(date, 'd');
    const month = format(date, 'MMMM').toLowerCase();
    const year = format(date, 'yyyy');
    
    return `${t(`weekdays.long.${weekday}`)}, ${day}. ${t(`months.long.${month}`)} ${year}`;
  };

  const getModalPosition = () => {
    if (!position) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const modalWidth = 400;
    const spacing = 8;
    const minEdgeDistance = 16;
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth < 640;

    if (isMobile) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px'
      };
    }

    const timeSlotWidth = position.width * 0.9167;
    const timeSlotRight = position.left + timeSlotWidth;

    const spaceOnLeft = position.left;
    const spaceOnRight = windowWidth - timeSlotRight;

    let left: string | number | undefined;
    let transform: string | undefined;

    if (spaceOnRight >= modalWidth + spacing) {
      left = timeSlotRight + spacing;
    }
    else if (spaceOnLeft >= modalWidth + spacing) {
      left = position.left - modalWidth - spacing;
    }
    else {
      left = '50%';
      transform = 'translateX(-50%)';
    }

    let top = position.top;
    
    const modalHeight = 400;
    if (top + modalHeight > window.innerHeight - minEdgeDistance) {
      top = window.innerHeight - modalHeight - minEdgeDistance;
    }
    top = Math.max(minEdgeDistance, top);

    return {
      position: 'fixed',
      top: `${top}px`,
      left: typeof left === 'number' ? `${left}px` : left,
      transform,
      maxWidth: '400px',
      width: isMobile ? 'calc(100% - 32px)' : undefined
    };
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        ref={modalRef}
        className="absolute bg-[#1a1a1a] rounded-lg shadow-xl border border-[#333333] w-[400px]"
        style={getModalPosition()}
      >
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between gap-3 items-center mb-8">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('common.title')}
              className="text-xl font-semibold bg-transparent border-0 border-b border-transparent hover:border-gray-600 focus:border-white focus:outline-none px-0 w-full transition-colors"
              required
              tabIndex={1}
            />
            <button 
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 p-1 hover:bg-gray-700 rounded"
              tabIndex={5}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-300">{formatDate(startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={format(startTime, 'HH:mm')}
                  onChange={handleStartTimeChange}
                  options={timeOptions}
                  tabIndex={3}
                />
                <span className="text-gray-400">{t('common.to')}</span>
                <Select
                  value={format(endTime, 'HH:mm')}
                  onChange={handleEndTimeChange}
                  options={timeOptions.filter(option => {
                    const [hours, minutes] = option.value.split(':').map(Number);
                    const time = setMinutes(setHours(endTime, hours), minutes);
                    return time > startTime;
                  })}
                  tabIndex={4}
                />
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {t('bookings.enterPin')}
                </label>
                <NumberInput 
                  value={pin} 
                  onChange={setPin} 
                  tabIndex={2}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed h-12 whitespace-nowrap"
                disabled={!title || pin.length !== 4 || !isTimeSlotAvailable(startTime, true) || isSubmitting}
                tabIndex={6}
              >
                {isSubmitting ? 'Verifying...' : t('common.book')}
              </button>
            </div>
          </div>

          {/* Invisible reCAPTCHA */}
          {recaptchaSiteKey && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              size="invisible"
              badge="bottomright"
            />
          )}
        </form>
      </div>
    </div>
  );
}