"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // أضفنا useSearchParams

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { loginSchema } from "@/lib/zodSchema";
import { useLoginMutation } from "../../../../../redux/features/auth/AuthapiSlice";
import { Link } from "@/i18n/navigation";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [login, { isLoading }] = useLoginMutation();

  const callbackUrl = searchParams.get("checkout_url")  || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

        router.push(callbackUrl);
     
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-chart-1/10 via-white to-white px-4">
      
      <div className="w-full max-w-[400px] space-y-6">

        <Card className="rounded-[20px] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardContent className="pt-10 pb-10 px-8">
            <div className="text-center mb-4">
              <div className="flex flex-col items-center gap-5 mb-2">
                <Link href="/">
                   <Image 
                   src="/photo/tmara.svg" 
                    alt="Logo" 
                    width={90} 
                    height={35} 
                    priority 
                    className="object-contain mb-5"
                  />
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`h-11 rounded-xl border-slate-200 bg-transparent focus:ring-1 focus:ring-chart-1 transition-all ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-medium ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="#" className="text-[11px] font-bold text-chart-1 hover:opacity-80">
                    Forgot?
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
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-medium ml-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-chart-1 hover:bg-chart-1/80 text-white font-bold text-[13px] transition-all active:scale-[0.98] mt-2 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-slate-500 text-[12px] font-medium">
                Don't have an account?{" "}
                <Link href="/auth/sign_up" className="text-chart-1 font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}