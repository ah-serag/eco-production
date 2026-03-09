"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
   const locale = useLocale()
   const isAribac = locale === "ar" ? true : false ;


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
      <div className="container mx-auto flex h-13 items-center justify-between px-4 gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="block transition-opacity hover:opacity-80">
            <Image 
              src={`/photo/${isAribac ? "tmara_ar.svg"  :  "tmara.svg"}` }
              alt="vexa Logo" 
              width={90} 
              height={35}  
              priority 
              className="object-contain"
            />
          </Link>  
        </div>

        {/* Search Section */}
        <div className="flex flex-1 justify-center max-w-2xl px-2">
          <SearchInput />
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitcher />
          <CartNav /> 
          <UserNav />
        </div>
      </div>
    </header>
  );
}