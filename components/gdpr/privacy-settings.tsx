"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Download, Trash2, Eye, Settings } from "lucide-react"
import { useGDPR } from "@/lib/gdpr-context"
import { useAuth } from "@/components/auth/auth-provider"

export function PrivacySettings() {
  const { consent, updateConsent } = useGDPR()
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    // Simulate data export
    setTimeout(() => {
      const userData = {
        user: user,
        consent: consent,
        exportDate: new Date().toISOString(),
        orders: [], // Would fetch real orders
        preferences: {}, // Would fetch real preferences
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sneakpeak-data-${user?.email}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
    }, 2000)
  }

  const handleDeleteAccount = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")
    ) {
      setIsDeleting(true)
      // Simulate account deletion
      setTimeout(() => {
        alert("Votre compte a été programmé pour suppression. Vous recevrez un email de confirmation.")
        setIsDeleting(false)
      }, 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Confidentialité et données
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos préférences de confidentialité et contrôlez vos données personnelles
        </p>
      </div>

      {/* Cookie Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Préférences des cookies
          </CardTitle>
          <CardDescription>
            Contrôlez quels cookies nous pouvons utiliser pour améliorer votre expérience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p className="text-sm text-muted-foreground">Nous aident à comprendre comment vous utilisez notre site</p>
            </div>
            <Switch checked={consent.analytics} onCheckedChange={(checked) => updateConsent({ analytics: checked })} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Cookies marketing</Label>
              <p className="text-sm text-muted-foreground">Utilisés pour vous proposer des publicités personnalisées</p>
            </div>
            <Switch checked={consent.marketing} onCheckedChange={(checked) => updateConsent({ marketing: checked })} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Cookies de préférences</Label>
              <p className="text-sm text-muted-foreground">Mémorisent vos préférences (langue, thème, etc.)</p>
            </div>
            <Switch
              checked={consent.preferences}
              onCheckedChange={(checked) => updateConsent({ preferences: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vos droits sur vos données
          </CardTitle>
          <CardDescription>
            Conformément au RGPD, vous avez le droit d'accéder, modifier ou supprimer vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Droit d'accès</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Téléchargez une copie de toutes les données que nous avons sur vous
              </p>
              <Button onClick={handleExportData} disabled={isExporting} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Préparation..." : "Télécharger mes données"}
              </Button>
            </div>

            <Separator />

            <div className="p-4 border rounded-lg border-red-200 bg-red-50">
              <h4 className="font-medium mb-2 text-red-800">Droit à l'effacement</h4>
              <p className="text-sm text-red-700 mb-3">
                Supprimez définitivement votre compte et toutes vos données associées
              </p>
              <Button onClick={handleDeleteAccount} disabled={isDeleting} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Suppression..." : "Supprimer mon compte"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations légales</CardTitle>
          <CardDescription>Consultez nos politiques de confidentialité et conditions d'utilisation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Politique de confidentialité
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Conditions générales d'utilisation
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Politique des cookies
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Mentions légales
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
