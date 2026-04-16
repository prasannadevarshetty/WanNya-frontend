"use client";

import { useTranslations } from 'next-intl';

export default function TranslatedExample() {
  const t = useTranslations('dashboard');
  const commonT = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <h2>{t('yourPets')}</h2>
      <button>{commonT('add')}</button>
      <p>{t('noPetsDescription')}</p>
    </div>
  );
}
