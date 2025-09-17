import { type NextRequest, NextResponse } from "next/server"
import { hasPermission } from "@/lib/railway-auth"

export async function POST(request: NextRequest) {
  try {
    const { userId, permission } = await request.json()

    if (!userId || !permission) {
      return NextResponse.json({ error: "userId and permission required" }, { status: 400 })
    }

    const hasRequiredPermission = await hasPermission(userId, permission)

    return NextResponse.json({ hasPermission: hasRequiredPermission })
  } catch (error) {
    console.error("Permission check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
