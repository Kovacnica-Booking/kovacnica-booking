import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '@/components/ui/number-input';

interface PasswordModalProps {
  onAuthenticate: () => void;
}

export function PasswordModal({ onAuthenticate }: PasswordModalProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
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
          setKey(prev => prev + 1);
        }, 1000);
      }
    }
  }, [pin, onAuthenticate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-80" />

      <div
        ref={modalRef}
        className="rounded-lg p-6 w-full max-w-md relative border border-[#333333] mx-4"
        style={{ backgroundColor: 'hsl(210, 3%, 12%)' }}
      >
        <h2 className="text-xl font-semibold mb-2">
          {t('auth.enterPassword')}
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          {t('auth.passwordRequired')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('auth.password')}
            </label>
            <NumberInput
              key={key}
              value={pin}
              onChange={setPin}
              error={error}
              tabIndex={1}
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
