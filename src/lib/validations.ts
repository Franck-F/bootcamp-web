import { z } from 'zod'

// Validation des utilisateurs
export const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['admin', 'moderator', 'customer']).optional().default('customer'),
})

export const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

// Validation des produits
export const productSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  category_id: z.number().int().positive('La catégorie est requise'),
  brand_id: z.number().int().positive('La marque est requise'),
  sku: z.string().optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  onSale: z.boolean().default(false),
  originalPrice: z.number().positive().optional(),
  is_active: z.boolean().default(true),
})

// Validation des stocks
export const stockItemSchema = z.object({
  product_id: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0, 'La quantité ne peut pas être négative'),
})

// Validation des commandes
export const orderSchema = z.object({
  user_id: z.number().int().positive(),
  order_number: z.string(),
  status: z.enum(['pending', 'shipped', 'delivered', 'canceled']).default('pending'),
  payment_status: z.enum(['pending', 'failed', 'refunded']).default('pending'),
  total_amount: z.number().positive(),
  shipping_address: z.string().optional(),
  payment_method: z.string().optional(),
  payment_intent_id: z.string().optional(),
  billing_address: z.string().optional(),
})

export const orderItemSchema = z.object({
  order_id: z.number().int().positive(),
  product_variant_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
})

// Validation des adresses
export const addressSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  company: z.string().optional(),
  address1: z.string().min(1, 'L\'adresse est requise'),
  address2: z.string().optional(),
  city: z.string().min(1, 'La ville est requise'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().default('France'),
  phone: z.string().optional(),
})

// Validation des avis
export const reviewSchema = z.object({
  user_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
})

// Validation RGPD
export const cookieConsentSchema = z.object({
  user_id: z.number().int().positive().optional(),
  session_id: z.string().optional(),
  consent: z.object({
    necessary: z.boolean().default(true),
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false),
    personalization: z.boolean().default(false),
  }),
})

export const dataRequestSchema = z.object({
  user_id: z.number().int().positive(),
  type: z.enum(['access', 'portability', 'deletion', 'rectification']),
  data: z.any().optional(),
})

// Types TypeScript dérivés
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProductInput = z.infer<typeof productSchema>
export type StockItemInput = z.infer<typeof stockItemSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CookieConsentInput = z.infer<typeof cookieConsentSchema>
export type DataRequestInput = z.infer<typeof dataRequestSchema>
