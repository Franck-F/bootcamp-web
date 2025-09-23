import { NextRequest, NextResponse } from 'next/server'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Configuration de rate limiting
export const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par windowMs
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Configuration des headers de sécurité
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
}

// Fonction pour appliquer les headers de sécurité
export function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Validation des entrées utilisateur
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .replace(/javascript:/gi, '') // Supprimer les protocoles javascript
    .replace(/on\w+=/gi, '') // Supprimer les event handlers
    .substring(0, 1000) // Limiter la longueur
}

// Validation des emails
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Validation des mots de passe
export function isValidPassword(password: string): boolean {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Génération de tokens CSRF
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Validation des tokens CSRF
export function validateCSRFToken(token: string, userToken: string): boolean {
  return token === userToken && token.length === 64
}

// Chiffrement des données sensibles
export async function encryptData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  )
  return JSON.stringify({
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv),
    key: await crypto.subtle.exportKey('raw', key)
  })
}

// Déchiffrement des données sensibles
export async function decryptData(encryptedData: string): Promise<string> {
  const { encrypted, iv, key } = JSON.parse(encryptedData)
  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    keyBuffer,
    new Uint8Array(encrypted)
  )
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

// Validation des tailles de fichiers
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Validation des types de fichiers
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

// Logging de sécurité
export function logSecurityEvent(event: string, details: any, req: NextRequest) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip || req.headers.get('x-forwarded-for'),
    userAgent: req.headers.get('user-agent'),
    url: req.url,
  }
  
  // En production, envoyer vers un service de logging sécurisé
  console.log('Security Event:', logEntry)
}

// Détection d'activité suspecte
export function detectSuspiciousActivity(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') || ''
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent))
}

// Rate limiting par IP
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const userRequests = ipRequestCounts.get(ip)
  
  if (!userRequests || now > userRequests.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (userRequests.count >= limit) {
    return false
  }
  
  userRequests.count++
  return true
}

// Nettoyage périodique du cache de rate limiting
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of Array.from(ipRequestCounts.entries())) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip)
    }
  }
}, 5 * 60 * 1000) // Nettoyer toutes les 5 minutes
