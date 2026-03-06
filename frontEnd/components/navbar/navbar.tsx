"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import CartBadge from "./cardCount";
import { SearchInput } from "./SearchInput"; 
import { useGetUserInfoQuery } from "@/redux/features/home/homeclientslice";
import { UserNav } from "./userNav";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "../public/langSwitcher";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
   const { data, isLoading, isError } = useGetUserInfoQuery(undefined)


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
    <>
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
                src="/photo/logoVexa.svg" 
                alt="vexa Logo" 
                width={80} 
                height={35}  
                priority 
                className="object-contain"
              />
            </Link>
          </div>

          {/* Search Section - المكون المستقل هنا */}
          <div className="flex flex-1 justify-center max-w-2xl px-2">
            <SearchInput />
          </div>

          {/* Icons Section */}
    
        <div className="flex items-center gap-5 shrink-0">
         
         <LanguageSwitcher/>

     <Link 
  href="/cart_product" 
  className="md:flex items-center hidden gap-1.5 p-1.5 px-3 hover:bg-slate-50 rounded-full transition-all duration-300 group active:scale-95 border border-transparent hover:border-slate-100"
>
  <ShoppingBag 
    size={19} 
    strokeWidth={1.8} 
    className="text-slate-600 group-hover:text-black transition-colors" 
  />

    <span className="text-[13px] font-bold text-slate-700 group-hover:text-black">
    <CartBadge />
     </span>
    </Link>
   <UserNav/>
    

          </div>

        </div>
      </header>

 
    </>
  );
}