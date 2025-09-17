"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Cookie, Settings, X } from "lucide-react"
import { useGDPR } from "@/lib/gdpr-context"

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, updateConsent, consent, hideBanner } = useGDPR()
  const [showSettings, setShowSettings] = useState(false)
  const [tempConsent, setTempConsent] = useState(consent)

  if (!showBanner) return null

  const handleSaveSettings = () => {
    updateConsent(tempConsent)
    setShowSettings(false)
  }

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                <CardTitle>Paramètres des cookies</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Gérez vos préférences de cookies. Les cookies nécessaires sont toujours activés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Cookies nécessaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Requis pour le fonctionnement du site (panier, authentification)
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Cookies d'analyse</Label>
                  <p className="text-sm text-muted-foreground">
                    Nous aident à comprendre comment vous utilisez notre site
                  </p>
                </div>
                <Switch
                  checked={tempConsent.analytics}
                  onCheckedChange={(checked) => setTempConsent({ ...tempConsent, analytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Cookies marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Utilisés pour vous proposer des publicités personnalisées
                  </p>
                </div>
                <Switch
                  checked={tempConsent.marketing}
                  onCheckedChange={(checked) => setTempConsent({ ...tempConsent, marketing: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">Cookies de préférences</Label>
                  <p className="text-sm text-muted-foreground">Mémorisent vos préférences (langue, thème, etc.)</p>
                </div>
                <Switch
                  checked={tempConsent.preferences}
                  onCheckedChange={(checked) => setTempConsent({ ...tempConsent, preferences: checked })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveSettings} className="flex-1">
                Sauvegarder les préférences
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Nous utilisons des cookies</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le
                  contenu. En continuant à utiliser notre site, vous acceptez notre utilisation des cookies.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={acceptAll} size="sm">
                  Accepter tout
                </Button>
                <Button onClick={rejectAll} variant="outline" size="sm">
                  Rejeter tout
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
                <Button onClick={hideBanner} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
