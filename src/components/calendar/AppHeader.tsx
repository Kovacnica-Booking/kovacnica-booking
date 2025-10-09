import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';
import type { Room } from '@/types';

interface AppHeaderProps {
  selectedRoom: Room;
  onRoomChange: (room: Room) => void;
}

export function AppHeader({ selectedRoom, onRoomChange }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 w-full p-4 border-b" style={{ borderColor: 'hsl(217 6% 26% / 1)', backgroundColor: 'hsl(240 3% 11%)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="flex items-center gap-1 bg-[#333333] p-1 rounded-full min-w-[200px]">
            <button
              onClick={() => onRoomChange('Sejna 1')}
              className={`flex-1 px-3 py-1 rounded-full transition-colors ${
                selectedRoom === 'Sejna 1'
                  ? 'bg-white text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('rooms.sejna1')}
            </button>
            <button
              onClick={() => onRoomChange('Sejna 2')}
              className={`flex-1 px-3 py-1 rounded-full transition-colors ${
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
  );
}
