import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';
import type { Room } from '@/types';

interface HeaderProps {
  selectedDate: Date;
  selectedRoom: Room;
  onDateChange: (date: Date) => void;
  onRoomChange: (room: Room) => void;
}

export function Header({ 
  selectedDate, 
  selectedRoom, 
  onDateChange, 
  onRoomChange 
}: HeaderProps) {
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
      // Single month - use full name
      return `${t(`months.long.${startMonthFull}`)} ${year}`;
    }
    // Multiple months - use short names
    return `${startMonth} – ${endMonth} ${year}`;
  };

  return (
    <>
      <div className="w-full p-4 border-b fixed" style={{ borderColor: 'hsl(217 6% 26% / 1)', backgroundColor: 'hsl(240 3% 11%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="flex items-center gap-1 bg-[#333333] p-1 rounded-full min-w-[200px]">
              <button
                onClick={() => onRoomChange('Sejna 1')}
                className={`flex-1 px-4 py-1 rounded-full transition-colors ${
                  selectedRoom === 'Sejna 1'
                    ? 'bg-white text-black font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('rooms.sejna1')}
              </button>
              <button
                onClick={() => onRoomChange('Sejna 2')}
                className={`flex-1 px-4 py-1 rounded-full transition-colors ${
                  selectedRoom === 'Sejna 2'
                    ? 'bg-white text-black font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('rooms.sejna2')}
              </button>
            </div>
          </div>
          <LanguagePicker />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-b absolute" style={{ borderColor: 'hsl(217 6% 26% / 1)' }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onDateChange(new Date())}
            className="px-6 py-2 rounded-full font-medium bg-[#333333] hover:bg-[#444444] transition-colors"
          >
            {t('common.today')}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDateChange(subWeeks(selectedDate, 1))}
              className="p-2 hover:bg-[#333333] rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onDateChange(addWeeks(selectedDate, 1))}
              className="p-2 hover:bg-[#333333] rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <h2 className="text-xl">
            {getMonthDisplay()}
          </h2>
        </div>
      </div>
    </>
  );
}