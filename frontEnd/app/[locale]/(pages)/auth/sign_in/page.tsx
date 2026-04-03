"use client";

import { useState } from "react"; // استيراد useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; // سنبقيها فقط للنجاح أو حسب رغبتك

import { loginSchema } from "@/lib/zodSchema";
import { useLoginMutation } from "../../../../../redux/features/auth/AuthapiSlice";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react"; // أيقونة للخطأ

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations("auth.signin");
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null); // حالة الخطأ

  const callbackUrl = searchParams.get("checkout_url") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null); 
    try {
      await login(data).unwrap();
      router.push(callbackUrl);
    } catch (err: any) {
      const serverMessage = err?.data?.message;
      let errorMessage = t("invalid_credentials");

      if (serverMessage === "User not found") {
        errorMessage = t("no_account"); 
      } else if (serverMessage === "Incorrect password") {
        errorMessage = t("incorrect_password");
      } else if (serverMessage === "Email and password are required") {
        errorMessage = t("required_fields");
      }

      setServerError(errorMessage); // تعيين الرسالة لتظهر تحت الحقول
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-chart-1/5 via-white to-white px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <Card className="rounded-[20px] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardContent className="pt-10 pb-10 px-8">

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">
                  {t("email_label")}
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`h-11 rounded-xl border-slate-200 bg-transparent focus:ring-1 focus:ring-chart-1 transition-all ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    {t("password_label")}
                  </label>
                  <Link href="#" className="text-[11px] font-bold text-chart-1 hover:opacity-80">
                    {t("forgot_password")}
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`h-11 rounded-xl border-slate-200 bg-transparent focus:ring-1 focus:ring-chart-1 transition-all ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* قسم رسالة الخطأ الأنيق */}
              {serverError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-[12px] font-medium text-red-600 leading-tight">
                    {serverError}
                  </p>
                </div>
              )}

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-chart-1 hover:bg-chart-1/90 text-white font-bold text-[13px] transition-all active:scale-[0.98] shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? t("loading") : t("submit_btn")}
                </Button>
              </div>
            </form>

            <div className="text-center mt-10">
              <p className="text-slate-500 text-[12px] font-medium">
                {t("no_account")}{" "}
                <Link href="/auth/sign_up" className="text-chart-1 font-bold hover:underline">
                  {t("signup_link")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}