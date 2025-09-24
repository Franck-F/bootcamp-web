'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Save,
  Package,
  Bell,
  BarChart3,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StockSettings {
  lowStockThreshold: number
  autoReorder: boolean
  reorderThreshold: number
  reorderQuantity: number
  emailAlerts: boolean
  alertFrequency: 'daily' | 'weekly' | 'monthly'
}

interface StockReport {
  generatedAt: string
  summary: {
    totalVariants: number
    totalStock: number
    lowStock: number
    outOfStock: number
  }
  details: Array<{
    productName: string
    brand: string
    category: string
    size: string
    color: string
    stock: number
    price: number
    sku: string
    status: string
  }>
}

export default function StockSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<StockSettings>({
    lowStockThreshold: 10,
    autoReorder: false,
    reorderThreshold: 5,
    reorderQuantity: 50,
    emailAlerts: true,
    alertFrequency: 'daily'
  })
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stockData, setStockData] = useState<any>(null)
  const [report, setReport] = useState<StockReport | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchStockSettings()
  }, [user, loading, router])

  const fetchStockSettings = async () => {
    try {
      const response = await fetch('/api/admin/stock/settings')
      if (response.ok) {
        const data = await response.json()
        setStockData(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setPageLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/stock/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'setLowStockThreshold',
          settings: {
            threshold: settings.lowStockThreshold
          }
        })
      })

      if (response.ok) {
        toast.success('Paramètres sauvegardés avec succès')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const generateReport = async () => {
    try {
      const response = await fetch('/api/admin/stock/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateReport'
        })
      })

      const result = await response.json()

      if (response.ok) {
        setReport(result.report)
        toast.success('Rapport généré avec succès')
      } else {
        toast.error('Erreur lors de la génération du rapport')
      }
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      toast.error('Erreur lors de la génération du rapport')
    }
  }

  const downloadReport = () => {
    if (!report) return

    const csvContent = [
      ['Produit', 'Marque', 'Catégorie', 'Taille', 'Couleur', 'Stock', 'Prix', 'SKU', 'Statut'],
      ...report.details.map(item => [
        item.productName,
        item.brand,
        item.category,
        item.size,
        item.color,
        item.stock,
        item.price,
        item.sku,
        item.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-stock-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement des paramètres...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Paramètres de Stock</h1>
            <p className="text-gray-400">Configurez la gestion automatique du stock</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/admin/stock')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Package className="w-4 h-4 mr-2" />
              Retour au Stock
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Paramètres */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seuils de stock */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  Seuils de Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seuil de stock faible
                  </label>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      lowStockThreshold: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Les produits avec un stock inférieur ou égal à ce nombre seront marqués comme "stock faible"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seuil de réapprovisionnement automatique
                  </label>
                  <input
                    type="number"
                    value={settings.reorderThreshold}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      reorderThreshold: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Quantité à laquelle déclencher une commande automatique
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantité de réapprovisionnement
                  </label>
                  <input
                    type="number"
                    value={settings.reorderQuantity}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      reorderQuantity: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Quantité à commander lors du réapprovisionnement automatique
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alertes */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-500" />
                  Alertes et Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Alertes par email
                    </label>
                    <p className="text-xs text-gray-400">
                      Recevoir des alertes par email pour les stocks faibles
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      emailAlerts: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fréquence des alertes
                  </label>
                  <select
                    value={settings.alertFrequency}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alertFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Réapprovisionnement automatique
                    </label>
                    <p className="text-xs text-gray-400">
                      Commander automatiquement quand le stock atteint le seuil
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoReorder}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      autoReorder: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={generateReport}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Générer Rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques et alertes */}
          <div className="space-y-6">
            {/* Statistiques actuelles */}
            {stockData && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                    Statistiques Actuelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total variantes</span>
                    <span className="text-white font-semibold">{stockData.summary.totalVariants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">En stock</span>
                    <span className="text-green-500 font-semibold">{stockData.summary.inStockVariants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Stock faible</span>
                    <span className="text-yellow-500 font-semibold">{stockData.summary.lowStockVariants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rupture</span>
                    <span className="text-red-500 font-semibold">{stockData.summary.outOfStockVariants}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alertes récentes */}
            {stockData && stockData.alerts && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Alertes Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stockData.alerts.lowStock.slice(0, 5).map((alert: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-yellow-900/20 rounded">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{alert.productName}</p>
                          <p className="text-xs text-gray-400">
                            {alert.brand} • {alert.size} • Stock: {alert.stock}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {stockData.alerts.outOfStock.slice(0, 3).map((alert: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-red-900/20 rounded">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{alert.productName}</p>
                          <p className="text-xs text-gray-400">
                            {alert.brand} • {alert.size} • Rupture
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rapport généré */}
            {report && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Rapport Généré
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-400">
                      Généré le: {new Date(report.generatedAt).toLocaleString()}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Total:</span>
                        <span className="text-white ml-2">{report.summary.totalVariants}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Stock total:</span>
                        <span className="text-white ml-2">{report.summary.totalStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Stock faible:</span>
                        <span className="text-yellow-500 ml-2">{report.summary.lowStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rupture:</span>
                        <span className="text-red-500 ml-2">{report.summary.outOfStock}</span>
                      </div>
                    </div>
                    <Button
                      onClick={downloadReport}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
