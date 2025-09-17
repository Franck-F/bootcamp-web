import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { validateSession } from "@/lib/railway-auth"

const sql = neon(process.env.DATABASE_URL!)

const createOrderSchema = z.object({
  shipping_address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
  }),
  billing_address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
  }),
  payment_method: z.enum(["card", "paypal", "bank_transfer"]),
  notes: z.string().optional(),
})

// GET /api/orders - Get user's orders
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const orders = await sql`
      SELECT o.*, 
             COUNT(*) OVER() as total_count,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', oi.id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price,
                   'total_price', oi.total_price,
                   'product_name', p.name,
                   'brand', p.brand,
                   'size', pv.size,
                   'color', pv.color
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), 
               '[]'::json
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
      LEFT JOIN products p ON pv.product_id = p.id
      WHERE o.user_id = ${user.id}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: orders[0]?.total_count || 0,
        totalPages: Math.ceil((orders[0]?.total_count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
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
    const validatedData = createOrderSchema.parse(body)

    // Get user's cart items
    const cartItems = await sql`
      SELECT sc.*, pv.price, pv.stock_quantity, p.name
      FROM shopping_carts sc
      JOIN product_variants pv ON sc.product_variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE sc.user_id = ${user.id} AND p.is_active = true
    `

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.name}`,
          },
          { status: 400 },
        )
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${user.id}`

    // Create order
    const [order] = await sql`
      INSERT INTO orders (
        user_id, order_number, total_amount, status, payment_status, 
        payment_method, shipping_address, billing_address, notes
      )
      VALUES (
        ${user.id}, ${orderNumber}, ${totalAmount}, 'pending', 'pending',
        ${validatedData.payment_method}, ${JSON.stringify(validatedData.shipping_address)}, 
        ${JSON.stringify(validatedData.billing_address)}, ${validatedData.notes || null}
      )
      RETURNING *
    `

    // Create order items and update stock
    for (const item of cartItems) {
      await sql`
        INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price, total_price)
        VALUES (${order.id}, ${item.product_variant_id}, ${item.quantity}, 
                ${item.price}, ${item.price * item.quantity})
      `

      // Update stock
      await sql`
        UPDATE product_variants 
        SET stock_quantity = stock_quantity - ${item.quantity}
        WHERE id = ${item.product_variant_id}
      `
    }

    // Clear cart
    await sql`DELETE FROM shopping_carts WHERE user_id = ${user.id}`

    // Simulate payment processing (fictif)
    const paymentSuccess = Math.random() > 0.1 // 90% success rate

    if (paymentSuccess) {
      await sql`
        UPDATE orders 
        SET payment_status = 'completed', status = 'confirmed', payment_intent_id = ${`pi_${Date.now()}`}
        WHERE id = ${order.id}
      `
    } else {
      await sql`
        UPDATE orders 
        SET payment_status = 'failed', status = 'cancelled'
        WHERE id = ${order.id}
      `

      return NextResponse.json(
        {
          error: "Payment failed. Please try again.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        order: { ...order, payment_status: "completed", status: "confirmed" },
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create order error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
