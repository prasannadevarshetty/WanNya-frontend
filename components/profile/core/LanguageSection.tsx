"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LanguageSection() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('profile');

  // With localePrefix: 'as-needed', English URLs have no '/en' prefix.
  // So the locale is 'ja' only when the pathname starts with '/ja'.
  const currentLocale: 'en' | 'ja' = pathname.startsWith('/ja') ? 'ja' : 'en';
  
  const switchLanguage = (newLocale: 'en' | 'ja') => {
    // remove existing locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(ja|en)/, '') || '/';

    // build new path
    const newPath =
      newLocale === 'en'
        ? pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale}`;

    // ✅ FORCE navigation refresh
    router.replace(newPath);
    router.refresh(); // 🔥 VERY IMPORTANT

    setOpen(false);
  };

  return (
    <div className="border-b">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 px-4"
      >
        <span className="font-medium text-gray-800">{t('language')}</span>

        <div className="flex items-center gap-2">
          {/* Selected Language */}
          <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded-md font-semibold">
            {currentLocale === 'ja' ? '日本語' : 'ENGLISH'}
          </span>

          <ChevronDown
            size={18}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={() => switchLanguage('en')}
            className={`px-3 py-1 rounded-md border ${
              currentLocale === 'en'
                ? "bg-yellow-400 text-black border-yellow-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            English
          </button>
          <button
            onClick={() => switchLanguage('ja')}
            className={`px-3 py-1 rounded-md border ${
              currentLocale === 'ja'
                ? "bg-yellow-400 text-black border-yellow-400"
                : "border-gray-300 text-gray-600"
            }`}
          >
            日本語
          </button>
        </div>
      )}
    </div>
  );
}
