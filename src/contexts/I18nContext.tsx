import React, { createContext, useContext } from 'react';
import { ru } from '@/i18n/ru';

type I18nContextType = typeof ru;

const I18nContext = createContext<I18nContextType>(ru);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={ru}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
