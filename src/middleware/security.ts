import { NextRequest, NextResponse } from 'next/server'

// Interface pour le rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store en mémoire pour le rate limiting (en production, utiliser Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration du rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requêtes par fenêtre

// Fonction pour nettoyer les entrées expirées
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Fonction pour vérifier le rate limiting
function checkRateLimit(identifier: string): boolean {
  cleanupExpiredEntries()
  
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  entry.count++
  return true
}

// Fonction pour obtenir l'identifiant du client
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIP || 'unknown'
  
  // Ajouter l'user-agent pour plus de précision
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent.slice(0, 50)}`
}

// Fonction pour valider les headers de sécurité
function validateSecurityHeaders(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')
  const referer = request.headers.get('referer')
  const origin = request.headers.get('origin')
  
  // Vérifier que la requête vient de notre domaine
  const allowedOrigins = [
    'http://localhost:3000',
    'https://sneakpeak.vercel.app',
    'https://bootcamp-web.vercel.app'
  ]
  
  if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    console.log(`🚨 Origine non autorisée: ${origin}`)
    return false
  }
  
  // Vérifier le referer pour les requêtes POST
  if (request.method === 'POST' && referer) {
    const refererUrl = new URL(referer)
    if (!allowedOrigins.some(allowed => refererUrl.origin === allowed)) {
      console.log(`🚨 Referer non autorisé: ${referer}`)
      return false
    }
  }
  
  // Vérifier que l'user-agent n'est pas suspect
  if (!userAgent || userAgent.length < 10) {
    console.log(`🚨 User-Agent suspect: ${userAgent}`)
    return false
  }
  
  // Détecter les bots suspects
  const suspiciousPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests'
  ]
  
  if (suspiciousPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
    console.log(`🚨 User-Agent suspect détecté: ${userAgent}`)
    return false
  }
  
  return true
}

// Fonction pour valider la taille de la requête
function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength) {
    const size = parseInt(contentLength)
    const maxSize = 1024 * 1024 // 1MB
    
    if (size > maxSize) {
      console.log(`🚨 Requête trop volumineuse: ${size} bytes`)
      return false
    }
  }
  
  return true
}

// Middleware de sécurité principal
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  
  // Appliquer la sécurité uniquement aux routes sensibles
  const protectedRoutes = ['/api/payment', '/api/orders', '/api/cart']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return null
  }
  
  // Log de la requête
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  console.log(`🔒 Requête sécurisée - ${request.method} ${pathname} - IP: ${clientIP}`)
  
  // 1. Vérifier les headers de sécurité
  if (!validateSecurityHeaders(request)) {
    return NextResponse.json(
      { error: 'Requête non autorisée' },
      { status: 403 }
    )
  }
  
  // 2. Vérifier la taille de la requête
  if (!validateRequestSize(request)) {
    return NextResponse.json(
      { error: 'Requête trop volumineuse' },
      { status: 413 }
    )
  }
  
  // 3. Vérifier le rate limiting
  const clientIdentifier = getClientIdentifier(request)
  if (!checkRateLimit(clientIdentifier)) {
    console.log(`🚨 Rate limit dépassé pour: ${clientIdentifier}`)
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
      { status: 429 }
    )
  }
  
  // 4. Ajouter des headers de sécurité à la réponse
  const response = NextResponse.next()
  
  // Headers de sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CORS pour les routes API
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  
  return null
}

// Fonction pour nettoyer périodiquement le store de rate limiting
setInterval(cleanupExpiredEntries, 5 * 60 * 1000) // Toutes les 5 minutes

export default securityMiddleware
