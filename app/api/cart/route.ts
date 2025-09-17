import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { validateSession } from "@/lib/railway-auth"

const sql = neon(process.env.DATABASE_URL!)

const addToCartSchema = z.object({
  product_variant_id: z.number().positive("Product variant ID is required"),
  quantity: z.number().positive("Quantity must be positive").max(10, "Maximum 10 items per product"),
})

// GET /api/cart - Get user's cart
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

    const cartItems = await sql`
      SELECT sc.*, 
             p.name as product_name,
             p.brand,
             pv.size,
             pv.color,
             pv.price,
             pv.stock_quantity
      FROM shopping_carts sc
      JOIN product_variants pv ON sc.product_variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE sc.user_id = ${user.id} AND p.is_active = true
      ORDER BY sc.created_at DESC
    `

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return NextResponse.json({
      cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
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
    const validatedData = addToCartSchema.parse(body)

    // Check if product variant exists and has stock
    const [variant] = await sql`
      SELECT pv.*, p.name, p.is_active
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.id = ${validatedData.product_variant_id} AND p.is_active = true
    `

    if (!variant) {
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 })
    }

    if (variant.stock_quantity < validatedData.quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Check if item already exists in cart
    const [existingItem] = await sql`
      SELECT * FROM shopping_carts 
      WHERE user_id = ${user.id} AND product_variant_id = ${validatedData.product_variant_id}
    `

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validatedData.quantity

      if (newQuantity > variant.stock_quantity) {
        return NextResponse.json({ error: "Insufficient stock for total quantity" }, { status: 400 })
      }

      const [updatedItem] = await sql`
        UPDATE shopping_carts 
        SET quantity = ${newQuantity}, updated_at = NOW()
        WHERE id = ${existingItem.id}
        RETURNING *
      `

      return NextResponse.json({ success: true, cartItem: updatedItem })
    } else {
      // Add new item
      const [cartItem] = await sql`
        INSERT INTO shopping_carts (user_id, product_variant_id, quantity)
        VALUES (${user.id}, ${validatedData.product_variant_id}, ${validatedData.quantity})
        RETURNING *
      `

      return NextResponse.json({ success: true, cartItem }, { status: 201 })
    }
  } catch (error) {
    console.error("Add to cart error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
