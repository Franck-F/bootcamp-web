import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/railway-auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const user = await validateSession(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Session validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
