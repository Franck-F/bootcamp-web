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
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  MailCheck,
  Shield,
  MoreVertical,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Crown,
  User,
  UserCog
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
  email_verified: boolean
  created_at: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
  _count: {
    orders: number
    wishlist_items: number
  }
}

interface UserStats {
  total: number
  active: number
  inactive: number
  verified: number
  unverified: number
  byRole: Record<string, number>
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [bulkAction, setBulkAction] = useState('')
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchUsers()
  }, [user, loading, router, currentPage, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setStats(data.stats || null)
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setPageLoading(false)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) {
      toast.error('Veuillez sélectionner une action et des utilisateurs')
      return
    }

    try {
      const response = await fetch('/api/admin/users/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: bulkAction,
          userIds: selectedUsers,
          ...(bulkAction === 'changeRole' && { newRole: 'moderator' })
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Action ${bulkAction} terminée: ${result.results.success} succès, ${result.results.errors} erreurs`)
        setSelectedUsers([])
        setBulkAction('')
        setShowBulkActions(false)
        fetchUsers()
      } else {
        toast.error(result.error || 'Erreur lors de l\'action en masse')
      }
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error)
      toast.error('Erreur lors de l\'action en masse')
    }
  }

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user?.id))
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-500" />
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600 text-white'
      case 'moderator':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement des utilisateurs...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h1>
            <p className="text-gray-400">Gérez les comptes utilisateurs et leurs rôles</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/admin/users/new')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Actifs</p>
                    <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Inactifs</p>
                    <p className="text-2xl font-bold text-red-500">{stats.inactive}</p>
                  </div>
                  <UserX className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Vérifiés</p>
                    <p className="text-2xl font-bold text-blue-500">{stats.verified}</p>
                  </div>
                  <MailCheck className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Non vérifiés</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.unverified}</p>
                  </div>
                  <Mail className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions en masse */}
        {selectedUsers.length > 0 && (
          <Card className="bg-orange-900 border-orange-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCog className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">
                    {selectedUsers.length} utilisateur(s) sélectionné(s)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Sélectionner une action</option>
                    <option value="activate">Activer</option>
                    <option value="deactivate">Désactiver</option>
                    <option value="verify">Vérifier email</option>
                    <option value="unverify">Dévérifier email</option>
                    <option value="changeRole">Changer le rôle</option>
                    <option value="delete">Supprimer</option>
                  </select>
                  <Button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Appliquer
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUsers([])
                      setBulkAction('')
                    }}
                    variant="outline"
                    className="border-orange-600 text-orange-500 hover:bg-orange-800"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtres et recherche */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Modérateur</option>
                  <option value="customer">Client</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Utilisateurs ({users.length})</span>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-400">Tout sélectionner</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user?.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                      className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold">{user?.name}</h3>
                        <Badge className={`${getRoleColor(user.role)} text-xs flex items-center space-x-1`}>
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </Badge>
                        {user.is_active ? (
                          <Badge className="bg-green-600 text-white text-xs">Actif</Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white text-xs">Inactif</Badge>
                        )}
                        {user?.email_verified ? (
                          <Badge className="bg-blue-600 text-white text-xs">Vérifié</Badge>
                        ) : (
                          <Badge className="bg-yellow-600 text-white text-xs">Non vérifié</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{user?.email}</span>
                        <span>•</span>
                        <span>{user._count.orders} commandes</span>
                        <span>•</span>
                        <span>{user._count.wishlist_items} favoris</span>
                        <span>•</span>
                        <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user?.id}`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user?.id}/edit`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-400 mb-6">Aucun utilisateur ne correspond à vos critères de recherche.</p>
                  <Button
                    onClick={() => router.push('/admin/users/new')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un utilisateur
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Précédent
                </Button>
                
                <span className="text-white">
                  Page {currentPage} sur {totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}