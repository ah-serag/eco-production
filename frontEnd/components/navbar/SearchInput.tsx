"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SearchInput() {
  const t = useTranslations("search");
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // مرجع لكامل منطقة البحث

  // 1. فوكس تلقائي عند الفتح
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // 2. إغلاق البحث عند الضغط في أي مكان بالخارج
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center" ref={containerRef}>
      
      {/* 1. الكمبيوتر */}
      <form 
        onSubmit={handleSearch}
        className="hidden md:flex w-[500px] items-center bg-gray-50 rounded-full border border-gray-200 h-10 overflow-hidden focus-within:ring-2 focus-within:ring-chart-1/20 transition-all"
      >
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t("placeholder")}
          className="border-0 bg-transparent text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm flex-1 px-5"
        />
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="bg-secondary text-white h-full w-12 rounded-none hover:bg-chart-1/80 transition-colors shrink-0"
        >
          <SearchIcon size={18} />
        </Button>
      </form>

      {/* زر فتح البحث في الموبايل */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center w-15 h-8 rounded-2xl bg-white  text-neutral-500 shadow-sm active:scale-90 transition-all"
      >
        {isOpen ? <X size={15} /> : <SearchIcon size={15} />}
      </button>

      {/* 3. شريط البحث المنبثق في الموبايل */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full z-100 md:hidden p-0 animate-in slide-in-from-top-1 duration-200">
          <form 
            onSubmit={handleSearch}
            className="flex w-full items-center bg-white border-b border-gray-200 h-14 shadow-lg overflow-hidden"
          >
            <Input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("placeholder")}
              className="border-0 bg-white text-black placeholder:text-gray-400 focus-visible:ring-0 h-full text-[13px] flex-1 px-6 rounded-none"
            />
            
            <Button
              type="submit"
              variant="ghost" 
              className="bg-white hover:bg-transparent h-full w-16 rounded-none shrink-0 border-0"
            >
              <SearchIcon className="text-chart-1" size={20} />
            </Button>
          </form>

          <div 
            className="fixed inset-0 top-[120px] bg-black/5 -z-10" 
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}