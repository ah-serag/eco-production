import Navbar from "@/components/navbar/navbar";
import { MegaMenuNavbar } from "@/components/navbar/CategoryNav";
import MobileBottomNav from "@/components/navbar/MobileNavFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground scroll-smooth">
      <Navbar />
      <div className="pt-13">
        <MegaMenuNavbar />
      </div>
      <main className="container mx-auto">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}