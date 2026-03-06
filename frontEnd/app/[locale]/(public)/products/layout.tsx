"use client";

import { ReactNode } from "react";
import FilterSidebar from "@/components/search/sidebarFilter";

interface SearchLayoutProps {
  children: ReactNode;
}

export default function SearchLayout({ children }: SearchLayoutProps) {

  return (
    <div className="container mx-auto ">
      <div className="flex ">
        <aside className="" >
          <FilterSidebar
          />
        </aside>

        {/* Content */}
        <main className="flex-1 p-2 pb-15">{children}</main>
      </div>
    </div>
  );
}
