import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params
}: any) {
  // ✅ Next 16 requires await
  const { locale } = await params;

  // ✅ load translations
  const messages = (await import(`../../messages/${locale}.json`)).default;


  // ✅ safe client ID (prevents TS + runtime crash)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* ✅ i18n provider */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          {/* ✅ Google auth safe wrapper */}
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              {children}
            </GoogleOAuthProvider>
          ) : (
            children
          )}

        </NextIntlClientProvider>

      </body>
    </html>
  );
}
