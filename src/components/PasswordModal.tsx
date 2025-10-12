import React, { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
      <div className="flex flex-col items-center px-4">
        <h2 className="text-2xl font-semibold mb-3">
          {t('auth.enterPassword')}
        </h2>

        <div className="flex flex-col items-center">
          <NumberInput
            key={key}
            value={pin}
            onChange={setPin}
            error={error}
            tabIndex={1}
          />
          {error && (
            <p className="text-red-400 text-sm mt-3">
              {t('auth.incorrectPassword')}
            </p>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-8 text-center">
          {t('auth.passwordRequired')}
        </p>
      </div>
    </div>
  );
}
