import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { validateSession } from "@/lib/railway-auth"

const sql = neon(process.env.DATABASE_URL!)

const wishlistSchema = z.object({
  product_id: z.number().positive("Product ID is required"),
})

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const wishlistItems = await sql`
      SELECT w.*, p.name, p.brand, p.base_price, p.category,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', pv.id,
                   'size', pv.size,
                   'color', pv.color,
                   'price', pv.price,
                   'stock_quantity', pv.stock_quantity
                 )
               ) FILTER (WHERE pv.id IS NOT NULL), 
               '[]'::json
             ) as variants
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE w.user_id = ${user.id} AND p.is_active = true
      GROUP BY w.id, p.id
      ORDER BY w.created_at DESC
    `

    return NextResponse.json({ wishlistItems })
  } catch (error) {
    console.error("Get wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = wishlistSchema.parse(body)

    // Check if product exists
    const [product] = await sql`
      SELECT id FROM products 
      WHERE id = ${validatedData.product_id} AND is_active = true
    `

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if already in wishlist
    const [existingItem] = await sql`
      SELECT id FROM wishlists 
      WHERE user_id = ${user.id} AND product_id = ${validatedData.product_id}
    `

    if (existingItem) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 })
    }

    const [wishlistItem] = await sql`
      INSERT INTO wishlists (user_id, product_id)
      VALUES (${user.id}, ${validatedData.product_id})
      RETURNING *
    `

    return NextResponse.json({ success: true, wishlistItem }, { status: 201 })
  } catch (error) {
    console.error("Add to wishlist error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
