"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  LayoutGrid, Package, ListTree, Users, ShoppingBag, 
  LucidePackagePlus, ImageIcon, House, ChevronDown,
  PlusCircle, FileSpreadsheet, ImageUp, 
  ClipboardList, Receipt, CreditCard, Search,
  Menu
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import { UserNav } from "../navbar/userNav";

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // حل مشكلة Hydration: الانتظار حتى يتم تحميل المكون على المتصفح
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-13 items-center justify-between px-6">
        
        <div className="flex items-center gap-4">
          {/* زر قائمة الموبايل */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-slate-600 outline-none cursor-pointer">
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
                {/* حل مشكلة Accessibility: عناوين مخفية لقارئ الشاشة */}
                <div className="sr-only">
                  <SheetHeader>
                    <SheetTitle>Admin Menu</SheetTitle>
                    <SheetDescription>Navigation for admin panel</SheetDescription>
                  </SheetHeader>
                </div>

                <div className="p-6 border-b bg-slate-50/50">
                  <span className="text-xl font-semibold tracking-tighter text-gray-900">
                    Vexa <span className="text-chart-1">Admin</span>
                  </span>
                </div>
                
                <div className="p-2">
                  <Accordion type="single" collapsible className="w-full">
                    <MobileSimpleLink href="/admin/dashboard" active={pathname === "/admin/dashboard"} icon={<LayoutGrid size={18} />} onClick={() => setOpen(false)}>
                      Dashboard
                    </MobileSimpleLink>

                    {/* Products */}
                    <AccordionItem value="products" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md hover:bg-slate-50 text-[13px] font-medium text-slate-600">
                        <div className="flex items-center gap-3"><LucidePackagePlus size={18} /> Products</div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-9 space-y-1">
                        <SectionHeader title="Management" />
                        <MobileSubLink href="/admin/products" icon={<Package size={14} />} onClick={() => setOpen(false)}>All Products</MobileSubLink>
                        <SectionHeader title="Actions" />
                        <MobileSubLink href="/admin/add_product" icon={<PlusCircle size={14} />} onClick={() => setOpen(false)}>Add Product</MobileSubLink>
                        <MobileSubLink href="/admin/importExel_products" icon={<FileSpreadsheet size={14} />} onClick={() => setOpen(false)}>Import Excel</MobileSubLink>
                      </AccordionContent>
                    </AccordionItem>

                    <MobileSimpleLink href="/admin/categories" active={pathname.includes("categories")} icon={<ListTree size={18} />} onClick={() => setOpen(false)}>
                      Categories
                    </MobileSimpleLink>

                    {/* Orders */}
                    <AccordionItem value="orders" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md hover:bg-slate-50 text-[13px] font-medium text-slate-600">
                        <div className="flex items-center gap-3"><ClipboardList size={18} /> Orders</div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-9 space-y-1">
                        <SectionHeader title="Sales Overview" />
                        <MobileSubLink href="/admin/orders" icon={<ClipboardList size={14} />} onClick={() => setOpen(false)}>All Orders</MobileSubLink>
                        <MobileSubLink href="/admin/orders/items" icon={<Receipt size={14} />} onClick={() => setOpen(false)}>Order Items</MobileSubLink>
                        <SectionHeader title="Financials" />
                        <MobileSubLink href="/admin/orders/transactions" icon={<CreditCard size={14} />} onClick={() => setOpen(false)}>Transactions</MobileSubLink>
                        <SectionHeader title="Search" />
                        <MobileSubLink href="/admin/orders/search" icon={<Search size={14} />} onClick={() => setOpen(false)}>Find by ID</MobileSubLink>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Images */}
                    <AccordionItem value="images" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md hover:bg-slate-50 text-[13px] font-medium text-slate-600">
                        <div className="flex items-center gap-3"><ImageIcon size={18} /> Images</div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-9 space-y-1">
                        <SectionHeader title="Upload" />
                        <MobileSubLink href="/admin/upload_images" icon={<ImageUp size={14} />} onClick={() => setOpen(false)}>Upload New</MobileSubLink>
                        <SectionHeader title="Library" />
                        <MobileSubLink href="/admin/images_library" icon={<ImageIcon size={14} />} onClick={() => setOpen(false)}>Gallery</MobileSubLink>
                      </AccordionContent>
                    </AccordionItem>

                    <MobileSimpleLink href="/admin/users" active={pathname.includes("users")} icon={<Users size={18} />} onClick={() => setOpen(false)}>Users</MobileSimpleLink>
                    <MobileSimpleLink href="/admin/vendors" active={pathname.includes("vendors")} icon={<ShoppingBag size={18} />} onClick={() => setOpen(false)}>Vendors</MobileSimpleLink>

                    {/* Home UI */}
                    <AccordionItem value="home-ui" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md hover:bg-slate-50 text-[13px] font-medium text-slate-600">
                        <div className="flex items-center gap-3"><House size={18} /> Home UI</div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-9 space-y-1">
                        <SectionHeader title="Add Content" />
                        <MobileSubLink href="/admin/home/add/addsections" onClick={() => setOpen(false)}>Sections</MobileSubLink>
                        <MobileSubLink href="/admin/home/add/addherobanner" onClick={() => setOpen(false)}>Hero Banner</MobileSubLink>
                        <MobileSubLink href="/admin/home/add/addCategoryHome" onClick={() => setOpen(false)}>Category</MobileSubLink>
                        <MobileSubLink href="/admin/home/add/addProductHome" onClick={() => setOpen(false)}>Product</MobileSubLink>
                        <MobileSubLink href="/admin/home/add/addLimitedOffer" onClick={() => setOpen(false)}>limit Offers</MobileSubLink>
                        <MobileSubLink href="/admin/home/add/addsubCategoryBanner" onClick={() => setOpen(false)}>add subCategory Banner</MobileSubLink>
                        <SectionHeader title="Edit & Preview" />
                        <MobileSubLink href="/admin/home/edit/editAllsections" onClick={() => setOpen(false)}>Preview All</MobileSubLink>
                        <MobileSubLink href="/admin/home/edit/editHerobanner" onClick={() => setOpen(false)}>Edit Banner</MobileSubLink>
                        <MobileSubLink href="/admin/home/edit/editCategoryHome" onClick={() => setOpen(false)}>Edit Category</MobileSubLink>
                        <MobileSubLink href="/admin/home/edit/editLimitedOffer" onClick={() => setOpen(false)}>Edit limit Offers</MobileSubLink>
                        <MobileSubLink href="/admin/home/edit/editSubcategoryBanner" onClick={() => setOpen(false)}>Edit subCategory Banner</MobileSubLink>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* اللوجو - ظاهر دائماً */}
          <Link href="/admin/dashboard" className="flex items-center gap-2 mr-4 group"> 
            <span className="text-[18px] lg:text-[20px] font-semibold tracking-tighter text-gray-900">
              Vexa <span className="text-chart-1">Admin</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem href="/admin/dashboard" active={pathname === "/admin/dashboard"} icon={<LayoutGrid size={16} />}>Dashboard</NavItem>
            
            <MenuDropdown label="Products" icon={<LucidePackagePlus size={16} />} active={pathname.includes("product")}>
              <SectionHeader title="Management" />
              <MenuLink href="/admin/products" icon={<Package size={14} />}>All Products</MenuLink>
              <SectionHeader title="Actions" />
              <MenuLink href="/admin/add_product" icon={<PlusCircle size={14} />}>Add Product</MenuLink>
              <MenuLink href="/admin/importExel_products" icon={<FileSpreadsheet size={14} />}>Import Excel</MenuLink>
            </MenuDropdown>

            <NavItem href="/admin/categories" active={pathname.includes("categories")} icon={<ListTree size={16} />}>Categories</NavItem>

            <MenuDropdown label="Orders" icon={<ClipboardList size={16} />} active={pathname.includes("orders")}>
              <SectionHeader title="Sales Overview" />
              <MenuLink href="/admin/orders" icon={<ClipboardList size={14} />}>All Orders</MenuLink>
              <MenuLink href="/admin/orders/items" icon={<Receipt size={14} />}>Order Items</MenuLink>
              <SectionHeader title="Financials" />
              <MenuLink href="/admin/orders/transactions" icon={<CreditCard size={14} />}>Transactions</MenuLink>
              <SectionHeader title="Search" />
              <MenuLink href="/admin/orders/search" icon={<Search size={14} />}>Find by ID</MenuLink>
            </MenuDropdown>

            <MenuDropdown label="Images" icon={<ImageIcon size={16} />} active={pathname.includes("images")}>
              <SectionHeader title="Upload" />
              <MenuLink href="/admin/upload_images" icon={<ImageUp size={14} />}>Upload New</MenuLink>
              <SectionHeader title="Library" />
              <MenuLink href="/admin/images_library" icon={<ImageIcon size={14} />}>Gallery</MenuLink>
            </MenuDropdown>
            
            <NavItem href="/admin/users" active={pathname.includes("users")} icon={<Users size={16} />}>Users</NavItem>
            <NavItem href="/admin/vendors" active={pathname.includes("vendors")} icon={<ShoppingBag size={16} />}>Vendors</NavItem>

            <MenuDropdown label="Home UI" icon={<House size={16} />} active={pathname.includes("home")}>
              <div className="grid grid-cols-2 w-[400px]">
                <div className="border-r p-1">
                  <SectionHeader title="Add Content" />
                  <MenuLink href="/admin/home/add/addsections">Sections</MenuLink>
                  <MenuLink href="/admin/home/add/addherobanner">Hero Banner</MenuLink>
                  <MenuLink href="/admin/home/add/addCategoryHome">Category</MenuLink>
                  <MenuLink href="/admin/home/add/addProductHome">Product</MenuLink>
                  <MenuLink href="/admin/home/add/addLimitedOffer">limit Offers</MenuLink>
                  <MenuLink href="/admin/home/add/addsubCategoryBanner">add subCategory Banner</MenuLink>
                </div>
                <div className="p-1">
                  <SectionHeader title="Edit & Preview" />
                  <MenuLink href="/admin/home/edit/editAllsections">Preview All</MenuLink>
                  <MenuLink href="/admin/home/edit/editHerobanner">Edit Banner</MenuLink>
                  <MenuLink href="/admin/home/edit/editCategoryHome">Edit Category</MenuLink>
                  <MenuLink href="/admin/home/edit/editLimitedOffer">Edit limit Offers</MenuLink>
                  <MenuLink href="/admin/home/edit/editSubcategoryBanner">Edit subCategory Banner</MenuLink>
                </div>
              </div>
            </MenuDropdown>
          </nav>
        </div>

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

function MobileSimpleLink({ href, icon, children, active, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium mb-1",
      active ? "bg-chart-1/10 text-chart-1" : "text-slate-600 hover:bg-slate-50"
    )}>
      {icon} {children}
    </Link>
  );
}

function MobileSubLink({ href, icon, children, onClick }: any) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2 py-2 text-[12px] text-slate-500 hover:text-chart-1">
      {icon} {children}
    </Link>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>;
}