"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale(); 
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: newLocale });
  };

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

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
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
  ];

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center bg-slate-100 px-4 py-1.5 rounded-full transition-all active:scale-90 border border-slate-200"
      >
        <span className="text-[11px] font-bold uppercase tracking-tighter text-slate-700">
          {currentLocale === "ar" ? "English" : "العربية"}
        </span>
      </button>
    );
  }

  // --- نسخة الكمبيوتر (Dropdown) ---
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all active:scale-95"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {currentLocale === "ar" ? "العربية" : "English"}
        </span>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${currentLocale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 origin-top-right rounded-xl bg-white shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in duration-150`}
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
                <span>{lang.label}</span>
                {currentLocale === lang.code && (
                  <Check size={12} className="text-primary" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}