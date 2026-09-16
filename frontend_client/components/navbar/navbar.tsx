"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput"; 
import { UserNav } from "./userNav";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "../public/langSwitcher";
import { CartNav } from "./cartNav";
import { useLocale } from "next-intl";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full bg-white border-b border-gray-200 md:px-3 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-2 md:gap-4 relative">
        
        <div className="md:flex hidden shrink-0">
          <Link href="/" className="group flex items-center">
            <span className="text-2xl font-serif font-bold tracking-widest uppercase text-primary">GOTIY</span>
          </Link>
        </div>

        <div className="flex flex-1 md:justify-center max-w-2xl z-10 order-1 md:order-none">
          <SearchInput />
        </div>
        
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 shrink-0 z-20">
          <Link href="/" className="group flex items-center">
            <span className="text-2xl font-serif font-bold tracking-widest uppercase text-primary">GOTIY</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-5 shrink-0 z-10 order-2 md:order-none">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <CartNav /> 
          <UserNav />
        </div>

      </div>
    </header>
  );
}