// app/[locale]/(public)/layout.tsx
import Footer from "@/components/public/footer";
import Navbar from "@/components/navbar/navbar";
import { MegaMenuNavbar } from "@/components/navbar/CategoryNav";
import MobileBottomNav from "@/components/navbar/MobileNavFooter";
import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      lang={locale}
      className="min-h-screen flex scroll-smooth flex-col bg-background text-foreground"
    >
      <Navbar />    
      <div className="pt-13"> 
        <MegaMenuNavbar />
      </div>
      <main className="container mx-auto">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}