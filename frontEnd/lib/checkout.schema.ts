import { z } from "zod";

export const checkoutSchema = z.object({

  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long"),

  email: z
    .string()
    .email("Invalid email address"),

  phone_number: z
    .string()
    .regex(
      /^01[0125][0-9]{8}$/,
      "Invalid Egyptian phone number"
    ),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  street: z
    .string()
    .min(3, "Street is required"),

  building: z
    .string()
    .min(1, "Building is required"),



});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;