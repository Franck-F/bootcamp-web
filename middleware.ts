import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateSession } from "./lib/mock-auth"
import { verifyJWT, createTokenPair, hasPermission, hasAnyPermission, logSecurityEvent } from "./lib/auth-utils"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting function
function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const key = `rate_limit:${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // HSTS - Force HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline and unsafe-eval
      "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; "),
  )

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),
  )

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Apply rate limiting with stricter limits for sensitive endpoints
  const isAuthEndpoint = pathname.startsWith("/api/auth")
  const isAdminEndpoint = pathname.startsWith("/api/admin") || pathname.startsWith("/admin")

  const rateLimitCount = isAuthEndpoint ? 10 : isAdminEndpoint ? 20 : 100
  const windowMs = 15 * 60 * 1000 // 15 minutes

  if (!checkRateLimit(ip, rateLimitCount, windowMs)) {
    await logSecurityEvent(
      null,
      "RATE_LIMIT_EXCEEDED",
      {
        path: pathname,
        ip,
        limit: rateLimitCount,
      },
      ip,
    )
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/orders", "/wishlist", "/settings", "/admin", "/seller"]

  // Admin-only routes
  const adminRoutes = ["/admin"]

  // Seller routes (admin and seller access)
  const sellerRoutes = ["/seller"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isSellerRoute = sellerRoutes.some((route) => pathname.startsWith(route))

  let response = NextResponse.next()

  // Add security headers to all responses
  response = addSecurityHeaders(response)

  // Handle protected routes
  if (isProtectedRoute) {
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      let user = null

      // Try access token first
      if (accessToken) {
        const payload = verifyJWT(accessToken, "access")
        if (payload) {
          user = await validateSession(accessToken) // Your existing validation
        }
      }

      // If access token failed, try refresh token
      if (!user && refreshToken) {
        const refreshPayload = verifyJWT(refreshToken, "refresh")
        if (refreshPayload) {
          // Create new tokens
          const newTokens = createTokenPair({
            userId: refreshPayload.userId,
            email: refreshPayload.email,
            role: refreshPayload.role,
          })

          // Set new tokens in response
          response.cookies.set("access_token", newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60,
          })

          user = await validateSession(newTokens.accessToken)

          await logSecurityEvent(
            refreshPayload.userId,
            "AUTO_TOKEN_REFRESH",
            {
              path: pathname,
            },
            ip,
          )
        }
      }

      if (!user) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Enhanced role-based access control
      if (isAdminRoute && !hasPermission(user.role, "system:admin")) {
        await logSecurityEvent(
          user.id,
          "UNAUTHORIZED_ADMIN_ACCESS",
          {
            path: pathname,
            userRole: user.role,
          },
          ip,
        )
        return new NextResponse("Forbidden", { status: 403 })
      }

      if (isSellerRoute && !hasAnyPermission(user.role, ["system:admin", "products:create"])) {
        await logSecurityEvent(
          user.id,
          "UNAUTHORIZED_SELLER_ACCESS",
          {
            path: pathname,
            userRole: user.role,
          },
          ip,
        )
        return new NextResponse("Forbidden", { status: 403 })
      }

      // Add user info to headers for API routes
      response.headers.set("x-user-id", user.id.toString())
      response.headers.set("x-user-role", user.role)
      response.headers.set("x-user-email", user.email)
    } catch (error) {
      console.error("Enhanced middleware auth error:", error)
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // API routes security
  if (pathname.startsWith("/api/")) {
    // Add CORS headers for API routes
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }

    // Additional rate limiting for API routes
    if (!checkRateLimit(`api:${ip}`, 50, 15 * 60 * 1000)) {
      return new NextResponse("API Rate Limit Exceeded", { status: 429 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
