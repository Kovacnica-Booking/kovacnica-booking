import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';
import { Check, Info } from 'lucide-react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';


interface PasswordModalProps {
  onAuthenticate: () => void;
}

export function PasswordModal({ onAuthenticate }: PasswordModalProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: showTooltip,
    onOpenChange: setShowTooltip,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (password.length === 4 && password === '1234') {
      onAuthenticate();
    } else if (password.length === 4 && password !== '1234') {
      setError(true);
      setTimeout(() => {
        setPassword('');
        setError(false);
      }, 1000);
    }
  }, [password, onAuthenticate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      return;
    }

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

        <form onSubmit={handleSubmit} className="flex mt-10 flex-col items-center w-400">
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              autoFocus
              required
              className={`w-full px-4 py-3 pr-12 text-left text-lg font-medium rounded-lg transition-all outline-none border ${
                error
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent hover:border-gray-500 focus:ring-2 focus:ring-white text-white'
              }`}
              style={{ backgroundColor: '#333333' }}
            />
            <div
              ref={refs.setReference}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <Info className="w-5 h-5 text-gray-400" />
            </div>
            {showTooltip && (
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                className="z-50 px-3 py-1.5 text-xs text-white bg-[#1a1a1a] rounded-md shadow-lg border border-[#333333] whitespace-nowrap pointer-events-none"
              >
                {t('auth.passwordRequired')}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 self-start cursor-pointer" style={{ marginTop: '8px' }}>
            <div className="relative w-4 h-4 self-start">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 cursor-pointer appearance-none border border-gray-500 rounded checked:bg-white checked:border-white"
                style={{ backgroundColor: 'transparent' }}
              />
              {showPassword && (
                <Check className="absolute inset-x-0.5 top-1.5 w-3 h-3 text-white pointer-events-none" strokeWidth={4} />
              )}
            </div>
            <span className="text-gray-400" style={{ fontSize: '14px' }}>
              {t('auth.showPassword')}
            </span>
          </label>
          {error && (
            <p className="text-red-400 text-sm mt-3">
              {t('auth.incorrectPassword')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
