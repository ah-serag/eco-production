"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useGetCategoryOptionClientQuery } from "../../redux/features/home/homeclientslice";
import Link from "next/link";

export function NavbarCategories() {
  const { data, isLoading } = useGetCategoryOptionClientQuery(undefined);

  if (isLoading) {
    return (
      <Button variant="ghost" disabled className="text-muted-foreground">
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 text-sm">
          Categories
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {data?.map((cat: { id: number; name: string }, index :any) => (
         <Link
          key={index}
           href={`/categoryproducts/${cat.id}`}
           className="shrink-0 rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl p-2"
         >
          <DropdownMenuItem key={cat.id}>
            {cat.name}
          </DropdownMenuItem>

        </Link>
      
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
