"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Field from "./Field";
import { type billingSchemaFormData } from "@/lib/checkout.schema";

interface ShippingSectionProps {
  form: billingSchemaFormData;
  errors: Partial<Record<keyof billingSchemaFormData, string>>;
  savedBilling: any;
  isFetchingBilling: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ShippingSection({
  form,
  errors,
  savedBilling,
  isFetchingBilling,
  onChange,
}: ShippingSectionProps) {
  const t = useTranslations("checkout");

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
      <div className="flex items-center py-4 gap-2 mb-1">
        <MapPin size={13} className="text-slate-400" />
        <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
          {t("shippingTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label={t("city")}
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder={t("cityPlaceholder")}
          error={errors.city}
          autoFilled={!!savedBilling?.city}
          disabled={isFetchingBilling}
        />
        <Field
          label={t("state")}
          name="state"
          value={form.state}
          onChange={onChange}
          placeholder={t("statePlaceholder")}
          error={errors.state}
          autoFilled={!!savedBilling?.state}
          disabled={isFetchingBilling}
        />
      </div>

      <Field
        label={t("street")}
        name="street"
        value={form.street}
        onChange={onChange}
        placeholder={t("streetPlaceholder")}
        error={errors.street}
        autoFilled={!!savedBilling?.street}
        disabled={isFetchingBilling}
      />

      <Field
        label={t("building")}
        name="building"
        value={form.building}
        onChange={onChange}
        placeholder={t("buildingPlaceholder")}
        error={errors.building}
        autoFilled={!!savedBilling?.building}
        disabled={isFetchingBilling}
      />
    </section>
  );
}
