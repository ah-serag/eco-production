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
import { LogOut, User as UserIcon, Settings, Package, ChevronDown } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/AuthapiSlice";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

export function UserNav() {
  const t = useTranslations("user_nav");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data, isLoading, isError } = useGetUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3 w-16 opacity-50" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <Link 
        href="/auth/sign_in" 
        className={`${isAr ? "text-[10px]" : "text-[11px]"}  text-slate-500 font-bold rounded-full border px-3 py-1.5 border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95`}
      >
        {t("sign_in")}
      </Link>
    );
  }

  const user = data.data;
  const firstLetter = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
  const firstName = user.full_name ? user.full_name.split(' ')[0] : "User";

  const handleLogout = async () => { 
    await logout(undefined).unwrap();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-2 group border  shadow-sm  bg-slate-50 outline-none hover:bg-slate-100 p-1 ${isAr ? 'pl-2.5 pr-2 flex-row-reverse' : 'pr-2.5 pl-1.5'} rounded-full transition-all border border-slate-100/50 hover:border-slate-200`}>
          
          <div className="h-7 w-7 flex items-center justify-center border rounded-full bg-white text-chart-1 shadow-sm text-[10px] font-bold  shrink-0">
            {firstLetter}
          </div>
          
          <div className={`flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
            <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-bold text-slate-600 hidden sm:block truncate max-w-20`}>
              {firstName}
            </span>
            <ChevronDown size={11} className="text-slate-400 group-hover:text-slate-500 transition-colors" />
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-52 mt-2 p-1.5 shadow-xl border-slate-200/60 bg-white" 
        align={isAr ? "start" : "end"}
      >
        <DropdownMenuLabel className="p-2">
          <div className={`flex flex-col space-y-0.5 ${isAr ? "text-right" : "text-left"}`}>
            <p className={`${isAr ? "text-[13.5px]" : "text-[12.5px]"} font-bold text-slate-700 tracking-tight`}>{user.full_name}</p>
            <p className="text-[10.5px] text-slate-400 font-medium truncate lowercase">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-100" />
        
        <div className="py-1">
          {[
            { href: "/profile", icon: UserIcon, label: t("profile") },
            { href: "/orders", icon: Package, label: t("orders") },
            { href: "/settings", icon: Settings, label: t("settings") },
          ].map((item, idx) => (
            <DropdownMenuItem key={idx} asChild className="cursor-pointer py-2.5 px-2 focus:bg-slate-50 rounded-lg group">
              <Link href={item.href} className={`flex items-center w-full ${isAr ? "flex-row-reverse text-right" : ""}`}>
                <item.icon className={`${isAr ? "ml-2.5" : "mr-2.5"} h-3.5 w-3.5 text-slate-400 group-hover:text-slate-500 transition-colors`} />
                <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-semibold text-slate-600 group-hover:text-slate-800`}>
                  {item.label}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-slate-100" />
        
        <DropdownMenuItem 
          className={`flex items-center w-full cursor-pointer py-2.5 px-2 focus:bg-rose-50/50 rounded-lg group ${isAr ? "flex-row-reverse text-right" : ""}`}
          onClick={() => handleLogout()}
        >
          <LogOut className={`${isAr ? "ml-2.5" : "mr-2.5"} h-3.5 w-3.5 text-blue-900  transition-colors`} />
          <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-bold text-blue-900 `}>
            {t("sign_out")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}