'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter, useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  UserCheck,
  MailCheck,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
  email_verified: boolean
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

export default function EditUserPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    is_active: true,
    email_verified: false,
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  })

  useEffect(() => {
    if (!userData) {
      router.push('/auth/signin')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (params.id) {
      fetchUser()
    }
  }, [user, loading, router, params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data.userData)
        setFormData({
          name: data.user?.name,
          email: data.user?.email,
          password: '',
          role: data.user.role,
          is_active: data.user.is_active,
          email_verified: data.user?.email_verified,
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          postal_code: data.user.postal_code || '',
          country: data.user.country || ''
        })
      } else {
        toast.error('Utilisateur non trouvé')
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error)
      toast.error('Erreur lors du chargement de l\'utilisateur')
      router.push('/admin/users')
    } finally {
      setPageLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis')
      return false
    }

    if (!formData.email.trim()) {
      toast.error('L\'email est requis')
      return false
    }

    if (!formData.email.includes('@')) {
      toast.error('L\'email n\'est pas valide')
      return false
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
        email_verified: formData.email_verified,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postal_code || null,
        country: formData.country || null
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Utilisateur mis à jour avec succès')
        router.push(`/admin/users/${params.id}`)
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour de l\'utilisateur')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur lors de la mise à jour de l\'utilisateur')
    } finally {
      setSaving(false)
    }
  }

  if (pageLoading) {
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

  if (!userData) {
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
      
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Modifier l'Utilisateur</h1>
            <p className="text-gray-400">Modifiez les informations de {userData?.name || 'l\'utilisateur'}</p>
          </div>
          
          <Button
            onClick={() => router.push(`/admin/users/${params.id}`)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Informations de Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Nom complet *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                      placeholder="jean.dupont@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">Nouveau mot de passe (optionnel)</Label>
                  <div className="relative">
                    <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Laissez vide pour conserver le mot de passe actuel
                  </p>
                </div>

                <div>
                  <Label htmlFor="role" className="text-white">Rôle *</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      required
                    >
                      <option value="customer">Client</option>
                      <option value="moderator">Modérateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="is_active" className="text-white flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                    Compte actif
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="email_verified"
                    checked={formData.email_verified}
                    onChange={(e) => handleInputChange('email_verified', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="email_verified" className="text-white flex items-center">
                    <MailCheck className="w-4 h-4 mr-2 text-blue-500" />
                    Email vérifié
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations d'adresse */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-500" />
                Informations d'Adresse (Optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-white">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-white">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code" className="text-white">Code postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="75001"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="country" className="text-white">Pays</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="France"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement pour les changements de rôle */}
          {formData.role !== userData?.role && (
            <Card className="bg-yellow-900 border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-white font-medium">Changement de rôle</p>
                    <p className="text-yellow-200 text-sm">
                      Vous êtes sur le point de changer le rôle de {userData?.name} de "{userData?.role}" vers "{formData.role}".
                      Cette action peut affecter les permissions de l'utilisateur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.push(`/admin/users/${params.id}`)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
