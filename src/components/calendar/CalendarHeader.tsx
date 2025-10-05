import React from 'react';
import { format, isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface CalendarHeaderProps {
  days: Date[];
}

export function CalendarHeader({ days }: CalendarHeaderProps) {
  const { t } = useTranslation();
  const today = new Date();

  const getWeekdayTranslation = (day: Date) => {
    const weekday = format(day, 'EEE').toLowerCase();
    return t(`weekdays.short.${weekday}`);
  };

  return (
    <div className="grid grid-cols-[2.5rem_repeat(7,1fr)] sm:grid-cols-[4rem_repeat(7,1fr)] border-b" style={{ borderColor: 'hsl(217 6% 26% / 1)' }}>
      <div />
      {days.map(day => (
        <div
          key={day.toISOString()}
          className="p-2 text-center border-l"
          style={{ borderColor: 'hsl(217 6% 26% / 1)' }}
        >
          <div className="text-[11px] sm:text-sm" style={{ color: 'hsl(217 6% 44% / 1)' }}>
            {getWeekdayTranslation(day)}
          </div>
          <div className="text-base sm:text-xl flex justify-center">
            <div className={`w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
              isSameDay(day, today) ? 'bg-white text-black' : ''
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}