import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ja';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () => {
        const current = get().language;
        set({ language: current === 'en' ? 'ja' : 'en' });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
