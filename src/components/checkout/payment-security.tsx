'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface PaymentSecurityProps {
  onValidationChange: (isValid: boolean) => void
  children: React.ReactNode
}

interface SecurityCheck {
  isValid: boolean
  message: string
}

export function PaymentSecurity({ onValidationChange, children }: PaymentSecurityProps) {
  const { data: session } = useSession()
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([])
  const [isValid, setIsValid] = useState(false)

  // Vérifier la session utilisateur
  const checkUserSession = useCallback((): SecurityCheck => {
    if (!session?.user) {
      return {
        isValid: false,
        message: 'Session utilisateur invalide'
      }
    }
    return {
      isValid: true,
      message: 'Session utilisateur valide'
    }
  }, [session])

  // Vérifier la sécurité du navigateur
  const checkBrowserSecurity = useCallback((): SecurityCheck => {
    // Vérifier HTTPS
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return {
        isValid: false,
        message: 'Connexion non sécurisée (HTTPS requis)'
      }
    }

    // Vérifier les fonctionnalités de sécurité
    if (typeof window !== 'undefined') {
      const hasCrypto = window.crypto && window.crypto.subtle
      if (!hasCrypto) {
        return {
          isValid: false,
          message: 'Navigateur non compatible avec les fonctionnalités de sécurité'
        }
      }
    }

    return {
      isValid: true,
      message: 'Navigateur sécurisé'
    }
  }, [])

  // Vérifier la géolocalisation (optionnel)
  const checkGeolocation = useCallback((): SecurityCheck => {
    // Cette vérification est optionnelle et peut être activée si nécessaire
    return {
      isValid: true,
      message: 'Géolocalisation non requise'
    }
  }, [])

  // Vérifier la détection de fraude basique
  const checkFraudDetection = useCallback((): SecurityCheck => {
    if (typeof window !== 'undefined') {
      // Vérifier la taille de l'écran (détection de bot basique)
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      
      if (screenWidth < 800 || screenHeight < 600) {
        return {
          isValid: false,
          message: 'Résolution d\'écran suspecte'
        }
      }

      // Vérifier la présence de plugins (détection de bot)
      const plugins = navigator.plugins.length
      if (plugins === 0) {
        return {
          isValid: false,
          message: 'Aucun plugin détecté (possible bot)'
        }
      }
    }

    return {
      isValid: true,
      message: 'Aucune activité suspecte détectée'
    }
  }, [])

  // Vérifier la cohérence des données
  const checkDataConsistency = useCallback((): SecurityCheck => {
    // Vérifier que les données du panier sont cohérentes
    const cartData = localStorage.getItem('sneakpeak-cart')
    if (cartData) {
      try {
        const cart = JSON.parse(cartData)
        if (!Array.isArray(cart)) {
          return {
            isValid: false,
            message: 'Données du panier corrompues'
          }
        }
      } catch (error) {
        return {
          isValid: false,
          message: 'Erreur de lecture des données du panier'
        }
      }
    }

    return {
      isValid: true,
      message: 'Données cohérentes'
    }
  }, [])

  // Effectuer toutes les vérifications de sécurité
  const performSecurityChecks = useCallback(() => {
    const checks = [
      checkUserSession(),
      checkBrowserSecurity(),
      checkGeolocation(),
      checkFraudDetection(),
      checkDataConsistency()
    ]

    setSecurityChecks(checks)
    
    const allValid = checks.every(check => check.isValid)
    setIsValid(allValid)
    onValidationChange(allValid)

    // Log des vérifications pour le debugging
    console.log('🔒 Vérifications de sécurité:', checks)
  }, [checkUserSession, checkBrowserSecurity, checkGeolocation, checkFraudDetection, checkDataConsistency, onValidationChange])

  // Effectuer les vérifications au montage et périodiquement
  useEffect(() => {
    performSecurityChecks()
    
    // Re-vérifier toutes les 30 secondes
    const interval = setInterval(performSecurityChecks, 30000)
    
    return () => clearInterval(interval)
  }, [performSecurityChecks])

  // Re-vérifier lors des changements de session
  useEffect(() => {
    performSecurityChecks()
  }, [session, performSecurityChecks])

  return (
    <div className="relative">
      {/* Indicateur de sécurité */}
      <div className="mb-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">Vérifications de sécurité</h3>
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        
        <div className="space-y-2">
          {securityChecks.map((check, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${check.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`${check.isValid ? 'text-green-400' : 'text-red-400'}`}>
                {check.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu conditionnel */}
      {isValid ? (
        children
      ) : (
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">Paiement non sécurisé</h3>
          <p className="text-sm text-gray-400 mb-4">
            Certaines vérifications de sécurité ont échoué. Veuillez rafraîchir la page ou contacter le support.
          </p>
          <button
            onClick={performSecurityChecks}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Re-vérifier la sécurité
          </button>
        </div>
      )}
    </div>
  )
}
