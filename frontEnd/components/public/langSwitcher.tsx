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
  
  const currentLocale = (params.locale as string) || "en";
  
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
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    const search = window.location.search;
    router.replace(`${pathname}${search}`, { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover:bg-gray-100 gap-2 px-3 py-1.5 rounded-full   transition-all active:scale-95 "
      >
        <Globe size={14} className="text-slate-500" />
        <span className="text-[11px] font-bold sm:block hidden uppercase tracking-wider text-slate-500">
          {currentLocale === "ar" ? "العربية" : "English"}
        </span>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${currentLocale === 'ar' ? 'left-0' : 'right-0'} mt-4 w-36 origin-top-right rounded-xl bg-white shadow-lg border z-50 overflow-hidden animate-in fade-in zoom-in duration-150`}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-[11px] font-bold transition-colors
                  ${currentLocale === lang.code 
                    ? "bg-slate-50 text-primary" 
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {currentLocale === lang.code && (
                  <Check size={14} className="text-primary" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}