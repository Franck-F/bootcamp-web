import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { validateSession } from "@/lib/railway-auth"

const sql = neon(process.env.DATABASE_URL!)

const updateCartSchema = z.object({
  quantity: z.number().positive("Quantity must be positive").max(10, "Maximum 10 items per product"),
})

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const cartItemId = Number.parseInt(params.id)
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateCartSchema.parse(body)

    // Check if cart item belongs to user and get variant info
    const [cartItem] = await sql`
      SELECT sc.*, pv.stock_quantity
      FROM shopping_carts sc
      JOIN product_variants pv ON sc.product_variant_id = pv.id
      WHERE sc.id = ${cartItemId} AND sc.user_id = ${user.id}
    `

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (validatedData.quantity > cartItem.stock_quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    const [updatedItem] = await sql`
      UPDATE shopping_carts 
      SET quantity = ${validatedData.quantity}, updated_at = NOW()
      WHERE id = ${cartItemId}
      RETURNING *
    `

    return NextResponse.json({ success: true, cartItem: updatedItem })
  } catch (error) {
    console.error("Update cart item error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const cartItemId = Number.parseInt(params.id)
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    const [deletedItem] = await sql`
      DELETE FROM shopping_carts 
      WHERE id = ${cartItemId} AND user_id = ${user.id}
      RETURNING *
    `

    if (!deletedItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    console.error("Remove cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
