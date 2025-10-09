import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguagePicker() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'sl' ? 'en' : 'sl';
    i18n.changeLanguage(newLanguage);
  };

  const buttonText = i18n.language === 'sl' ? 'EN' : 'SL';

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-2 rounded-full bg-transparent w-12 text-gray-400 hover:text-white transition-colors"
    >
      {buttonText}
    </button>
  );
}