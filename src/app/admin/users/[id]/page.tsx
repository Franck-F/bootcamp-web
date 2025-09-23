'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Heart,
  Crown,
  Shield,
  UserCheck,
  UserX,
  MailCheck,
  MailX,
  Euro,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
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
  orders: Array<{
    id: number
    order_number: string
    status: string
    total_amount: number
    created_at: string
  }>
  wishlist_items: Array<{
    id: number
    created_at: string
    products: {
      id: number
      name: string
      price: number
      brands: {
        name: string
      }
    }
  }>
  _count: {
    orders: number
    wishlist_items: number
  }
}

export default function UserDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (params.id) {
      fetchUser()
    }
  }, [session, status, router, params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        toast.error('Utilisateur non trouvé')
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error)
      toast.error('Erreur lors du chargement de l\'utilisateur')
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-5 h-5 text-purple-500" />
      case 'moderator':
        return <Shield className="w-5 h-5 text-blue-500" />
      default:
        return <User className="w-5 h-5 text-gray-500" />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white'
      case 'pending':
        return 'bg-yellow-600 text-white'
      case 'cancelled':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement de l'utilisateur...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Utilisateur non trouvé</h3>
            <p className="text-gray-400 mb-6">L'utilisateur demandé n'existe pas.</p>
            <Button
              onClick={() => router.push('/admin/users')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Retour à la liste
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/admin/users')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-400">Détails de l'utilisateur</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Téléphone</p>
                      <p className="text-white">{user.phone || 'Non renseigné'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Inscrit le</p>
                      <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <p className="text-gray-400 text-sm">Rôle</p>
                      <Badge className={`${getRoleColor(user.role)} text-xs`}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {user.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Adresse</p>
                      <p className="text-white">
                        {user.address}
                        {user.city && `, ${user.city}`}
                        {user.postal_code && ` ${user.postal_code}`}
                        {user.country && `, ${user.country}`}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statut du compte */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Statut du Compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    {user.is_active ? (
                      <UserCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-gray-400 text-sm">Statut</p>
                      <Badge className={user.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {user.email_verified ? (
                      <MailCheck className="w-5 h-5 text-blue-500" />
                    ) : (
                      <MailX className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <Badge className={user.email_verified ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'}>
                        {user.email_verified ? 'Vérifié' : 'Non vérifié'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commandes récentes */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-orange-500" />
                    Commandes Récentes
                  </span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {user._count.orders} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.orders.length > 0 ? (
                  <div className="space-y-3">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="text-white font-medium">#{order.order_number}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{order.total_amount.toFixed(2)} €</p>
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucune commande</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favoris */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Favoris
                  </span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {user._count.wishlist_items} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.wishlist_items.length > 0 ? (
                  <div className="space-y-3">
                    {user.wishlist_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">{item.products.name}</p>
                          <p className="text-gray-400 text-sm">{item.products.brands.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{item.products.price.toFixed(2)} €</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun favori</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistiques */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Commandes</span>
                  <span className="text-white font-semibold">{user._count.orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Favoris</span>
                  <span className="text-white font-semibold">{user._count.wishlist_items}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total dépensé</span>
                  <span className="text-white font-semibold">
                    {user.orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)} €
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Membre depuis</span>
                  <span className="text-white font-semibold">
                    {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white justify-start"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier l'utilisateur
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  {user.is_active ? 'Désactiver' : 'Activer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
