import { type NextRequest, NextResponse } from "next/server"
import { sqlQuery } from "@/lib/database"
import { z } from "zod"
import { validateSession } from "@/lib/railway-auth"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  base_price: z.number().positive("Price must be positive"),
  is_active: z.boolean().default(true),
})

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let queryText = `
      SELECT p.*, 
             COUNT(*) OVER() as total_count,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', pv.id,
                   'size', pv.size,
                   'color', pv.color,
                   'price', pv.price,
                   'stock_quantity', pv.stock_quantity,
                   'sku', pv.sku
                 )
               ) FILTER (WHERE pv.id IS NOT NULL), 
               '[]'::json
             ) as variants,
             COALESCE(
               JSON_AGG(
                 DISTINCT pi.image_url
               ) FILTER (WHERE pi.image_url IS NOT NULL), 
               '[]'::json
             ) as images
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.is_active = true
    `

    const params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      queryText += ` AND p.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (brand) {
      queryText += ` AND p.brand = $${paramIndex}`
      params.push(brand)
      paramIndex++
    }

    if (search) {
      queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    queryText += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await sqlQuery`${queryText}`
    const products = result.rows

    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.base_price,
      originalPrice: product.original_price,
      images: product.images || ["/placeholder.svg?key=gmrtp"],
      colors:
        product.variants?.map((v: any) => v.color).filter((c: any, i: any, arr: any) => arr.indexOf(c) === i) || [],
      sizes:
        product.variants?.reduce((acc: any, variant: any) => {
          const existingSize = acc.find((s: any) => s.size === variant.size)
          if (existingSize) {
            existingSize.stock += variant.stock_quantity
          } else {
            acc.push({ size: variant.size, stock: variant.stock_quantity })
          }
          return acc
        }, []) || [],
      featured: product.is_featured || false,
      isNew: product.is_new || false,
      onSale: product.on_sale || false,
      createdAt: product.created_at,
    }))

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: products[0]?.total_count || 0,
        totalPages: Math.ceil((products[0]?.total_count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await validateSession(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    const result = await sqlQuery`
      INSERT INTO products (name, description, brand, category, base_price, is_active, created_by)
      VALUES (${validatedData.name}, ${validatedData.description}, ${validatedData.brand}, 
              ${validatedData.category}, ${validatedData.base_price}, ${validatedData.is_active}, ${user.id})
      RETURNING *
    `

    const product = result.rows[0]

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
