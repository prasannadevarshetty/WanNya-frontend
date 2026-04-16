"use client";

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

import enMessages from '../../messages/en.json';
import jaMessages from '../../messages/ja.json';

const messagesByLocale = {
  en: enMessages,
  ja: jaMessages,
};

interface TranslationProviderProps {
  children: ReactNode;
}

export default function TranslationProvider({ children }: TranslationProviderProps) {
  const { language } = useLanguageStore();
  const messages = messagesByLocale[language];

  return (
    <NextIntlClientProvider
      key={language} // Force re-render when language changes
      locale={language}
      messages={messages}
      // Provide client-side defaults to avoid ENVIRONMENT_FALLBACK
      timeZone="UTC"
      now={new Date()}
      onError={(err) => {
        // Suppress environment fallback errors (missing global timeZone/now)
        // and log them as warnings instead of throwing, to avoid build/runtime crashes.
        if (err?.code === 'ENVIRONMENT_FALLBACK') {
          console.warn('next-intl ENVIRONMENT_FALLBACK:', err.message || err);
          return;
        }
        // For other errors, preserve default behavior (log as error)
        console.error(err);
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
