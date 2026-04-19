"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl"; // استيراد الترجمة

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react"; // أيقونة للخطأ

import { registerSchema } from "@/lib/zodSchema";
import { useRegisterMutation } from "../../../../../redux/features/auth/AuthapiSlice";
import { Link, useRouter } from "@/i18n/navigation";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({ 
    resolver: zodResolver(registerSchema) 
  });

 const onSubmit = async (values: any) => {
    setServerError(null); // تصفير الخطأ عند كل محاولة جديدة
    try {
      await registerUser(values).unwrap();
      router.push("/");
    } catch (err: any) {
      const serverMsg = err.data?.message;
      let errorMessage = t("required"); 

       if (serverMsg === "Email is already registered as a member.") {
        errorMessage = t("already_registered");
      } else if (serverMsg === "Full name, email, and password are required.") {
        errorMessage = t("required");
      } else if (err.status === 500) {``
        errorMessage = t("internal_error");
      }else if (err?.data == "Please try again after 15 minutes."){
        errorMessage = t("limitedReqest")
      }

      setServerError(errorMessage);

      if (err.data?.errors && Array.isArray(err.data.errors)) {
        err.data.errors.forEach((e: any) => {
          if (e.field) {
            setError(e.field as any, { 
              type: "server", 
              message: e.message 
            });
          }
        });
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-linear-to-t from-secondary/5 via-white to-white px-4">
      <div className="w-full max-w-[420px]">
        <Card className="rounded-[20px] border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="pt-8 pb-6 px-6">
  

                  <div className=" w-full flex justify-center  text-center mb-8  ">
                    <Link
                      href="/"
                      className="group "
                    >
                      <span className="relative  text-4xl font-serif font-bold tracking-widest uppercase text-primary">
                        
                        <span className="">GOTIY</span>
                  
                      </span>
                    </Link>
                  </div>
               
                                

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* الاسم الكامل */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  {t("full_name_label")}
                </label>
                <Input 
                  placeholder={t("full_name_placeholder")} 
                  {...register("full_name")} 
                  className="h-10 text-[13px] rounded-lg border-slate-200 focus:ring-1 focus:ring-chart-1" 
                />
                {errors.full_name && (
                  <p className="text-[10px] text-red-500 px-1">{(errors.full_name as any).message}</p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  {t("email_label")}
                </label>
                <Input 
                  type="email" 
                  placeholder="name@email.com"
                  {...register("email")} 
                  className="h-10 text-[13px] rounded-lg border-slate-200 focus:ring-1 focus:ring-chart-1" 
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 px-1">{(errors.email as any).message}</p>
                )}
              </div>

              {/* كلمات المرور */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {t("password_label")}
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    {...register("password")} 
                    className="h-10 text-[13px] rounded-lg border-slate-200 focus:ring-1 focus:ring-chart-1" 
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-500 px-1 leading-tight">{(errors.password as any).message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {t("confirm_password_label")}
                  </label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                     {...register("confirmPassword")} 
                    className="h-10 text-[13px] rounded-lg border-slate-200 focus:ring-1 focus:ring-chart-1" 
                  />
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-500 px-1 leading-tight">{(errors.confirmPassword as any).message}</p>
                  )}
                </div>
              </div>

              {/* رسالة الخطأ من السيرفر */}
              {serverError && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <p className="text-[11px] font-medium text-red-600 leading-none">{serverError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-chart-1 hover:bg-chart-1/90 text-white font-bold text-[13px] mt-2 shadow-sm active:scale-[0.98] transition-all" 
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("submit_btn")}
              </Button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-slate-50">
              <p className="text-slate-400 text-[12px] font-medium">
                {t("already_have_account")}{" "}
                <Link href="/auth/sign_in" className="text-chart-1 font-bold hover:underline">
                  {t("login_link")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}