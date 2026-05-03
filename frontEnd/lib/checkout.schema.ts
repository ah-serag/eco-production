import { z } from "zod";

export const getBillingSchema = (t : any) => z.object({
  first_name: z
    .string()
    .min(2, t("errors.first_name_min"))
    .max(50, t("errors.first_name_max")),

  last_name: z
    .string()
    .min(2, t("errors.last_name_min"))
    .max(50, t("errors.last_name_max")),

  email: z
    .string()
    .email(t("errors.email_invalid")),

  phone_number: z.string().regex(/^01[0125][0-9]{8}$/,
      t("errors.phone_invalid")
    ),

  city: z
    .string()
    .min(2, t("errors.city_required")),

  state: z
    .string()
    .min(2, t("errors.state_required")),

  street: z
    .string()
    .min(3, t("errors.street_required")),

  building: z
    .string()
    .min(1, t("errors.building_required")),
});

export type billingSchemaFormData = z.infer<ReturnType<typeof getBillingSchema>>;