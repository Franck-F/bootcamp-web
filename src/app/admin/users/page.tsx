'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  Crown,
  User,
  Mail,
  Calendar,
  ShoppingCart,
  Euro,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'moderator' | 'customer'
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
  avatar?: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

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
      loadUsers()
    }
  }, [session, status, router])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Simuler le chargement des utilisateurs
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin Principal',
          email: 'admin@sneakpeak.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: '2',
          name: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          role: 'customer',
          status: 'active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 3,
          totalSpent: 893.00
        },
        {
          id: '3',
          name: 'Marie Martin',
          email: 'marie.martin@email.com',
          role: 'customer',
          status: 'active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 7,
          totalSpent: 2156.50
        },
        {
          id: '4',
          name: 'Modérateur Test',
          email: 'moderator@sneakpeak.com',
          role: 'moderator',
          status: 'active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: '5',
          name: 'Utilisateur Banni',
          email: 'banned@email.com',
          role: 'customer',
          status: 'banned',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          lastLogin: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 1,
          totalSpent: 299.00
        }
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-600 text-white"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
      case 'moderator':
        return <Badge className="bg-blue-600 text-white"><Shield className="w-3 h-3 mr-1" />Modérateur</Badge>
      case 'customer':
        return <Badge className="bg-gray-600 text-white"><User className="w-3 h-3 mr-1" />Client</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white">Actif</Badge>
      case 'inactive':
        return <Badge className="bg-yellow-600 text-white">Inactif</Badge>
      case 'banned':
        return <Badge className="bg-red-600 text-white">Banni</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0),
    totalOrders: users.reduce((sum, user) => sum + user.totalOrders, 0)
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

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[90%] mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Gestion des Utilisateurs</h1>
                <p className="text-gray-400">Administration des comptes utilisateurs</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-blue-600/20 rounded-full">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Utilisateurs Actifs</p>
                    <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Total Commandes</p>
                    <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-medium">Chiffre d'Affaires</p>
                    <p className="text-3xl font-bold text-white">{stats.totalRevenue.toLocaleString()} €</p>
                  </div>
                  <div className="p-3 bg-yellow-600/20 rounded-full">
                    <Euro className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
              title="Filtrer par rôle utilisateur"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Modérateur</option>
              <option value="customer">Client</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
              title="Filtrer par statut utilisateur"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="banned">Banni</option>
            </select>
          </div>

          {/* Tableau des utilisateurs */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Utilisateur</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Rôle</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Statut</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Commandes</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Dépenses</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Dernière connexion</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{user.totalOrders}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{user.totalSpent.toFixed(2)} €</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-blue-400">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-300">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
