// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import {  Geist, Geist_Mono, Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "@/redux/redux_provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "LumaCraft Store",
  description: "E-commerce Platform"
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";

  const currentFont = locale === "ar" ? tajawal : geistSans;

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`
          ${currentFont.className} 
          ${geistMono.variable}
          antialiased
        `}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>{children}</ReduxProvider>
        </NextIntlClientProvider>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}