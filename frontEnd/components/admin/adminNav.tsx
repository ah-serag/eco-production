"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, Package, ListTree, Users, ShoppingBag, 
  LucidePackagePlus, Image as ImageIcon, House, ChevronDown,
  PlusCircle, FileSpreadsheet, ImageUp, 
  ClipboardList, Receipt, CreditCard, Search, // أيقونات جديدة للطلبات
  UserStar
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserNav } from "../navbar/userNav";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-13 items-center justify-between px-6">
        
        <div className="flex items-center gap-4">
       <Link href="/admin/dashboard" className="flex items-center gap-2 mr-4 group"> 
          <span className="text-[20px] font-semibold  tracking-tighter text-gray-900 hidden lg:block">
           Vexa <span className="text-chart-1">Admin</span>
           </span>
        </Link>

          <nav className="flex items-center gap-1">
            <NavItem href="/admin/dashboard" active={pathname === "/admin/dashboard"} icon={<LayoutGrid size={16} />}>
              Dashboard
            </NavItem>
            
            {/* Products Dropdown */}
            <MenuDropdown 
              label="Products" 
              icon={<LucidePackagePlus size={16} />} 
              active={pathname.includes("product") || pathname.includes("importExel")}
            >
              <SectionHeader title="Management" />
              <MenuLink href="/admin/products" icon={<Package size={14} />}>All Products</MenuLink>
              <SectionHeader title="Actions" />
              <MenuLink href="/admin/add_product" icon={<PlusCircle size={14} />}>Add Product</MenuLink>
              <MenuLink href="/admin/importExel_products" icon={<FileSpreadsheet size={14} />}>Import Excel</MenuLink>
            </MenuDropdown>

            <NavItem href="/admin/categories" active={pathname.includes("categories")} icon={<ListTree size={16} />}>
              Categories
            </NavItem>

            {/* --- قسم الطلبات الجديد (Orders) --- */}
            <MenuDropdown 
              label="Orders" 
              icon={<ClipboardList size={16} />} 
              active={pathname.includes("orders")}
            >
              <SectionHeader title="Sales Overview" />
              <MenuLink href="/admin/orders" icon={<ClipboardList size={14} />}>All Orders</MenuLink>
              <MenuLink href="/admin/orders/items" icon={<Receipt size={14} />}>Order Items</MenuLink>
              
              <SectionHeader title="Financials" />
              <MenuLink href="/admin/orders/transactions" icon={<CreditCard size={14} />}>Transactions</MenuLink>
              
              <SectionHeader title="Search" />
              <MenuLink href="/admin/orders/search" icon={<Search size={14} />}>Find by ID</MenuLink>
            </MenuDropdown>

            {/* Images Dropdown */}
            <MenuDropdown 
              label="Images" 
              icon={<ImageIcon size={16} />} 
              active={pathname.includes("images")}
            >
              <SectionHeader title="Upload" />
              <MenuLink href="/admin/upload_images" icon={<ImageUp size={14} />}>Upload New</MenuLink>
              <SectionHeader title="Library" />
              <MenuLink href="/admin/images_library" icon={<ImageIcon size={14} />}>Gallery</MenuLink>
            </MenuDropdown>
            
            <NavItem href="/admin/users" active={pathname.includes("users")} icon={<Users size={16} />}>
              Users
            </NavItem>

            <NavItem href="/admin/vendors" active={pathname.includes("vendors")} icon={<ShoppingBag size={16} />}>
              Vendors
            </NavItem>

            {/* Home Dropdown */}
            <MenuDropdown 
              label="Home UI" 
              icon={<House size={16} />} 
              active={pathname.includes("home")}
            >
              <div className="grid grid-cols-2 w-[400px]">
                <div className="border-r p-1">
                  <SectionHeader title="Add Content" />
                  <MenuLink href="/admin/home/add/addsections">Sections</MenuLink>
                  <MenuLink href="/admin/home/add/addherobanner">Hero Banner</MenuLink>
                  <MenuLink href="/admin/home/add/addCategoryHome">Category</MenuLink>
                  <MenuLink href="/admin/home/add/addProductHome">Product</MenuLink>
                  <MenuLink href="/admin/home/add/addLimitedOffer">Offers</MenuLink>
                </div>
                <div className="p-1">
                  <SectionHeader title="Edit & Preview" />
                  <MenuLink href="/admin/home/edit/editAllsections">Preview All</MenuLink>
                  <MenuLink href="/admin/home/edit/editHerobanner">Edit Banner</MenuLink>
                  <MenuLink href="/admin/home/edit/editCategoryHome">Edit Category</MenuLink>
                  <MenuLink href="/admin/home/edit/editLimitedOffer">Edit Offers</MenuLink>
                </div>
              </div>
            </MenuDropdown>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </div>
    </header>
  );
}


// --- Helpers ---

function NavItem({ href, icon, children, active }: any) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all",
      active ? "bg-chart-1 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    )}>
      {icon} <span>{children}</span>
    </Link>
  );
}

function MenuDropdown({ label, icon, active, children }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all outline-none",
        active ? "bg-chart-1 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
      )}>
        {icon} <span>{label}</span> <ChevronDown size={12} className="opacity-40" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-1.5 shadow-xl border-slate-200 min-w-[180px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuLink({ href, icon, children }: any) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className="flex items-center gap-2 px-2 py-1.5 text-[12px] cursor-pointer rounded-md focus:bg-slate-50">
        {icon} <span>{children}</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>;
}