import { useTranslations as useNextIntlTranslations } from 'next-intl';

// Hook for using translations
export function useTranslations(namespace: string) {
  return useNextIntlTranslations(namespace);
}

// Specific hooks for common namespaces
export function useCommonTranslations() {
  return useNextIntlTranslations('common');
}

export function useNavigationTranslations() {
  return useNextIntlTranslations('navigation');
}

export function useAuthTranslations() {
  return useNextIntlTranslations('auth');
}

export function useDashboardTranslations() {
  return useNextIntlTranslations('dashboard');
}

export function usePetsTranslations() {
  return useNextIntlTranslations('pets');
}

export function useShopTranslations() {
  return useNextIntlTranslations('shop');
}

export function useCartTranslations() {
  return useNextIntlTranslations('cart');
}

export function useBookingsTranslations() {
  return useNextIntlTranslations('bookings');
}

export function useProfileTranslations() {
  return useNextIntlTranslations('profile');
}

export function useErrorTranslations() {
  return useNextIntlTranslations('errors');
}

export function useSuccessTranslations() {
  return useNextIntlTranslations('success');
}
