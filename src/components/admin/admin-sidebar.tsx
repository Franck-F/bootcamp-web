'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  Settings,
  BarChart3,
  AlertTriangle
} from 'lucide-react'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble'
  },
  {
    id: 'products',
    label: 'Produits',
    icon: Package,
    description: 'Gestion du catalogue'
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: ShoppingCart,
    description: 'Suivi des ventes'
  },
  {
    id: 'stock',
    label: 'Stocks',
    icon: Warehouse,
    description: 'Gestion des inventaires'
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    description: 'Gestion des comptes'
  },
  {
    id: 'analytics',
    label: 'Analytiques',
    icon: BarChart3,
    description: 'Statistiques et rapports'
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configuration'
  }
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Administration</h2>
            <p className="text-sm text-gray-600">Sneakers Store</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start h-auto p-3 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </nav>

        {/* Alertes rapides */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Alertes</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-yellow-700">
              • 3 produits en rupture de stock
            </div>
            <div className="text-xs text-yellow-700">
              • 5 commandes en attente
            </div>
            <div className="text-xs text-yellow-700">
              • 2 retours à traiter
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Ventes aujourd'hui</span>
            <span className="font-medium text-green-600">+12%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Commandes</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Chiffre d'affaires</span>
            <span className="font-medium">2,450€</span>
          </div>
        </div>
      </div>
    </div>
  )
}
