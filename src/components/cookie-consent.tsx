'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Cookie, Shield, BarChart3, Target } from 'lucide-react'
import { ClientOnly } from './client-only'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours true, non modifiable
    analytics: false,
    marketing: false,
    personalization: false,
  })

  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return
    
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    if (typeof window === 'undefined') return
    
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
    
    // Ici, vous pouvez initialiser les services de tracking
    initializeTrackingServices(allAccepted)
  }

  const handleAcceptSelected = () => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
    
    // Initialiser les services selon les préférences
    initializeTrackingServices(preferences)
  }

  const handleRejectAll = () => {
    if (typeof window === 'undefined') return
    
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
    
    initializeTrackingServices(onlyNecessary)
  }

  const initializeTrackingServices = (consent: CookiePreferences) => {
    // Analytics (Google Analytics, etc.)
    if (consent.analytics) {
      // Initialiser Google Analytics
      console.log('Analytics activé')
    }
    
    // Marketing (Facebook Pixel, Google Ads, etc.)
    if (consent.marketing) {
      // Initialiser les pixels marketing
      console.log('Marketing activé')
    }
    
    // Personnalisation (recommandations, etc.)
    if (consent.personalization) {
      // Initialiser les services de personnalisation
      console.log('Personnalisation activée')
    }
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Ne pas permettre de désactiver les cookies nécessaires
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!isVisible) return null

  return (
    <ClientOnly>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
        <Card className="w-full max-w-2xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cookie className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Gestion des cookies</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Vous pouvez personnaliser vos préférences ci-dessous.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showDetails ? (
            // Vue simplifiée
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Cookies essentiels</p>
                    <p className="text-sm text-gray-600">Nécessaires au fonctionnement du site</p>
                  </div>
                </div>
                <Badge variant="success">Toujours actifs</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Cookies analytiques</p>
                    <p className="text-sm text-gray-600">Pour analyser l'utilisation du site</p>
                  </div>
                </div>
                <Badge variant={preferences.analytics ? "success" : "secondary"}>
                  {preferences.analytics ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Cookies marketing</p>
                    <p className="text-sm text-gray-600">Pour la publicité personnalisée</p>
                  </div>
                </div>
                <Badge variant={preferences.marketing ? "success" : "secondary"}>
                  {preferences.marketing ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => setShowDetails(true)} variant="outline" className="flex-1">
                  Personnaliser
                </Button>
                <Button onClick={handleAcceptAll} className="flex-1">
                  Tout accepter
                </Button>
              </div>
            </div>
          ) : (
            // Vue détaillée
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Cookies essentiels</p>
                      <p className="text-sm text-gray-600">
                        Session, panier, authentification, sécurité
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Toujours actifs</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Cookies analytiques</p>
                      <p className="text-sm text-gray-600">
                        Google Analytics, statistiques d'utilisation
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => updatePreference('analytics', e.target.checked)}
                      className="sr-only peer"
                      title="Activer/désactiver les cookies analytiques"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Cookies marketing</p>
                      <p className="text-sm text-gray-600">
                        Facebook Pixel, Google Ads, publicité ciblée
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => updatePreference('marketing', e.target.checked)}
                      className="sr-only peer"
                      title="Activer/désactiver les cookies marketing"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cookie className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Cookies de personnalisation</p>
                      <p className="text-sm text-gray-600">
                        Recommandations, préférences utilisateur
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={(e) => updatePreference('personalization', e.target.checked)}
                      className="sr-only peer"
                      title="Activer/désactiver les cookies de personnalisation"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                  Tout refuser
                </Button>
                <Button onClick={() => setShowDetails(false)} variant="outline" className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleAcceptSelected} className="flex-1">
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>
              En continuant à utiliser ce site, vous acceptez notre{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>
              {' '}et nos{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                conditions d'utilisation
              </a>
              .
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </ClientOnly>
  )
}
