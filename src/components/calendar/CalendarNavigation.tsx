import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

interface CalendarNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarNavigation({ selectedDate, onDateChange }: CalendarNavigationProps) {
  const { t } = useTranslation();

  const getMonthDisplay = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    const startMonth = format(start, 'MMM');
    const endMonth = format(end, 'MMM');
    const startMonthFull = format(start, 'MMMM').toLowerCase();
    const endMonthFull = format(end, 'MMMM').toLowerCase();
    const year = format(end, 'yyyy');

    if (startMonth === endMonth) {
      return `${t(`months.long.${startMonthFull}`)} ${year}`;
    }
    return `${startMonth} – ${endMonth} ${year}`;
  };

  return (
    <div className="sticky top-[77px] z-20 flex items-center justify-between p-4 border-b h-[72px] min-h-[72px]" style={{ borderColor: 'hsl(217 6% 26% / 1)', backgroundColor: 'hsl(240 3% 8%)' }}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onDateChange(new Date())}
          className="px-4 py-2 rounded-full font-medium bg-transparent border hover:bg-[#333333] transition-colors" style={{ borderColor: 'hsl(217 6% 26% / 1)' }}
        >
          {t('common.today')}
        </button>
        <div className="flex items-center">
          <button
            onClick={() => onDateChange(subWeeks(selectedDate, 1))}
            className="p-2.5 hover:bg-[#333333] rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onDateChange(addWeeks(selectedDate, 1))}
            className="p-2.5 hover:bg-[#333333] rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <h2 className="text-xl">
          {getMonthDisplay()}
        </h2>
      </div>
    </div>
  );
}
