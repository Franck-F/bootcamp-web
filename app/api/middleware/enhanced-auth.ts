import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT, createTokenPair } from "@/lib/auth-utils"
import { hasPermission } from "@/lib/permissions"
import { logSecurityEvent } from "@/lib/security-utils"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    role: string
    permissions: string[]
  }
}

interface AuthOptions {
  requiredPermissions?: string[]
  requireAllPermissions?: boolean // true = AND, false = OR
  allowSelfAccess?: boolean // Allow access to own resources
  resourceOwnerField?: string // Field to check for resource ownership
}

export function withEnhancedAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: AuthOptions = {},
) {
  return async (request: NextRequest) => {
    try {
      // Extract tokens
      const authHeader = request.headers.get("authorization")
      const accessToken = authHeader?.replace("Bearer ", "") || request.cookies.get("access_token")?.value
      const refreshToken = request.cookies.get("refresh_token")?.value

      if (!accessToken) {
        await logSecurityEvent(
          null,
          "MISSING_ACCESS_TOKEN",
          {
            path: request.nextUrl.pathname,
          },
          request.ip,
        )
        return NextResponse.json({ error: "Access token required" }, { status: 401 })
      }

      // Verify access token
      let payload = verifyJWT(accessToken, "access")

      // If access token expired, try to refresh
      if (!payload && refreshToken) {
        const refreshPayload = verifyJWT(refreshToken, "refresh")

        if (refreshPayload) {
          // Create new token pair
          const newTokens = createTokenPair({ userId: refreshPayload.userId })

          // Set new tokens in response
          const response = NextResponse.next()
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

          payload = verifyJWT(newTokens.accessToken, "access")

          await logSecurityEvent(
            refreshPayload.userId,
            "TOKEN_REFRESHED",
            {
              path: request.nextUrl.pathname,
            },
            request.ip,
          )
        }
      }

      if (!payload) {
        await logSecurityEvent(
          null,
          "INVALID_ACCESS_TOKEN",
          {
            path: request.nextUrl.pathname,
          },
          request.ip,
        )
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Get user details (in real app, fetch from database)
      const user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: [], // Would be fetched from database
      }

      // Check permissions if required
      if (options.requiredPermissions && options.requiredPermissions.length > 0) {
        const hasRequiredPermissions = options.requireAllPermissions
          ? options.requiredPermissions.every((perm) => hasPermission(user.role, perm))
          : options.requiredPermissions.some((perm) => hasPermission(user.role, perm))

        if (!hasRequiredPermissions) {
          await logSecurityEvent(
            user.id,
            "INSUFFICIENT_PERMISSIONS",
            {
              path: request.nextUrl.pathname,
              requiredPermissions: options.requiredPermissions,
              userRole: user.role,
            },
            request.ip,
          )
          return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
        }
      }

      // Check resource ownership if applicable
      if (options.allowSelfAccess && options.resourceOwnerField) {
        const resourceId = request.nextUrl.pathname.split("/").pop()
        // In real app, check if user owns the resource
        // This is a simplified check
      }

      // Add user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return handler(authenticatedRequest)
    } catch (error) {
      console.error("Enhanced auth middleware error:", error)
      await logSecurityEvent(
        null,
        "AUTH_MIDDLEWARE_ERROR",
        {
          error: error instanceof Error ? error.message : "Unknown error",
          path: request.nextUrl.pathname,
        },
        request.ip,
      )
      return NextResponse.json({ error: "Authentication error" }, { status: 500 })
    }
  }
}

export const requireCustomerAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withEnhancedAuth(handler, {
    requiredPermissions: ["products:read"],
  })

export const requireSellerAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withEnhancedAuth(handler, {
    requiredPermissions: ["products:create", "products:update"],
  })

export const requireAdminAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) =>
  withEnhancedAuth(handler, {
    requiredPermissions: ["system:admin"],
  })
