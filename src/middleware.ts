import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, hasPermission } from '@/lib/edge-auth'

export const runtime = 'experimental-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const user = await getUserFromRequest(request)
  const isAuth = !!user

  // Pages publiques
  const publicPaths = ['/', '/products', '/privacy-policy', '/terms', '/contact']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Pages d'authentification
  const isAuthPage = pathname.startsWith('/auth')
  
  // Pages admin
  const isAdminPage = pathname.startsWith('/admin')

  // Rediriger les utilisateurs authentifiés depuis les pages d'auth
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protéger les pages admin
  if (isAdminPage && !isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Vérifier les rôles pour les pages admin
  if (isAdminPage && isAuth) {
    if (!hasPermission(user, 'moderator')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protéger les pages nécessitant une authentification
  const protectedPaths = ['/profile', '/checkout', '/wishlist']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath && !isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/wishlist/:path*'
  ]
}