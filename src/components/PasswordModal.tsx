import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';


interface PasswordModalProps {
  onAuthenticate: () => void;
}

export function PasswordModal({ onAuthenticate }: PasswordModalProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onAuthenticate();
    } else {
      setError(true);
      setTimeout(() => {
        setPassword('');
        setError(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center text-white" style={{ backgroundColor: 'hsl(240 3% 8%)' }}>
      <div className="absolute top-4 right-4">
        <LanguagePicker />
      </div>
      <div className="flex flex-col items-center px-4">
        <Logo size={64} />
        <h2
          className="text-4xl text-gray-400 font-regular mb-3 mt-5"
          dangerouslySetInnerHTML={{ __html: t('auth.title') }}
          style={{
            '--highlight-color': 'hsl(0, 0%, 100%)'
          } as React.CSSProperties}
        />

        <form onSubmit={handleSubmit} className="flex mt-10 flex-col items-center w-full max-w-xs">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className={`w-full px-4 py-3 text-center text-lg font-medium rounded-lg transition-colors outline-none ${
              error
                ? 'border border-red-500 text-red-400'
                : 'border-0 hover:border hover:border-gray-500 focus:border-2 focus:border-white text-white'
            }`}
            style={{ backgroundColor: '#333333' }}
          />
          {error && (
            <p className="text-red-400 text-sm mt-3">
              {t('auth.incorrectPassword')}
            </p>
          )}
        </form>
        
        <p className="text-gray-400 mt-5 text-xs mb-8 text-center">
          {t('auth.passwordRequired')}
          
        </p>
      </div>
    </div>
  );
}
