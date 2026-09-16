"use client";

import {
  User, Mail, Phone, AtSign, MapPin, Building2,
  Map, Navigation, Home, ShieldCheck, Calendar,
  Edit3, PackageCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfileQuery } from "@/redux/features/userprofile/userProfileSlice";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function InfoRow({ icon, label, value, mono = false }: {
  icon: React.ReactNode; label: string; value?: string | null; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={cn(
          "text-[13px] text-slate-800 font-medium truncate",
          mono && "font-mono text-[12px]",
          !value && "text-slate-300 italic"
        )}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const t      = useTranslations("profile");
  const locale = useLocale();
  const isAr   = locale === "ar";
  const router = useRouter();

  const { data, isLoading } = useGetProfileQuery(undefined, { refetchOnMountOrArgChange: true });

  const user    = data?.user;
  const billing = data?.billing;

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#f8f8f8] py-10 pb-20  px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{t("title")}</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <ShieldCheck size={11} />
            {t("secured")}
          </div>
        </div>

        {/* ── Account Card ── */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm  flex items-center justify-center shrink-0">
                <User size={14} className="text-secondary" />
              </div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">
                {t("account_section")}
              </CardTitle>
            </div>
            <button
              onClick={() => router.push("/profile/edit/account")}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Edit3 size={11} /> {t("edit")}
            </button>
          </CardHeader>
          <CardContent className="px-6 py-0 divide-y divide-slate-50">
            {isLoading ? <SectionSkeleton /> : (
              <>
                <InfoRow icon={<User size={14} />}   label={t("full_name")}  value={user?.full_name} />
                <InfoRow icon={<Mail size={14} />}   label={t("email")}      value={user?.email} />
                <InfoRow icon={<Phone size={14} />}  label={t("phone")}      value={user?.phone} />
                <div className="flex items-start gap-3 py-3">
                  <Calendar size={14} className="mt-0.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      {t("member_since")}
                    </p>
                    <p className="text-[13px] text-slate-800 font-medium">{joinDate || "—"}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Billing Card ── */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-secondary " />
              </div>
              <CardTitle className="text-[13px] font-semibold text-slate-700 tracking-tight">
                {t("billing_section")}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {billing && (
                <Badge variant="outline" className="text-[9px] font-bold text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                  <PackageCheck size={9} /> {t("saved")}
                </Badge>
              )}
              <button
                onClick={() => router.push("/profile/edit/billing")}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <Edit3 size={11} /> {t("edit")}
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-0 divide-y divide-slate-50">
            {isLoading ? <SectionSkeleton /> : billing ? (
              <>
                <div className="grid grid-cols-2">
                  <div className="pe-4 border-e border-slate-50">
                    <InfoRow icon={<User size={14} />} label={t("first_name")} value={billing.first_name} />
                  </div>
                  <div className="ps-4">
                    <InfoRow icon={<User size={14} />} label={t("last_name")}  value={billing.last_name} />
                  </div>
                </div>
                <InfoRow icon={<Mail size={14} />}      label={t("email")}   value={billing.email} />
                <InfoRow icon={<Phone size={14} />}     label={t("phone")}   value={billing.phone_number} />
                <Separator className="my-1 bg-slate-50" />
                <div className="grid grid-cols-2">
                  <div className="pe-4 border-e border-slate-50">
                    <InfoRow icon={<Map size={14} />}        label={t("city")}  value={billing.city} />
                  </div>
                  <div className="ps-4">
                    <InfoRow icon={<Navigation size={14} />} label={t("state")} value={billing.state} />
                  </div>
                </div>
                <InfoRow icon={<Home size={14} />}      label={t("street")}   value={billing.street} />
                <InfoRow icon={<Building2 size={14} />} label={t("building")} value={billing.building} />
              </>
            ) : (
              <div className="py-10 flex flex-col items-center gap-3 text-center">
                <MapPin size={28} className="text-slate-200" />
                <div>
                  <p className="text-[12px] font-semibold text-slate-500">{t("no_address_title")}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t("no_address_sub")}</p>
                </div>
                <button
                  onClick={() => router.push("/profile/edit/billing")}
                  className="mt-1 text-[11px] font-semibold text-slate-700 underline underline-offset-2"
                >
                  {t("add_address")}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Footer ── */}
        <div className="flex items-center justify-center gap-2 pt-2 opacity-40 pb-6">
          <ShieldCheck size={11} className="text-slate-500" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {t("encrypted")}
          </span>
        </div>

      </div>
    </div>
  );
}
