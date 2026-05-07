
const {z} = require("zod")




// auth 
 const registerSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

 const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


// checkout 
const billingSchema = z.object({

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

const itemSchema = z.object({
  id: z.number(),
  quantity: z.number().min(1),
});


const checkout_Card_Schema = z.object({
  items: z.array(itemSchema),
  billingData: billingSchema,
  couponCode: z.string().optional(),
});

const checkout_Wallet_Schema = z.object({
  items: z.array(itemSchema),
  billingData: billingSchema,
  couponCode: z.string().optional(),
  walletNumber : z.string().regex(/^01[0125][0-9]{8}$/, "phone_invalid")
});

const edeitAccountschema = z.object({
    full_name: z.string().min(1, "full name reqired"),
    phone: z.string()
      .refine((v) => v === "" || /^01[0125][0-9]{8}$/.test(v), "invalid phone number"),
});

module.exports ={registerSchema ,loginSchema , checkout_Wallet_Schema, checkout_Card_Schema ,billingSchema ,edeitAccountschema }




