"use client";

import Footer from "@/components/public/footer";
import { Link, usePathname } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "next-intl";

export default function WithFooterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale   = useLocale();
  const isAr     = locale === "ar";
  const isHome   = pathname === "/";

  return (
    <>
      {/* back to more — mobile only, hidden on home */}
      {!isHome && (
        <div className="md:hidden sticky p-2 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-100">
          <Link
            href="/more"
            className="inline-flex items-center gap-1.5 px-4 py-5 text-slate-500 active:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} />
            <span className="text-[11px] uppercase tracking-widest font-medium">
              {isAr ? "المزيد" : "More"}
            </span>
          </Link>
        </div>
      )}
      
      <div className="pb-20  md:pb-0">
        {children}
      </div>
      <Footer />
    </>
  );
}
