import { z } from "zod"

// User validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase, uppercase, and number"),
  first_name: z.string().min(1, "First name is required").max(100, "First name too long").optional(),
  last_name: z.string().min(1, "Last name is required").max(100, "Last name too long").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-$$$$]+$/, "Invalid phone format")
    .max(20, "Phone too long")
    .optional(),
})

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  brand: z.string().min(1, "Brand is required").max(100, "Brand name too long"),
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  base_price: z.number().positive("Price must be positive").max(99999.99, "Price too high"),
})

export const productVariantSchema = z.object({
  product_id: z.number().positive("Invalid product ID"),
  size: z.string().min(1, "Size is required").max(10, "Size too long"),
  color: z.string().min(1, "Color is required").max(50, "Color name too long"),
  price: z.number().positive("Price must be positive").max(99999.99, "Price too high"),
  stock_quantity: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU is required").max(100, "SKU too long"),
})

// Cart validation schemas
export const addToCartSchema = z.object({
  product_variant_id: z.number().positive("Invalid product variant ID"),
  quantity: z.number().int().positive("Quantity must be positive").max(10, "Maximum 10 items per product"),
})

export const updateCartSchema = z.object({
  product_variant_id: z.number().positive("Invalid product variant ID"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").max(10, "Maximum 10 items per product"),
})

// Order validation schemas
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(200, "Address too long"),
  city: z.string().min(1, "City is required").max(100, "City name too long"),
  postal_code: z.string().min(1, "Postal code is required").max(20, "Postal code too long"),
  country: z.string().min(1, "Country is required").max(100, "Country name too long"),
  state: z.string().max(100, "State name too long").optional(),
})

export const createOrderSchema = z.object({
  shipping_address: addressSchema,
  billing_address: addressSchema,
  payment_method: z.enum(["credit_card", "debit_card", "paypal", "bank_transfer"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
})

// Search and filter schemas
export const productSearchSchema = z.object({
  category: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  search: z.string().max(200).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>'"]/g, "") // Remove potentially dangerous characters
    .substring(0, 200) // Limit length
}

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`)
      }
      throw error
    }
  }
}

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1, "Filename is required"),
    size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"), // 5MB limit
    type: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, "Only JPEG, PNG, and WebP images are allowed"),
  }),
})

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push("Use at least 8 characters")

  if (/[a-z]/.test(password)) score += 1
  else feedback.push("Include lowercase letters")

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("Include uppercase letters")

  if (/\d/.test(password)) score += 1
  else feedback.push("Include numbers")

  if (/[^a-zA-Z\d]/.test(password)) score += 1
  else feedback.push("Include special characters")

  if (password.length >= 12) score += 1

  return {
    isValid: score >= 4,
    score,
    feedback,
  }
}
