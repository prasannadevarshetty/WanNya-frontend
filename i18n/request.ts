import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'ja'] as const;

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale && locales.includes(locale as any) ? (locale as (typeof locales)[number]) : 'en';

  if (locale && !locales.includes(locale as any)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    // Provide a global default timezone to avoid ENVIRONMENT_FALLBACK errors
    timeZone: 'UTC'
  };
});
