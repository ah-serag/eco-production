"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  LayoutGrid,
  PlusCircle,
  Package,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "bg-white border-r shadow-lg flex flex-col transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* HEADER */}
        <div
          className={cn(
            "flex items-center border-b",
            sidebarOpen
              ? "justify-between px-4 py-4"
              : "justify-center py-4"
          )}
        >
          {sidebarOpen && (
            <span className="text-lg font-semibold text-cyan-950 tracking-wide">
              Vendor Panel
            </span>
          )}

          <button
            className="text-gray-500 hover:text-cyan-700 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1 px-2 py-4">
          <NavItem
            href="/vendor/dashboard"
            icon={<LayoutGrid size={20} />}
            open={sidebarOpen}
            active={pathname === "/vendor/dashboard"}
          >
            Dashboard
          </NavItem>

          <NavItem
            href="/vendor/addProduct"
            icon={<PlusCircle size={20} />}
            open={sidebarOpen}
            active={pathname === "/vendor/addProduct"}
          >
            Add Product
          </NavItem>

          <NavItem
            href="/vendor/products"
            icon={<Package size={20} />}
            open={sidebarOpen}
            active={pathname === "/vendor/products"}
          >
            Products
          </NavItem>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-white p-2">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
  open,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-lg px-3 py-2 transition-all",
        !open && "justify-center",
        active
          ? "bg-gray-200 text-cyan-950"
          : "text-cyan-950 hover:bg-gray-200"
      )}
    >
      <span className={active ? "text-cyan-700" : ""}>{icon}</span>
      {open && <span className="text-sm font-medium">{children}</span>}
    </Link>
  );
}
