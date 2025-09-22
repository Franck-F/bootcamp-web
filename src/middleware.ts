import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { securityMiddleware } from './middleware/security'

export default withAuth(
  function middleware(req) {
    // Appliquer le middleware de sécurité en premier
    const securityResponse = securityMiddleware(req)
    if (securityResponse) {
      return securityResponse
    }

    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Rediriger les utilisateurs authentifiés depuis les pages d'auth
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Protéger les pages admin
    if (isAdminPage && !isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Vérifier les rôles pour les pages admin
    if (isAdminPage && isAuth) {
      const userRole = token?.role
      if (userRole !== 'admin' && userRole !== 'moderator') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Autoriser l'accès aux pages publiques
        const publicPaths = ['/', '/products', '/privacy-policy', '/terms']
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true
        }

        // Autoriser l'accès aux pages d'auth
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }

        // Vérifier l'authentification pour les autres pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/api/payment/:path*',
    '/api/orders/:path*',
    '/api/cart/:path*'
  ]
}
