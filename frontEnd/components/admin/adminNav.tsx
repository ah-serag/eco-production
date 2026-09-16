"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  LayoutGrid, Package, ListTree, Users, ShoppingBag,
  LucidePackagePlus, ImageIcon, House,
  PlusCircle, FileSpreadsheet, ImageUp,
  ClipboardList, Receipt, CreditCard, Search,
  Menu, Video, TvMinimalPlay, MonitorUp, Tag
} from "lucide-react";

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
import { Link } from "@/i18n/navigation";

// --- Types ---
interface NavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  pathname: string;
  setOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // حالة التحكم في تصغير وتكبير الشريط الجانبي في الكمبيوتر
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 
        1. شريط الجوال (Mobile Header)
        استخدمنا sticky بدلاً من fixed لكي يدفع المحتوى للأسفل ولا يطفو فوقه
      */}
      <header className="lg:hidden sticky top-0 z-50 flex h-16 shrink-0 w-full items-center justify-between border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -ms-2 text-slate-600 outline-none cursor-pointer hover:bg-slate-100 rounded-md transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[300px] p-0 bg-primary border-none shadow-2xl">
              <div className="sr-only">
                <SheetHeader>
                  <SheetTitle>Admin Menu</SheetTitle>
                  <SheetDescription>Navigation for admin panel</SheetDescription>
                </SheetHeader>
              </div>

              <div className="flex h-16 items-center px-6 border-b border-white/10 bg-black/10">
                <Link href="/" onClick={() => setOpen(false)} className="text-2xl font-serif font-bold tracking-widest uppercase text-white">
                  GOTIY
                </Link>
              </div>
              
              <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 custom-scrollbar">
                <SidebarLinks pathname={pathname} setOpen={setOpen} isCollapsed={false} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </header>

      {/* 
        2. الشريط الجانبي للكمبيوتر (Desktop Sidebar)
        استخدمنا sticky h-screen لكي يلتصق بالشاشة ولكنه يحجز مساحته بجوار المحتوى
      */}
      <aside className={cn(
        "hidden lg:flex sticky top-0 h-screen flex-col bg-primary text-white shadow-xl transition-all duration-300 z-40 shrink-0",
        isCollapsed ? "w-20" : "w-64" // التبديل بين الحجم المصغر والحجم الكامل
      )}>
        {/* هيدر الشريط الجانبي مع زر الفتح والإغلاق */}
        <div className={cn("flex h-16 shrink-0 items-center border-b border-white/10 bg-black/10 px-4", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link href="/" className="text-2xl font-serif font-bold tracking-widest uppercase text-white hover:opacity-90 transition-opacity">
              GOTIY
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-1.5 rounded-md hover:bg-white/10 text-white transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* روابط الشريط */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <SidebarLinks pathname={pathname} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        {/* معلومات المستخدم (مخفية إذا كان الشريط مصغراً) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10 bg-black/5">
            <UserNav />
          </div>
        )}
      </aside>
    </>
  );
}

// --- Sidebar Content Component ---
function SidebarLinks({ pathname, setOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const closeMenu = () => setOpen?.(false);

  // إذا ضغط المستخدم على قائمة مغلقة، يتم تكبير الشريط تلقائياً
  const handleExpand = () => {
    if (isCollapsed && setIsCollapsed) setIsCollapsed(false);
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-1">
      
      <SidebarSimpleLink href="/admin/dashboard" active={pathname === "/admin/dashboard"} icon={<LayoutGrid size={20} />} isCollapsed={isCollapsed} onClick={closeMenu}>
        Dashboard
      </SidebarSimpleLink>

      <AccordionItem value="products" className="border-none">
        <AccordionTrigger onClick={handleExpand} className={cn(
          "hover:no-underline py-2.5 px-3 rounded-md hover:bg-white/10 text-[14px] font-medium text-white/80 hover:text-white transition-all [&[data-state=open]]:bg-white/10 [&[data-state=open]]:text-white",
          isCollapsed && "[&>svg]:hidden justify-center px-0" // إخفاء السهم عند التصغير
        )}>
          <div className="flex items-center gap-3">
            <LucidePackagePlus size={20} className="shrink-0" /> 
            {!isCollapsed && <span>Products</span>}
          </div>
        </AccordionTrigger>
        {!isCollapsed && (
          <AccordionContent className="pb-2 ps-9 space-y-1 pt-1">
            <SectionHeader title="Management" />
            <SidebarSubLink href="/admin/products" active={pathname === "/admin/products"} icon={<Package size={14} />} onClick={closeMenu}>All Products</SidebarSubLink>
            <SectionHeader title="Actions" />
            <SidebarSubLink href="/admin/add_product" active={pathname === "/admin/add_product"} icon={<PlusCircle size={14} />} onClick={closeMenu}>Add Product</SidebarSubLink>
            <SidebarSubLink href="/admin/importExel_products" active={pathname === "/admin/importExel_products"} icon={<FileSpreadsheet size={14} />} onClick={closeMenu}>Import Excel</SidebarSubLink>
          </AccordionContent>
        )}
      </AccordionItem>

      <SidebarSimpleLink href="/admin/categories" active={pathname.includes("/admin/categories")} icon={<ListTree size={20} />} isCollapsed={isCollapsed} onClick={closeMenu}>
        Categories
      </SidebarSimpleLink>

      <AccordionItem value="orders" className="border-none">
        <AccordionTrigger onClick={handleExpand} className={cn(
          "hover:no-underline py-2.5 px-3 rounded-md hover:bg-white/10 text-[14px] font-medium text-white/80 hover:text-white transition-all [&[data-state=open]]:bg-white/10 [&[data-state=open]]:text-white",
          isCollapsed && "[&>svg]:hidden justify-center px-0"
        )}>
          <div className="flex items-center gap-3">
            <ClipboardList size={20} className="shrink-0" /> 
            {!isCollapsed && <span>Orders</span>}
          </div>
        </AccordionTrigger>
        {!isCollapsed && (
          <AccordionContent className="pb-2 ps-9 space-y-1 pt-1">
            <SectionHeader title="Sales Overview" />
            <SidebarSubLink href="/admin/orders" active={pathname === "/admin/orders"} icon={<ClipboardList size={14} />} onClick={closeMenu}>All Orders</SidebarSubLink>
            <SidebarSubLink href="/admin/orders/items" active={pathname === "/admin/orders/items"} icon={<Receipt size={14} />} onClick={closeMenu}>Order Items</SidebarSubLink>
            <SectionHeader title="Financials" />
            <SidebarSubLink href="/admin/orders/transactions" active={pathname === "/admin/orders/transactions"} icon={<CreditCard size={14} />} onClick={closeMenu}>Transactions</SidebarSubLink>
            <SectionHeader title="Search" />
            <SidebarSubLink href="/admin/orders/search" active={pathname === "/admin/orders/search"} icon={<Search size={14} />} onClick={closeMenu}>Find by ID</SidebarSubLink>
          </AccordionContent>
        )}
      </AccordionItem>

      <AccordionItem value="images" className="border-none">
        <AccordionTrigger onClick={handleExpand} className={cn(
          "hover:no-underline py-2.5 px-3 rounded-md hover:bg-white/10 text-[14px] font-medium text-white/80 hover:text-white transition-all [&[data-state=open]]:bg-white/10 [&[data-state=open]]:text-white",
          isCollapsed && "[&>svg]:hidden justify-center px-0"
        )}>
          <div className="flex items-center gap-3">
            <ImageIcon size={20} className="shrink-0" /> 
            {!isCollapsed && <span>Images</span>}
          </div>
        </AccordionTrigger>
        {!isCollapsed && (
          <AccordionContent className="pb-2 ps-9 space-y-1 pt-1">
            <SectionHeader title="Upload" />
            <SidebarSubLink href="/admin/upload_images" active={pathname === "/admin/upload_images"} icon={<ImageUp size={14} />} onClick={closeMenu}>Upload New</SidebarSubLink>
            <SectionHeader title="Library" />
            <SidebarSubLink href="/admin/images_library" active={pathname === "/admin/images_library"} icon={<ImageIcon size={14} />} onClick={closeMenu}>Gallery</SidebarSubLink>
          </AccordionContent>
        )}
      </AccordionItem>

      <AccordionItem value="videos" className="border-none">
        <AccordionTrigger onClick={handleExpand} className={cn(
          "hover:no-underline py-2.5 px-3 rounded-md hover:bg-white/10 text-[14px] font-medium text-white/80 hover:text-white transition-all [&[data-state=open]]:bg-white/10 [&[data-state=open]]:text-white",
          isCollapsed && "[&>svg]:hidden justify-center px-0"
        )}>
          <div className="flex items-center gap-3">
            <Video size={20} className="shrink-0" /> 
            {!isCollapsed && <span>Videos</span>}
          </div>
        </AccordionTrigger>
        {!isCollapsed && (
          <AccordionContent className="pb-2 ps-9 space-y-1 pt-1">
            <SectionHeader title="Upload" />
            <SidebarSubLink href="/admin/video/upload_videos" active={pathname === "/admin/video/upload_videos"} icon={<MonitorUp size={14} />} onClick={closeMenu}>Upload New</SidebarSubLink>
            <SectionHeader title="Library" />
            <SidebarSubLink href="/admin/video/videos_library" active={pathname === "/admin/video/videos_library"} icon={<TvMinimalPlay size={14} />} onClick={closeMenu}>Video Library</SidebarSubLink>
          </AccordionContent>
        )}
      </AccordionItem>

      <SidebarSimpleLink href="/admin/users" active={pathname.includes("/admin/users")} icon={<Users size={20} />} isCollapsed={isCollapsed} onClick={closeMenu}>Users</SidebarSimpleLink>
      <SidebarSimpleLink href="/admin/vendors" active={pathname.includes("/admin/vendors")} icon={<ShoppingBag size={20} />} isCollapsed={isCollapsed} onClick={closeMenu}>Vendors</SidebarSimpleLink>
      <SidebarSimpleLink href="/admin/coupons" active={pathname.includes("/admin/coupons")} icon={<Tag size={20} />} isCollapsed={isCollapsed} onClick={closeMenu}>Coupons</SidebarSimpleLink>

      <AccordionItem value="home-ui" className="border-none">
        <AccordionTrigger onClick={handleExpand} className={cn(
          "hover:no-underline py-2.5 px-3 rounded-md hover:bg-white/10 text-[14px] font-medium text-white/80 hover:text-white transition-all [&[data-state=open]]:bg-white/10 [&[data-state=open]]:text-white",
          isCollapsed && "[&>svg]:hidden justify-center px-0"
        )}>
          <div className="flex items-center gap-3">
            <House size={20} className="shrink-0" /> 
            {!isCollapsed && <span>Home UI</span>}
          </div>
        </AccordionTrigger>
        {!isCollapsed && (
          <AccordionContent className="pb-2 ps-9 space-y-1 pt-1">
            <SectionHeader title="Add Content" />
            <SidebarSubLink href="/admin/home/add/addsections" active={pathname.includes("addsections")} onClick={closeMenu}>Sections</SidebarSubLink>
            <SidebarSubLink href="/admin/home/add/addherobanner" active={pathname.includes("addherobanner")} onClick={closeMenu}>Hero Banner</SidebarSubLink>
            <SidebarSubLink href="/admin/home/add/addCategoryHome" active={pathname.includes("addCategoryHome")} onClick={closeMenu}>Category</SidebarSubLink>
            <SidebarSubLink href="/admin/home/add/addProductHome" active={pathname.includes("addProductHome")} onClick={closeMenu}>Product</SidebarSubLink>
            <SidebarSubLink href="/admin/home/add/addLimitedOffer" active={pathname.includes("addLimitedOffer")} onClick={closeMenu}>Limit Offers</SidebarSubLink>
            <SidebarSubLink href="/admin/home/add/addsubCategoryBanner" active={pathname.includes("addsubCategoryBanner")} onClick={closeMenu}>SubCategory Banner</SidebarSubLink>
            
            <div className="my-2 border-t border-white/10" />
            
            <SectionHeader title="Edit & Preview" />
            <SidebarSubLink href="/admin/home/edit/editAllsections" active={pathname.includes("editAllsections")} onClick={closeMenu}>Preview All</SidebarSubLink>
            <SidebarSubLink href="/admin/home/edit/editHerobanner" active={pathname.includes("editHerobanner")} onClick={closeMenu}>Edit Banner</SidebarSubLink>
            <SidebarSubLink href="/admin/home/edit/editCategoryHome" active={pathname.includes("editCategoryHome")} onClick={closeMenu}>Edit Category</SidebarSubLink>
            <SidebarSubLink href="/admin/home/edit/editLimitedOffer" active={pathname.includes("editLimitedOffer")} onClick={closeMenu}>Edit Limit Offers</SidebarSubLink>
            <SidebarSubLink href="/admin/home/edit/editSubcategoryBanner" active={pathname.includes("editSubcategoryBanner")} onClick={closeMenu}>Edit SubCategory Banner</SidebarSubLink>
          </AccordionContent>
        )}
      </AccordionItem>

    </Accordion>
  );
}

// --- Helpers for Sidebar UI ---
function SidebarSimpleLink({ href, icon, children, active, isCollapsed, onClick }: NavItemProps) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      title={isCollapsed ? children : undefined} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-all duration-200",
        active ? "bg-white text-primary shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white",
        isCollapsed && "justify-center px-0"
      )}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
}

function SidebarSubLink({ href, icon, children, active, onClick }: NavItemProps) {
  return (
    <Link href={href} onClick={onClick} className={cn(
      "flex items-center gap-2.5 py-2 px-3 rounded-md text-[13px] transition-all duration-200",
      active ? "bg-white/20 text-white font-semibold" : "text-white/60 hover:bg-white/10 hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1"
    )}>
      {icon} <span>{children}</span>
    </Link>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <div className="px-3 py-1.5 mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</div>;
}