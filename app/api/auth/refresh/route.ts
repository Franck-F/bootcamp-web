import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT, createTokenPair } from "@/lib/auth-utils"
import { logSecurityEvent } from "@/lib/security-utils"

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 401 })
    }

    // Verify refresh token
    const payload = verifyJWT(refreshToken, "refresh")

    if (!payload) {
      await logSecurityEvent(null, "INVALID_REFRESH_TOKEN", {}, request.ip)
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    // Create new token pair
    const newTokens = createTokenPair({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    })

    // Create response with new tokens
    const response = NextResponse.json({
      message: "Tokens refreshed successfully",
      accessToken: newTokens.accessToken,
    })

    // Set secure cookies
    response.cookies.set("access_token", newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set("refresh_token", newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    await logSecurityEvent(payload.userId, "TOKEN_REFRESHED", {}, request.ip)

    return response
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}
