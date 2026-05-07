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
import { LogOut, User as UserIcon, Settings, Package, UserRound, UserPlus, Fingerprint, Languages } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/AuthapiSlice";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import MobileLanguageSwitcher from "../public/MobileLangSwitch";

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

  const isGuest = isError || !data?.data;
  const user = data?.data;
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : t("guest");

  const handleLogout = async () => { 
    await logout(undefined).unwrap();
  };



  return (
    <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={`flex items-center hover:bg-gray-100 gap-2 group p-1 ${isAr ? 'pl-2.5 pr-2 flex-row-reverse' : 'pr-2.5 pl-1.5'} rounded-full transition-all`}>
            <UserRound size={17} className="text-primary" strokeWidth={2.5}/>
            <div className={`flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
              <span className={`text-[12px] uppercase font-bold text-primary hidden sm:block truncate max-w-20`}>
                {isGuest ? t("login_title") : firstName}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-52 mt-2 p-1.5 shadow-xl border-slate-200/60 bg-white" 
          align={isAr ? "start" : "end"}
        >
       

           
          {isGuest ? (
            <div className="py-1">
              <DropdownMenuLabel className={`p-2 pb-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>
                {t("welcome_msg")}
              </DropdownMenuLabel>
               
               <MobileLanguageSwitcher/>


              <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-2 focus:bg-slate-50 rounded-lg group">
                <Link href="/auth/sign_in" className={`flex items-center w-full ${isAr ? "flex-row-reverse text-right" : ""}`}>
                  <Fingerprint className={`${isAr ? "ml-2.5" : "mr-2.5"} h-4 w-4 text-slate-400 group-hover:text-primary transition-colors`} />
                  <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-bold text-slate-700`}>
                    {t("sign_in")}
                  </span>
                </Link>
              </DropdownMenuItem>
             
              <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-2 focus:bg-slate-50 rounded-lg group">
                <Link href="/auth/sign_up" className={`flex items-center w-full ${isAr ? "flex-row-reverse text-right" : ""}`}>
                  <UserPlus className={`${isAr ? "ml-2.5" : "mr-2.5"} h-4 w-4 text-slate-400 group-hover:text-primary transition-colors`} />
                  <span className={` font-semibold text-slate-600`}>
                    {t("create_account")}
                  </span>
                </Link>
              </DropdownMenuItem>
            </div>
          ) : (
            <>
              <DropdownMenuLabel className="p-2">
                <div className={`flex flex-col space-y-0.5 ${isAr ? "text-right" : "text-left"}`}>
                  <p className={`${isAr ? "text-[13.5px]" : "text-[12.5px]"} font-semibold uppercase text-slate-700 tracking-tight`}>{user.full_name}</p>
                  <p className="text-[10.5px] text-slate-400 font-normal truncate lowercase">{user.email}</p>
                </div>
              </DropdownMenuLabel>
                 
              <DropdownMenuSeparator className="bg-slate-100" />

             <MobileLanguageSwitcher/>

              <DropdownMenuSeparator className="bg-slate-100" />

              <div className="py-1">
                {[
                  { href: "/profile", icon: UserIcon, label: t("profile") },
                ].map((item, idx) => (
                  <DropdownMenuItem key={idx} asChild className="cursor-pointer py-2.5 px-2 focus:bg-blue-200 bg-blue-100  group">
                    <Link href={item.href} className={`flex items-center w-full ${isAr ? "flex-row-reverse text-right" : ""}`}>
                      <item.icon className={`${isAr ? "ml-2.5" : "mr-2.5"} h-3.5 w-3.5 text-slate-500 group-hover:text-slate-600 transition-colors`} />
                      <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-normal text-slate-600 group-hover:text-slate-800`}>
                        {item.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
                 <div className="py-1">
                {[
                  { href: "/orders", icon: Package, label: t("orders") },
                ].map((item, idx) => (
                  <DropdownMenuItem key={idx} asChild className="cursor-pointer py-2.5 px-2 focus:bg-green-200 bg-green-100  group">
                    <Link href={item.href} className={`flex items-center w-full ${isAr ? "flex-row-reverse text-right" : ""}`}>
                      <item.icon className={`${isAr ? "ml-2.5" : "mr-2.5"} h-3.5 w-3.5 text-slate-500 group-hover:text-slate-600   transition-colors`} />
                      <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-normal text-slate-600 group-hover:text-slate-800`}>
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
                <LogOut className={`${isAr ? "ml-2.5" : "mr-2.5"} h-3.5 w-3.5 text-slate-500 transition-colors`} />
                <span className={`${isAr ? "text-[13px]" : "text-[12px]"} font-normal `}>
                  {t("sign_out")}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}