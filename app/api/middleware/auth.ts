import { type NextRequest, NextResponse } from "next/server"
import { validateSession, hasPermission } from "@/lib/mock-auth"
import { logSecurityEvent } from "@/lib/security-utils"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    role: string
  }
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requiredRole?: string[]
    requiredPermission?: string
  },
) {
  return async (request: NextRequest) => {
    try {
      // Get token from header or cookie
      const authHeader = request.headers.get("authorization")
      const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth_token")?.value

      if (!token) {
        await logSecurityEvent(null, "UNAUTHORIZED_ACCESS_ATTEMPT", { path: request.nextUrl.pathname }, request.ip)
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Validate session
      const user = await validateSession(token)
      if (!user) {
        await logSecurityEvent(null, "INVALID_TOKEN_USED", { path: request.nextUrl.pathname }, request.ip)
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Check role requirements
      if (options?.requiredRole && !options.requiredRole.includes(user.role)) {
        await logSecurityEvent(
          user.id,
          "INSUFFICIENT_PERMISSIONS",
          { path: request.nextUrl.pathname, requiredRole: options.requiredRole, userRole: user.role },
          request.ip,
        )
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      // Check permission requirements
      if (options?.requiredPermission) {
        const hasRequiredPermission = await hasPermission(user.id, options.requiredPermission)
        if (!hasRequiredPermission) {
          await logSecurityEvent(
            user.id,
            "INSUFFICIENT_PERMISSIONS",
            { path: request.nextUrl.pathname, requiredPermission: options.requiredPermission },
            request.ip,
          )
          return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
        }
      }

      // Add user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      }

      return handler(authenticatedRequest)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}
