"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { registerSchema } from "@/lib/zodSchema";
import { useRegisterMutation } from "../../../../../redux/features/auth/AuthapiSlice";
import { Link, useRouter } from "@/i18n/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register, handleSubmit, control, formState: { errors }, setError } = useForm({ 
    resolver: zodResolver(registerSchema) 
  });

  const onSubmit = async (values: any) => {
    setServerError(null);
    try {
      const result: any = await registerUser(values).unwrap();
      setSuccessMessage(result.message);
    } catch (err: any) {
      setServerError(err.data?.message || 'Server error');
      if (err.data?.errors) {
        err.data.errors.forEach((e: any) => {
          if (e.field) setError(e.field, { message: e.message });
        });
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-linear-to-t from-secondary via-white to-white px-4">
      
      {/* Success Overlay */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-4">
          <Card className="max-w-xs w-full p-6 text-center rounded-[20px] shadow-2xl border-none animate-in zoom-in duration-200">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900 mb-1">Success!</h2>
            <p className="text-slate-500 text-[12px] mb-4">{successMessage}</p>
            <Button onClick={() => router.push("/auth/sign_in")} className="w-full h-10 bg-black rounded-lg text-xs">Login Now</Button>
          </Card>
        </div>
      )}

      <div className="w-full max-w-[420px]">

        <Card className="rounded-[20px] border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="pt-6 pb-6 px-6">
            <div className="text-center mb-5">
                       {/* Logo - Small */}
           <div className="flex justify-center mb-7">
            <Link href="/"><Image src="/photo/tmara.svg" 
                   alt="Logo" width={100} height={28} priority /></Link>

            </div>
            </div>
             {/* <hr className="my-4"/> */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              
              {/* Row 1: Name & Username */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <Input placeholder="Full Name" {...register("full_name")} className="h-9 text-[13px] rounded-lg" />
                  {errors.full_name && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.full_name as any).message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <Input placeholder="Username" {...register("username")} className="h-9 text-[13px] rounded-lg" />
                  {errors.username && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.username as any).message}</p>}
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <Input type="email" placeholder="email@example.com" {...register("email")} className="h-9 text-[13px] rounded-lg" />
                {errors.email && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.email as any).message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative flex items-center">
                   <img 
                    src="/photo/payment/Flag_of_Egypt.svg" 
                    className="absolute left-3 z-10 h-3.5 w-auto pointer-events-none" 
                    alt="EG" 
                  />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        defaultCountry="EG"
                        placeholder="01x xxxx xxxx"
                        countrySelectComponent={() => null}
                        className="flex h-9 w-full rounded-lg border border-slate-200 bg-transparent pl-11 pr-3 text-[13px] focus-within:ring-1 focus-within:ring-chart-1 transition-all"
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.phone as any).message}</p>}
              </div>

              {/* Row 3: Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <Input type="password" placeholder="••••••••" {...register("password")} className="h-9 text-[13px] rounded-lg" />
                  {errors.password && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.password as any).message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                  <Input type="password" placeholder="••••••••" {...register("confirmPassword")} className="h-9 text-[13px] rounded-lg" />
                  {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-0.5 ml-1 leading-none">{(errors.confirmPassword as any).message}</p>}
                </div>
              </div>

              {serverError && <p className="text-[10px] text-center bg-red-50 text-red-600 p-1.5 rounded-lg font-medium">{serverError}</p>}

              <Button type="submit" className="w-full h-10 rounded-lg bg-chart-1 hover:bg-chart-1/80 text-white font-semibold text-[13px] mt-2 shadow-sm active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center mt-4 pt-4 border-t border-slate-50">
              <p className="text-slate-400 text-[12px]">
                Joined before? <Link href="/auth/sign_in" className="text-chart-1 font-bold hover:underline">Log in</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}