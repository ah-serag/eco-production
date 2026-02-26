"use client";

import { useGetUserInfoQuery } from "@/redux/features/home/homeclientslice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { LogOut, User as UserIcon, Settings, Package, ChevronDown } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/AuthapiSlice";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { data, isLoading, isError } = useGetUserInfoQuery(undefined);
const [logout] = useLogoutMutation();
 const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <Link 
        href="/auth/sign_in" 
        className="text-[12px] font-bold text-slate-700 hover:text-black transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const user = data.data;
  const firstLetter = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
  const firstName = user.full_name ? user.full_name.split(' ')[0] : "User";
  

  const handleLogout = async () => { 
     await  logout(undefined).unwrap()

  
    }


  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 group outline-none hover:bg-slate-100 p-1 pr-2 rounded-full transition-all border border-transparent hover:border-slate-100">
          
          {/* Professional Circle with Chart-1 color */}
          <div className="h-7 w-7 flex items-center justify-center rounded-full bg-chart-1 text-white text-[11px] font-bold shadow-sm">
            {firstLetter}
          </div>
          
          {/* Tiny & Clean Typography */}
          <div className="flex items-center gap-1  sm:flex">
            <span className="text-[12px] font-bold text-slate-600 hidden sm:block truncate max-w-[70px]">
              {firstName}
            </span>
            <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-52 mt-2 p-1.5 shadow-xl border-slate-200" align="end">
        <DropdownMenuLabel className="p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-[13px] font-bold text-slate-900">{user.full_name}</p>
            <p className="text-[11px] text-slate-500 truncate lowercase">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="opacity-50" />
        
        <div className="py-1">
          <DropdownMenuItem asChild className="cursor-pointer text-[12px] focus:bg-slate-50 py-2">
            <Link href="/profile" className="flex items-center">
              <UserIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-[12px] focus:bg-slate-50 py-2">
            <Link href="/orders" className="flex items-center">
              <Package className="mr-2 h-3.5 w-3.5 text-slate-400" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer text-[12px] focus:bg-slate-50 py-2">
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-3.5 w-3.5 text-slate-400" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="opacity-50" />
        
        <DropdownMenuItem 
          className="text-red-600 text-[12px] cursor-pointer focus:bg-red-50 focus:text-red-700 py-2 font-bold"
          onClick={() =>  handleLogout() }
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}