"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Field from "./Field";
import { type billingSchemaFormData } from "@/lib/checkout.schema";

interface ContactSectionProps {
  form: billingSchemaFormData;
  errors: Partial<Record<keyof billingSchemaFormData, string>>;
  savedBilling: any;
  isFetchingBilling: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactSection({
  form,
  errors,
  savedBilling,
  isFetchingBilling,
  onChange,
}: ContactSectionProps) {
  const t = useTranslations("checkout");

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
      <div className="flex items-center py-4 gap-2 mb-1">
        <User size={13} className="text-slate-400" />
        <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
          {t("contactTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label={t("firstName")}
          name="first_name"
          value={form.first_name}
          onChange={onChange}
          placeholder={t("firstNamePlaceholder")}
          error={errors.first_name}
          autoFilled={!!savedBilling?.first_name}
          disabled={isFetchingBilling}
        />
        <Field
          label={t("lastName")}
          name="last_name"
          value={form.last_name}
          onChange={onChange}
          placeholder={t("lastNamePlaceholder")}
          error={errors.last_name}
          autoFilled={!!savedBilling?.last_name}
          disabled={isFetchingBilling}
        />
      </div>

      <Field
        label={t("email")}
        name="email"
        value={form.email}
        onChange={onChange}
        placeholder="you@email.com"
        error={errors.email}
        autoFilled={!!savedBilling?.email}
        disabled={isFetchingBilling}
      />

      <Field
        label={t("phone")}
        name="phone_number"
        value={form.phone_number}
        onChange={onChange}
        placeholder="01000000000"
        error={errors.phone_number}
        autoFilled={!!savedBilling?.phone_number}
        disabled={isFetchingBilling}
      >
        <img
          src="/photo/payment/Flag_of_Egypt.svg"
          className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-auto"
          alt="EG"
        />
      </Field>
    </section>
  );
}
