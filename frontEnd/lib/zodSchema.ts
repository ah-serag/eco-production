import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1),
  description: z.string().optional(),

  price: z.string().min(1),
  discount_price: z.string().optional(),

  stock: z.coerce.number().optional(),

  sku: z.string().optional(),
  brand: z.string().optional(),

  weight: z.string().optional().nullable(),
  length: z.string().optional().nullable(),
  width: z.string().optional().nullable(),
  height: z.string().optional().nullable(),

  category_id: z.string().min(1, "Category is required"),
  subcategory_id: z.string().min(1, "Subcategory is required"),

  is_active: z.boolean()
});


export const registerSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal('')),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(5, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
