import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await authService.logout()

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout API error:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
