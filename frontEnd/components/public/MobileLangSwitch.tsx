"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function MobileLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    const search = window.location.search;
    router.replace(`${pathname}${search}`, { locale: newLocale });
  };


  return (
      <DropdownMenuItem className="sm:hidden " onClick={toggleLanguage}>
      <button
        type="button"
        className={`flex items-center w-full 
        ${currentLocale === "ar" ? " flex-row-reverse" : ""}
           py-1.5 gap-3 transition-all active:scale-90`}
      >
       <Languages className={`h-4 w-4  text-slate-400 group-hover:text-primary transition-colors`} />
        <span className="text-[11px] font-bold uppercase tracking-tighter text-slate-700">
          {currentLocale === "ar" ? "English" : "العربية"}
        </span>
      </button>
     </DropdownMenuItem>

 );

       

}