import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '@/components/ui/number-input';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';


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
    <div className="fixed inset-0 flex items-center justify-center text-white" style={{ backgroundColor: 'hsl(240 3% 8%)' }}>
      <div className="absolute top-4 right-4">
        <LanguagePicker />
      </div>
      <div className="flex flex-col items-center px-4">
        <Logo size={64} />
        <h2
          className="text-3xl text-gray-400 font-semibold mb-3 mt-4"
          dangerouslySetInnerHTML={{ __html: t('auth.title') }}
          style={{
            '--highlight-color': 'hsl(0, 0%, 100%)'
          } as React.CSSProperties}
        />

        <div className="flex mt-4 flex-col items-center">
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
        
        <p className="text-gray-400 mt-5 text-xs mb-8 text-center">
          {t('auth.passwordRequired')}
          
        </p>
      </div>
    </div>
  );
}
