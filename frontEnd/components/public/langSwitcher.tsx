"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  console.log(pathname)
  const currentLocale = params.locale as string;
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "ar", label: "العربية", flag: "🇪🇬" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95"
      >
        <Globe size={14} className="text-slate-500" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
          {currentLocale === "ar" ? "العربية" : "English"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-150">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-[11px] font-bold transition-colors
                  ${currentLocale === lang.code 
                    ? "bg-slate-50 text-chart-1" 
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {currentLocale === lang.code && <Check size={14} className="text-chart-1" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}