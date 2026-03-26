import { z } from "zod";

export const productSchema = z.object({
  // العناوين
  title: z.string().min(1, "Title is required"),
  title_ar: z.string().min(1, "العنوان بالعربية مطلوب"), // إجباري لضمان جودة المحتوى العربي
  
  slug: z.string().min(1),
  
  // الوصف
  description: z.string().optional(),
  description_ar: z.string().optional(), // اختياري ولكن يفضل إضافته

  // الأسعار (تم الإبقاء عليها كـ string لأن الـ Input يعود بقيمة نصية)
  price: z.string().min(1, "Price is required"),
  discount_price: z.string().optional().nullable(),

  // المخزون
  stock: z.coerce.number().min(0, "Stock cannot be negative").optional(),

  // معلومات البراند
  sku: z.string().optional(),
  brand: z.string().optional(),

  // الأبعاد والأوزان
  weight: z.string().optional().nullable(),
  length: z.string().optional().nullable(),
  width: z.string().optional().nullable(),
  height: z.string().optional().nullable(),

  // التصنيفات
  category_id: z.string().min(1, "Category is required"),
  subcategory_id: z.string().min(1, "Subcategory is required"),

  // الحالة
  is_active: z.boolean()
});


export const registerSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
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