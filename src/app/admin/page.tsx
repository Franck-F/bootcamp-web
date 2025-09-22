'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { LowStockAlert } from '@/components/admin/low-stock-alert'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || !['admin', 'moderator'].includes(session.user.role)) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders />
              <LowStockAlert />
            </div>
          </div>
        )
      case 'products':
        return <div>Gestion des produits</div>
      case 'orders':
        return <div>Gestion des commandes</div>
      case 'stock':
        return <div>Gestion des stocks</div>
      case 'users':
        return <div>Gestion des utilisateurs</div>
      case 'settings':
        return <div>Paramètres</div>
      default:
        return <div>Contenu non trouvé</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'dashboard' ? 'Tableau de bord' : activeTab}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'dashboard' 
                  ? 'Vue d\'ensemble de votre boutique' 
                  : `Gestion des ${activeTab}`
                }
              </p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
