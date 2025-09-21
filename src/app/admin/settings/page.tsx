'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Save, 
  Users, 
  Shield, 
  Database,
  Mail,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Package,
  BarChart3
} from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportEmail: string
  currency: string
  taxRate: number
  shippingCost: number
  freeShippingThreshold: number
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxFileSize: number
  allowedFileTypes: string[]
}

interface NotificationSettings {
  emailNotifications: boolean
  orderNotifications: boolean
  stockAlerts: boolean
  userRegistrations: boolean
  systemAlerts: boolean
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'SneakPeak',
    siteDescription: 'Votre boutique de sneakers premium',
    contactEmail: 'contact@sneakpeak.com',
    supportEmail: 'support@sneakpeak.com',
    currency: 'EUR',
    taxRate: 20,
    shippingCost: 9.99,
    freeShippingThreshold: 100,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp']
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    userRegistrations: true,
    systemAlerts: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      if (session.user.role !== 'admin') {
        router.push('/')
        return
      }
      setLoading(false)
    }
  }, [session, status, router])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // En production, faire un appel API pour sauvegarder
      console.log('Sauvegarde des paramètres:', { siteSettings, notificationSettings })
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Paramètres sauvegardés avec succès!')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <Footer />
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'ecommerce', label: 'E-commerce', icon: CreditCard },
    { id: 'system', label: 'Système', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[90%] mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Paramètres Administrateur</h1>
            <p className="text-gray-400">Configurez les paramètres de votre boutique</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation des onglets */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-red-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenu des onglets */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {(() => {
                      const activeTabData = tabs.find(tab => tab.id === activeTab)
                      if (activeTabData?.icon) {
                        const Icon = activeTabData.icon
                        return <Icon className="w-5 h-5 mr-2" />
                      }
                      return null
                    })()}
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="siteName" className="text-gray-300">Nom du site</Label>
                          <Input
                            id="siteName"
                            value={siteSettings.siteName}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail" className="text-gray-300">Email de contact</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={siteSettings.contactEmail}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="siteDescription" className="text-gray-300">Description du site</Label>
                        <textarea
                          id="siteDescription"
                          value={siteSettings.siteDescription}
                          onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows={3}
                          title="Description du site"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="currency" className="text-gray-300">Devise</Label>
                          <select
                            id="currency"
                            value={siteSettings.currency}
                            onChange={(e) => setSiteSettings({ ...siteSettings, currency: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Sélectionner la devise"
                          >
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="taxRate" className="text-gray-300">Taux de TVA (%)</Label>
                          <Input
                            id="taxRate"
                            type="number"
                            value={siteSettings.taxRate}
                            onChange={(e) => setSiteSettings({ ...siteSettings, taxRate: parseFloat(e.target.value) })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Notifications par email</h4>
                            <p className="text-gray-400 text-sm">Activer les notifications par email</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Activer les notifications par email"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Notifications de commandes</h4>
                            <p className="text-gray-400 text-sm">Recevoir des notifications pour les nouvelles commandes</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.orderNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, orderNotifications: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Recevoir des notifications pour les nouvelles commandes"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Alertes de stock</h4>
                            <p className="text-gray-400 text-sm">Recevoir des alertes quand le stock est faible</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.stockAlerts}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, stockAlerts: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Recevoir des alertes quand le stock est faible"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Nouveaux utilisateurs</h4>
                            <p className="text-gray-400 text-sm">Recevoir des notifications pour les nouvelles inscriptions</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.userRegistrations}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, userRegistrations: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Recevoir des notifications pour les nouvelles inscriptions"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ecommerce' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="shippingCost" className="text-gray-300">Coût de livraison (€)</Label>
                          <Input
                            id="shippingCost"
                            type="number"
                            step="0.01"
                            value={siteSettings.shippingCost}
                            onChange={(e) => setSiteSettings({ ...siteSettings, shippingCost: parseFloat(e.target.value) })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="freeShippingThreshold" className="text-gray-300">Seuil livraison gratuite (€)</Label>
                          <Input
                            id="freeShippingThreshold"
                            type="number"
                            step="0.01"
                            value={siteSettings.freeShippingThreshold}
                            onChange={(e) => setSiteSettings({ ...siteSettings, freeShippingThreshold: parseFloat(e.target.value) })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Autoriser les inscriptions</h4>
                            <p className="text-gray-400 text-sm">Permettre aux utilisateurs de s'inscrire</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={siteSettings.allowRegistration}
                            onChange={(e) => setSiteSettings({ ...siteSettings, allowRegistration: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Permettre aux utilisateurs de s'inscrire"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Vérification email obligatoire</h4>
                            <p className="text-gray-400 text-sm">Exiger la vérification de l'email lors de l'inscription</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={siteSettings.requireEmailVerification}
                            onChange={(e) => setSiteSettings({ ...siteSettings, requireEmailVerification: e.target.checked })}
                            className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                            title="Exiger la vérification de l'email lors de l'inscription"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'system' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="maxFileSize" className="text-gray-300">Taille max des fichiers (MB)</Label>
                          <Input
                            id="maxFileSize"
                            type="number"
                            value={siteSettings.maxFileSize}
                            onChange={(e) => setSiteSettings({ ...siteSettings, maxFileSize: parseInt(e.target.value) })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="allowedFileTypes" className="text-gray-300">Types de fichiers autorisés</Label>
                          <Input
                            id="allowedFileTypes"
                            value={siteSettings.allowedFileTypes.join(', ')}
                            onChange={(e) => setSiteSettings({ ...siteSettings, allowedFileTypes: e.target.value.split(', ').filter(Boolean) })}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="jpg, jpeg, png, webp"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Mode maintenance</h4>
                          <p className="text-gray-400 text-sm">Mettre le site en mode maintenance</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettings.maintenanceMode}
                          onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                          title="Mettre le site en mode maintenance"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bouton de sauvegarde */}
                  <div className="pt-6 border-t border-gray-700">
                    <Button 
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder les paramètres
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
