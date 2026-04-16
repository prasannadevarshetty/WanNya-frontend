import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TranslationProvider from "@/components/providers/TranslationProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WanNya",
  description: "Pet care companion app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full overflow-x-hidden`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy"}>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}