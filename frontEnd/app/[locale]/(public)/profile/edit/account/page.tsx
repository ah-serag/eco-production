"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Phone, ChevronLeft, ChevronRight,
  Loader2, Check, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProfileQuery,
  useUpdateAccountMutation,
} from "@/redux/features/userprofile/userProfileSlice";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function SectionSkeleton() {
  return (
    <div className="space-y-5 p-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function EditAccountPage() {
  const t        = useTranslations("profile_edit");
  const locale   = useLocale();
  const isAr     = locale === "ar";
  const router   = useRouter();
  const BackIcon = isAr ? ChevronRight : ChevronLeft;

  const schema = z.object({
    full_name: z.string().min(1, t("err_name_required")),
    phone: z.string()
      .refine((v) => v === "" || /^01[0125][0-9]{8}$/.test(v), t("err_phone_invalid")),
  });
  type FormData = z.infer<typeof schema>;

  const { data, isLoading } = useGetProfileQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateAccount, { isLoading: saving }] = useUpdateAccountMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", phone: "" },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        full_name: data.user.full_name || "",
        phone:     data.user.phone     || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: FormData) => {
    try {
      await updateAccount(values).unwrap();
      toast.success(t("account_updated"));
    } catch (e: any) {
      if (e?.status === 409) setError("phone", { message: t("phone_taken") });
      else toast.error(t("error"));
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#f8f8f8] py-10 px-4 pb-20 font-sans">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Back + Title ── */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-all shadow-sm"
          >
            <BackIcon size={14} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{t("account_section")}</h1>
            <p className="text-[11px] text-slate-400">{t("subtitle")}</p>
          </div>
        </div>

        {/* ── Card ── */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <User size={14} className="text-gray-700" />
              </div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">
                {t("account_section")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? <SectionSkeleton /> : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Full name */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {t("full_name")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                      <User size={13} />
                    </span>
                    <Input
                      {...register("full_name")}
                      placeholder={t("full_name_placeholder")}
                      className={cn(
                        "pl-9 h-10 text-[13px] font-medium bg-white border-slate-200 focus-visible:ring-slate-300",
                        errors.full_name && "border-rose-300 focus-visible:ring-rose-200"
                      )}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                      <AlertCircle size={10} /> {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {t("phone")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                      <Phone size={13} />
                    </span>
                    <Input
                      {...register("phone")}
                      placeholder="01xxxxxxxxx"
                      className={cn(
                        "pl-9 h-10 text-[13px] font-medium bg-white border-slate-200 focus-visible:ring-slate-300",
                        errors.phone && "border-rose-300 focus-visible:ring-rose-200"
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                      <AlertCircle size={10} /> {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email (readonly) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                  <Mail size={13} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t("email")}</p>
                    <p className="text-[12px] text-slate-600 font-medium mt-0.5">{data?.user?.email || "—"}</p>
                  </div>
                  <span className="ms-auto text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                    {t("email_readonly")}
                  </span>
                </div>

                <Button type="submit" disabled={saving}
                  className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest mt-2">
                  {saving
                    ? <><Loader2 size={13} className="animate-spin me-2" />{t("saving")}</>
                    : <><Check size={13} className="me-2" />{t("save_account")}</>
                  }
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
