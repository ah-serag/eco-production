import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/redux/redux_provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from "@/i18n/routing";
import { use } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LumaCraft Store",
  description: "E-commerce Platform",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// مهم جداً لضمان الـ Static Rendering في المواقع الكبيرة
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children, params }: Props) {
  const { locale } = use(params);

  setRequestLocale(locale);


  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider >
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </NextIntlClientProvider>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}