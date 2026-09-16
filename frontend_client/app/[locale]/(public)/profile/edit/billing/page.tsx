"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Phone, MapPin, Building2,
  Map, Navigation, Home, ChevronLeft, ChevronRight,
  Loader2, Check, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProfileQuery,
  useUpdateBillingMutation,
} from "@/redux/features/userprofile/userProfileSlice";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {  getBillingSchema } from "@/lib/checkout.schema";

function SectionSkeleton() {
  return (
    <div className="space-y-5 p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

function Field({
  label, fieldName, register, error, icon, placeholder, type = "text",
}: {
  label: string;
  fieldName: string;
  register: any;
  error?: string;
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
        <Input
          {...register(fieldName)}
          type={type}
          placeholder={placeholder}
          className={cn(
            "pl-9 h-10 text-[13px] font-medium bg-white border-slate-200 focus-visible:ring-slate-300",
            error && "border-rose-300 focus-visible:ring-rose-200"
          )}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

export default function EditBillingPage() {
  const t        = useTranslations("profile_edit");
  const t_billing        = useTranslations("checkout");
  const locale   = useLocale();
  const isAr     = locale === "ar";
  const router   = useRouter();
  const BackIcon = isAr ? ChevronRight : ChevronLeft;
  
  const billingSchema = getBillingSchema(t_billing)
  
  

  type FormData = z.infer<typeof billingSchema>;

  const { data, isLoading } = useGetProfileQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateBilling, { isLoading: saving }] = useUpdateBillingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      first_name: "", last_name: "", email: "",
      phone_number: "", city: "", state: "", street: "", building: "",
    },
  });

  useEffect(() => {
    if (data?.billing) {
      reset({
        first_name:   data.billing.first_name   || "",
        last_name:    data.billing.last_name    || "",
        email:        data.billing.email        || "",
        phone_number: data.billing.phone_number || "",
        city:         data.billing.city         || "",
        state:        data.billing.state        || "",
        street:       data.billing.street       || "",
        building:     data.billing.building     || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: FormData) => {
    try {
      await updateBilling(values).unwrap();
      toast.success(t("address_updated"));
    } catch {
      toast.error(t("error"));
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
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{t("billing_section")}</h1>
            <p className="text-[11px] text-slate-400">{t("subtitle")}</p>
          </div>
        </div>

        {/* ── Card ── */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-gray-700" />
              </div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">
                {t("billing_section")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? <SectionSkeleton /> : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* First / Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("first_name")} fieldName="first_name" register={register}
                    icon={<User size={13} />} placeholder={t("first_name_placeholder")}
                    error={errors.first_name?.message} />
                  <Field label={t("last_name")} fieldName="last_name" register={register}
                    icon={<User size={13} />} placeholder={t("last_name_placeholder")}
                    error={errors.last_name?.message} />
                </div>

                <Field label={t("email")} fieldName="email" register={register}
                  icon={<Mail size={13} />} placeholder="you@email.com" type="email"
                  error={errors.email?.message} />

                <Field label={t("phone")} fieldName="phone_number" register={register}
                  icon={<Phone size={13} />} placeholder="01xxxxxxxxx"
                  error={errors.phone_number?.message} />

                <Separator className="bg-slate-100" />

                {/* City / State */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("city")} fieldName="city" register={register}
                    icon={<Map size={13} />} placeholder={t("city_placeholder")}
                    error={errors.city?.message} />
                  <Field label={t("state")} fieldName="state" register={register}
                    icon={<Navigation size={13} />} placeholder={t("state_placeholder")}
                    error={errors.state?.message} />
                </div>

                <Field label={t("street")} fieldName="street" register={register}
                  icon={<Home size={13} />} placeholder={t("street_placeholder")}
                  error={errors.street?.message} />

                <Field label={t("building")} fieldName="building" register={register}
                  icon={<Building2 size={13} />} placeholder={t("building_placeholder")} />

                <Button type="submit" disabled={saving}
                  className="w-full h-10 rounded-xl text-[11px] font-semibold uppercase tracking-widest mt-2">
                  {saving
                    ? <><Loader2 size={13} className="animate-spin me-2" />{t("saving")}</>
                    : <><Check size={13} className="me-2" />{t("save_address")}</>
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
