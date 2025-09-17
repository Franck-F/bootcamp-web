import { query } from "./database"
import { hashPassword } from "./auth-utils"

// User operations
export async function createUser(userData: {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string
  role?: "customer" | "seller" | "admin"
}) {
  const passwordHash = await hashPassword(userData.password)

  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, first_name, last_name, role, created_at`,
    [
      userData.email,
      passwordHash,
      userData.first_name,
      userData.last_name,
      userData.phone,
      userData.role || "customer",
    ],
  )

  return result.rows[0]
}

export async function getUserByEmail(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1 AND is_active = true", [email])
  return result.rows[0] || null
}

export async function getUserById(id: number) {
  const result = await query(
    "SELECT id, email, first_name, last_name, role, is_active, email_verified FROM users WHERE id = $1",
    [id],
  )
  return result.rows[0] || null
}

// Product operations
export async function getProducts(filters?: {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}) {
  let queryText = `
    SELECT p.*, 
           MIN(pv.price) as min_price,
           MAX(pv.price) as max_price,
           SUM(pv.stock_quantity) as total_stock
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.is_active = true
  `

  const params: any[] = []
  let paramCount = 0

  if (filters?.category) {
    queryText += ` AND p.category = $${++paramCount}`
    params.push(filters.category)
  }

  if (filters?.brand) {
    queryText += ` AND p.brand = $${++paramCount}`
    params.push(filters.brand)
  }

  if (filters?.minPrice) {
    queryText += ` AND p.base_price >= $${++paramCount}`
    params.push(filters.minPrice)
  }

  if (filters?.maxPrice) {
    queryText += ` AND p.base_price <= $${++paramCount}`
    params.push(filters.maxPrice)
  }

  queryText += ` GROUP BY p.id ORDER BY p.created_at DESC`

  if (filters?.limit) {
    queryText += ` LIMIT $${++paramCount}`
    params.push(filters.limit)
  }

  if (filters?.offset) {
    queryText += ` OFFSET $${++paramCount}`
    params.push(filters.offset)
  }

  const result = await query(queryText, params)
  return result.rows
}

export async function getProductById(id: number) {
  const result = await query(
    `SELECT p.*, 
            json_agg(
              json_build_object(
                'id', pv.id,
                'size', pv.size,
                'color', pv.color,
                'price', pv.price,
                'stock_quantity', pv.stock_quantity,
                'sku', pv.sku
              )
            ) as variants
     FROM products p
     LEFT JOIN product_variants pv ON p.id = pv.product_id
     WHERE p.id = $1 AND p.is_active = true
     GROUP BY p.id`,
    [id],
  )
  return result.rows[0] || null
}

// Cart operations
export async function getCartItems(userId: number) {
  const result = await query(
    `SELECT sc.*, 
            p.name as product_name,
            p.brand,
            pv.size,
            pv.color,
            pv.price,
            pv.sku,
            (sc.quantity * pv.price) as total_price
     FROM shopping_carts sc
     JOIN product_variants pv ON sc.product_variant_id = pv.id
     JOIN products p ON pv.product_id = p.id
     WHERE sc.user_id = $1
     ORDER BY sc.created_at DESC`,
    [userId],
  )
  return result.rows
}

export async function addToCart(userId: number, productVariantId: number, quantity: number) {
  const result = await query(
    `INSERT INTO shopping_carts (user_id, product_variant_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_variant_id)
     DO UPDATE SET quantity = shopping_carts.quantity + $3, updated_at = NOW()
     RETURNING *`,
    [userId, productVariantId, quantity],
  )
  return result.rows[0]
}

export async function updateCartItem(userId: number, productVariantId: number, quantity: number) {
  if (quantity <= 0) {
    await query("DELETE FROM shopping_carts WHERE user_id = $1 AND product_variant_id = $2", [userId, productVariantId])
    return null
  }

  const result = await query(
    `UPDATE shopping_carts 
     SET quantity = $3, updated_at = NOW()
     WHERE user_id = $1 AND product_variant_id = $2
     RETURNING *`,
    [userId, productVariantId, quantity],
  )
  return result.rows[0] || null
}

export async function clearCart(userId: number) {
  await query("DELETE FROM shopping_carts WHERE user_id = $1", [userId])
}

// Order operations
export async function createOrder(orderData: {
  userId: number
  items: Array<{ productVariantId: number; quantity: number; unitPrice: number }>
  totalAmount: number
  shippingAddress: any
  billingAddress: any
  paymentMethod: string
}) {
  const client = await query("BEGIN", [])

  try {
    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Create order
    const orderResult = await query(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        orderData.userId,
        orderNumber,
        orderData.totalAmount,
        JSON.stringify(orderData.shippingAddress),
        JSON.stringify(orderData.billingAddress),
        orderData.paymentMethod,
      ],
    )

    const order = orderResult.rows[0]

    // Create order items
    for (const item of orderData.items) {
      await query(
        `INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productVariantId, item.quantity, item.unitPrice, item.quantity * item.unitPrice],
      )

      // Update stock
      await query("UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2", [
        item.quantity,
        item.productVariantId,
      ])
    }

    // Clear cart
    await clearCart(orderData.userId)

    await query("COMMIT", [])
    return order
  } catch (error) {
    await query("ROLLBACK", [])
    throw error
  }
}

export async function getUserOrders(userId: number) {
  const result = await query(
    `SELECT o.*,
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_name', p.name,
                'brand', p.brand,
                'size', pv.size,
                'color', pv.color,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price,
                'total_price', oi.total_price
              )
            ) as items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
     LEFT JOIN products p ON pv.product_id = p.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId],
  )
  return result.rows
}

// Wishlist operations
export async function getWishlist(userId: number) {
  const result = await query(
    `SELECT w.*, p.name, p.brand, p.base_price, p.category
     FROM wishlists w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id = $1 AND p.is_active = true
     ORDER BY w.created_at DESC`,
    [userId],
  )
  return result.rows
}

export async function addToWishlist(userId: number, productId: number) {
  const result = await query(
    `INSERT INTO wishlists (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING *`,
    [userId, productId],
  )
  return result.rows[0]
}

export async function removeFromWishlist(userId: number, productId: number) {
  await query("DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2", [userId, productId])
}
