"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, X, Loader2, LayoutGrid, Layers, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useGetSearchSuggestionsQuery, useLazySearchProductsQuery } from "@/redux/features/home/homeclientslice";

export function SearchInput() {
  const t = useTranslations("search");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestionsData, isFetching: isSuggestionsLoading } = useGetSearchSuggestionsQuery(searchValue, {
    skip: !searchValue.trim() || searchValue.length < 2,
  });

  const [triggerSearch, { isFetching: isSearching }] = useLazySearchProductsQuery();
  const suggestions = suggestionsData?.data || [];

  // --- تجميع الفئات والأقسام الفرعية الفريدة ---
  const uniqueCategories = Array.from(new Set(suggestions.map((item: any) => 
    locale === "ar" ? {cat_Name :  item.category_ar , cat_id : item.category_id}
    :  {cat_Name : item.category , cat_id : item.category_id}    
  ))).slice(0, 1); 

  const uniqueSubcategories = Array.from(new Set(suggestions.map((item: any) => 
    locale === "ar" ? {sub_name : item.subcategory_ar , cat_id : item.category_id , sub_id :item.subcategory_id} 
      : {sub_name : item.subcategory , cat_id : item.category_id, sub_id :item.subcategory_id}
  ))).slice(0, 1);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const finalValue = term || searchValue;
    if (finalValue.trim()) {
      await triggerSearch({ q: finalValue.trim(), page: 1 ,limit : 24});
      router.push(`/search?q=${encodeURIComponent(finalValue.trim())}`);
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex items-center" ref={containerRef}>
      {/* 1. الكمبيوتر */}
      <div className="hidden md:block relative">
        <form onSubmit={handleSearch}
         className="flex w-[500px] items-center bg-gray-50 rounded-full border border-gray-200 h-10 overflow-hidden focus-within:ring-2 focus-within:ring-chart-1/20 transition-all">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={t("placeholder")}
            className="border-0 bg-transparent  text-black  placeholder:text-gray-400 focus-visible:ring-0 h-full text-sm flex-1 px-5 "
          />
          <Button type="submit" variant="default" size="icon" disabled={isSearching} className="bg-primary text-white h-full w-12 rounded-none">
            {isSearching ? <Loader2 className="animate-spin" size={15} /> : <SearchIcon size={15} />}
          </Button>
        </form>

        {showSuggestions && searchValue.length >= 2 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl z-[110] mt-1 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {isSuggestionsLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" size={20} /></div>
            ) : (
              <div className="flex flex-col">
                {/* الفئات الرئيسية (Categories) */}
                {uniqueCategories.map((itemCat: any, idx) => (
                  <Link 
                    key={`cat-${idx}`} 
                    href={`/products/${itemCat.cat_id}`}
                    onClick={()=> {  setIsOpen(false); setShowSuggestions(false);}}
                    className="px-5 py-2.5 bg-blue-50/30 hover:bg-blue-50 cursor-pointer border-b flex items-center justify-between group">

                    <div className="flex items-center gap-2 text-[13px] text-primary font-bold">
                        <LayoutGrid size={14} />

                       {itemCat.cat_Name}
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{t("category") || "Category"}</span>

                  </Link>
                ))}

                {/* الأقسام الفرعية (Subcategories) */}
                {uniqueSubcategories.map((item: any, idx) => (
                  <Link
                    href={`/products/${item.cat_id}?sub=${item.sub_id}`}
                    key={`sub-${idx}`} 
                    onClick={()=> {  setIsOpen(false); setShowSuggestions(false);}}
                    className="px-5 py-2.5 hover:bg-gray-50  cursor-pointer border-b flex items-center justify-between group">
                    <div className="flex items-center  gap-2 text-[13px] text-gray-700 font-medium">
                       {item.sub_name}
                    </div>
                    <span className="text-[10px] text-gray-400">{t("subcategory") || "Subcategory"}</span>

                  </Link>
                ))}

                {/* المنتجات (Products) */}
                <div className="max-h-[250px] overflow-y-auto">
                  {suggestions.map((item: any, index: number) => (
                    <div key={index} onClick={() => handleSearch(null as any, locale === "ar" && item.title_ar ? item.title_ar : item.title)}
                      className="px-5 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 flex items-center justify-between group">
                      <span className="text-sm text-gray-800 ">{locale === "ar" && item.title_ar ? item.title_ar : item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex items-center justify-center py-1.5 px-3 text-primary">
        {isOpen ? <X size={15} /> : <SearchIcon size={15} />}
      </button>

      {/* 2. التلفون - الهيكل المفضل لديك */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full z-100 md:hidden p-0 animate-in slide-in-from-top-1 duration-200">
          <form onSubmit={handleSearch} className="flex w-full items-center bg-white border-b border-gray-200 h-14 shadow-lg overflow-hidden">
            <Input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setShowSuggestions(true); }}
              placeholder={t("placeholder")}
              className="border-0 bg-white text-black focus-visible:ring-0 h-full text-[13px] flex-1 px-6 "
            />
            <Button type="submit" variant="ghost" className="bg-white h-full w-16 shrink-0 border-0">
              {isSearching ? <Loader2 className="animate-spin text-chart-1" size={20} /> : <SearchIcon className="text-chart-1" size={20} />}
            </Button>
          </form>

          {showSuggestions && searchValue.length >= 2 && (
            <div className="bg-white w-full border-b shadow-xl max-h-[65vh] overflow-y-auto z-[110]">
               {/* نفس الترتيب للموبايل */}
               {uniqueCategories.map((itemCat: any, idx) => (
                  <Link key={`m-cat-${idx}`}
                    href={`/products/${itemCat.cat_id}`}
                    onClick={()=> {  setIsOpen(false); setShowSuggestions(false);}}
                    className="px-6 py-4 bg-blue-50/50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-primary text-[14px]"> <LayoutGrid size={16} /> {itemCat.cat_Name}</div>
                    <span className="text-[10px] text-primary font-bold">{t("category") || "Category"}</span>

                  </Link>

                ))}
                {uniqueSubcategories.map((item: any, idx) => (
                  <Link key={`m-sub-${idx}`} 
                    href={`/products/${item.cat_id}?sub=${item.sub_id}`}
                    onClick={()=> {  setIsOpen(false); setShowSuggestions(false);}}
                    className="px-6 py-4 border-b flex items-center justify-between">
                     <div className="flex items-center gap-2 font-medium text-gray-700 text-[14px]">{item.sub_name} </div>
                    <span className="text-[10px] text-gray-400">{t("subcategory") || "Subcategory"}</span>
                  </Link>
                ))}
                {suggestions.map((item: any, index: number) => (
                  <div key={index} onClick={() => handleSearch(null as any, locale === "ar" && item.title_ar ? item.title_ar : item.title)}
                    className="px-6 py-4 text-[13px] border-b border-gray-50  text-black flex items-center justify-between">
                    <span>{locale === "ar" && item.title_ar ? item.title_ar : item.title}</span>
                  </div>
                ))}
            </div>
          )}
          <div className="fixed inset-0 top-[120px] bg-black/5 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}