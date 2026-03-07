// app/[locale]/(public)/layout.tsx

import Footer from "@/components/public/footer";
import Navbar from "@/components/navbar/navbar";
import { MegaMenuNavbar } from "@/components/navbar/CategoryNav";
import MobileBottomNav from "@/components/navbar/MobileNavFooter";
import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground scroll-smooth">
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