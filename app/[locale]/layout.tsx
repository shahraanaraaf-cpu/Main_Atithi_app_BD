import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CurrencyProvider } from '@/app/contexts/CurrencyContext';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/app/contexts/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atithi App BD",
  description: "Marketplace for Homes, Experiences, and Services in Bangladesh. Find the best places to stay and amazing experiences.",
  openGraph: {
    title: 'Atithi App BD',
    description: 'Marketplace for Homes, Experiences, and Services in Bangladesh.',
    url: 'https://atithiapp.bd',
    siteName: 'Atithi App BD',
    images: [
      {
        url: 'https://atithiapp.bd/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Atithi App BD Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://rkyxemrxtqpsjxqysjqr.supabase.co" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-['Plus_Jakarta_Sans'] bg-[#f9f9f9] text-[#1a1c1c]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <CurrencyProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CurrencyProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
