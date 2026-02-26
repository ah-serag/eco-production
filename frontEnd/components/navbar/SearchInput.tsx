"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="flex w-full items-center bg-gray-50 rounded-full border border-gray-200 h-10 overflow-hidden focus-within:ring-2 focus-within:ring-chart-1/20 transition-all"
    >
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search products..."
        className="border-0 bg-transparent text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm flex-1 px-5"
      />
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="bg-[oklch(53.679%_0.13515_245.014)] text-white h-full w-12 rounded-none hover:bg-chart-1/80 transition-colors shrink-0"
      >
        <SearchIcon size={18} />
      </Button>
    </form>
  );
}