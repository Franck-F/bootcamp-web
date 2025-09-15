export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "seller" | "customer"
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: "men" | "women" | "kids"
  sizes: ProductSize[]
  colors: string[]
  featured: boolean
  isNew: boolean
  onSale: boolean
  createdAt: Date
}

export interface ProductSize {
  size: string
  stock: number
}

export interface CartItem {
  productId: string
  size: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  createdAt: Date
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@sneakpeak.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "seller@sneakpeak.com",
    name: "Seller User",
    role: "seller",
    createdAt: new Date("2024-01-15"),
  },
]

// Mock products
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 179.99,
    originalPrice: 199.99,
    description: "La sneaker iconique qui a révolutionné le basketball et la street culture.",
    images: ["/air-jordan-1-black-red-sneaker.jpg", "/air-jordan-1-side-view.jpg", "/air-jordan-1-sole-view.jpg"],
    category: "men",
    sizes: [
      { size: "40", stock: 5 },
      { size: "41", stock: 3 },
      { size: "42", stock: 8 },
      { size: "43", stock: 2 },
      { size: "44", stock: 6 },
    ],
    colors: ["Noir/Rouge", "Blanc/Noir"],
    featured: true,
    isNew: false,
    onSale: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Adidas Yeezy Boost 350 V2",
    brand: "Adidas",
    price: 249.99,
    description: "Design futuriste et confort exceptionnel avec la technologie Boost.",
    images: [
      "/yeezy-boost-350-v2-cream-white-sneaker.jpg",
      "/yeezy-boost-350-v2-side-profile.jpg",
      "/yeezy-boost-350-v2-sole-detail.jpg",
    ],
    category: "men",
    sizes: [
      { size: "39", stock: 2 },
      { size: "40", stock: 4 },
      { size: "41", stock: 1 },
      { size: "42", stock: 7 },
      { size: "43", stock: 3 },
    ],
    colors: ["Cream White", "Core Black"],
    featured: true,
    isNew: true,
    onSale: false,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "4",
    name: "New Balance 550",
    brand: "New Balance",
    price: 139.99,
    originalPrice: 159.99,
    description: "Inspiration basketball vintage avec un style intemporel et moderne.",
    images: [
      "/new-balance-550-white-green-sneaker.jpg",
      "/new-balance-550-side-view.jpg",
      "/new-balance-550-detail-view.jpg",
    ],
    category: "men",
    sizes: [
      { size: "40", stock: 6 },
      { size: "41", stock: 4 },
      { size: "42", stock: 9 },
      { size: "43", stock: 5 },
      { size: "44", stock: 3 },
    ],
    colors: ["Blanc/Vert", "Blanc/Gris", "Noir/Blanc"],
    featured: true,
    isNew: true,
    onSale: true,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "3",
    name: "Nike Dunk Low",
    brand: "Nike",
    price: 119.99,
    description: "Style rétro basketball revisité pour la rue.",
    images: [
      "/nike-dunk-low-white-black-panda-sneaker.jpg",
      "/nike-dunk-low-side-view.jpg",
      "/nike-dunk-low-back-view.jpg",
    ],
    category: "women",
    sizes: [
      { size: "36", stock: 4 },
      { size: "37", stock: 6 },
      { size: "38", stock: 8 },
      { size: "39", stock: 5 },
      { size: "40", stock: 3 },
    ],
    colors: ["Panda", "University Blue"],
    featured: false,
    isNew: false,
    onSale: false,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Converse Chuck Taylor All Star",
    brand: "Converse",
    price: 69.99,
    description: "L'iconique sneaker intemporelle qui traverse les générations.",
    images: ["/placeholder-9d3az.png", "/placeholder-v6r6j.png", "/placeholder-hntlx.png"],
    category: "women",
    sizes: [
      { size: "36", stock: 8 },
      { size: "37", stock: 12 },
      { size: "38", stock: 15 },
      { size: "39", stock: 10 },
      { size: "40", stock: 6 },
    ],
    colors: ["Noir", "Blanc", "Rouge"],
    featured: false,
    isNew: false,
    onSale: false,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "6",
    name: "Vans Old Skool",
    brand: "Vans",
    price: 79.99,
    originalPrice: 89.99,
    description: "Le classique skate avec la bande latérale iconique.",
    images: ["/placeholder-y7mwf.png", "/placeholder-uwkoa.png", "/placeholder-64oz5.png"],
    category: "women",
    sizes: [
      { size: "36", stock: 5 },
      { size: "37", stock: 8 },
      { size: "38", stock: 12 },
      { size: "39", stock: 7 },
      { size: "40", stock: 4 },
    ],
    colors: ["Noir/Blanc", "Bleu Marine", "Bordeaux"],
    featured: true,
    isNew: false,
    onSale: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "7",
    name: "Nike Air Force 1 Kids",
    brand: "Nike",
    price: 89.99,
    description: "La légendaire Air Force 1 adaptée aux plus jeunes.",
    images: ["/placeholder-tn7x1.png", "/placeholder-tpxji.png", "/placeholder-8d7v6.png"],
    category: "kids",
    sizes: [
      { size: "28", stock: 6 },
      { size: "29", stock: 8 },
      { size: "30", stock: 10 },
      { size: "31", stock: 7 },
      { size: "32", stock: 5 },
      { size: "33", stock: 4 },
    ],
    colors: ["Blanc", "Noir", "Rose"],
    featured: false,
    isNew: true,
    onSale: false,
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "8",
    name: "Adidas Stan Smith Kids",
    brand: "Adidas",
    price: 59.99,
    originalPrice: 69.99,
    description: "Le tennis classique revisité pour les enfants.",
    images: ["/placeholder-nmrbe.png", "/placeholder-8x7ek.png", "/placeholder-drycq.png"],
    category: "kids",
    sizes: [
      { size: "27", stock: 4 },
      { size: "28", stock: 7 },
      { size: "29", stock: 9 },
      { size: "30", stock: 8 },
      { size: "31", stock: 6 },
      { size: "32", stock: 3 },
    ],
    colors: ["Blanc/Vert", "Blanc/Rose", "Blanc/Bleu"],
    featured: true,
    isNew: false,
    onSale: true,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "9",
    name: "Puma RS-X",
    brand: "Puma",
    price: 129.99,
    description: "Design futuriste et technologie de pointe pour un style unique.",
    images: ["/placeholder-4k56m.png", "/placeholder-48unl.png", "/placeholder-4qoxw.png"],
    category: "men",
    sizes: [
      { size: "40", stock: 3 },
      { size: "41", stock: 5 },
      { size: "42", stock: 7 },
      { size: "43", stock: 4 },
      { size: "44", stock: 2 },
    ],
    colors: ["Multicolore", "Noir/Blanc", "Bleu/Orange"],
    featured: false,
    isNew: true,
    onSale: false,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "10",
    name: "Reebok Club C 85",
    brand: "Reebok",
    price: 89.99,
    originalPrice: 109.99,
    description: "Tennis vintage avec un style épuré et intemporel.",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    category: "women",
    sizes: [
      { size: "36", stock: 6 },
      { size: "37", stock: 9 },
      { size: "38", stock: 11 },
      { size: "39", stock: 8 },
      { size: "40", stock: 5 },
    ],
    colors: ["Blanc", "Beige", "Rose Poudré"],
    featured: false,
    isNew: false,
    onSale: true,
    createdAt: new Date("2024-02-10"),
  },
]

// Mock orders
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "2",
    items: [
      { productId: "1", size: "42", quantity: 1 },
      { productId: "3", size: "38", quantity: 2 },
    ],
    total: 419.97,
    status: "confirmed",
    shippingAddress: {
      street: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
    createdAt: new Date("2024-03-01"),
  },
]
