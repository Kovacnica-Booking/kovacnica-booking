import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from '@/components/ui/pin-input';

interface PasswordModalProps {
  onAuthenticate: () => void;
}

export function PasswordModal({ onAuthenticate }: PasswordModalProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (pin.length === 4) {
      if (pin === '1234') {
        onAuthenticate();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 1000);
      }
    }
  }, [pin, onAuthenticate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80"
        style={{ backdropFilter: 'blur(4px)' }}
      />

      <div
        ref={modalRef}
        className="relative bg-[#2a2a2a] rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
        style={{
          border: '1px solid hsl(217 6% 26% / 1)',
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-2">
          {t('auth.enterPassword')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('auth.passwordRequired')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('auth.password')}
            </label>
            <PinInput
              value={pin}
              onChange={setPin}
              error={error}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">
                {t('auth.incorrectPassword')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
