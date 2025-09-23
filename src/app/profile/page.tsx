'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Crown,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  role: string
  createdAt: string
  lastLogin?: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Simuler les données du profil (en production, récupérer depuis l'API)
    setProfile({
      id: user?.id || '1',
      name: user?.name || 'Utilisateur',
      email: user?.email || '',
      phone: '+33 6 12 34 56 78',
      address: '123 Rue de la Mode',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      role: user?.role || 'customer',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
    })

    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+33 6 12 34 56 78',
      address: '123 Rue de la Mode',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    })

    setProfileLoading(false)
  }, [user, loading, router])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setProfile({
          ...profile,
          ...result.user
        })
        setEditing(false)
      } else {
        const error = await response.json()
        console.error('Erreur lors de la sauvegarde:', error.error)
        // Ici vous pourriez afficher un message d'erreur à l'utilisateur
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postalCode: profile.postalCode || '',
        country: profile.country || ''
      })
    }
    setEditing(false)
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess('')

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Le mot de passe actuel est requis')
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError('Le nouveau mot de passe est requis')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'actuel')
      return
    }

    try {
      // En production, faire un appel API pour changer le mot de passe
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        setPasswordSuccess('Mot de passe modifié avec succès')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setEditingPassword(false)
      } else {
        const error = await response.json()
        setPasswordError(error.message || 'Erreur lors du changement de mot de passe')
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      setPasswordError('Erreur de connexion. Veuillez réessayer.')
    }
  }

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setPasswordSuccess('')
    setEditingPassword(false)
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Profil non trouvé</div>
        </div>
        <Footer />
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-600 text-white"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
      case 'moderator':
        return <Badge className="bg-blue-600 text-white"><Shield className="w-3 h-3 mr-1" />Modérateur</Badge>
      default:
        return <Badge className="bg-gray-600 text-white"><User className="w-3 h-3 mr-1" />Client</Badge>
    }
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
                <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
                <p className="text-gray-400">Gérez vos informations personnelles</p>
              </div>
              <div className="flex items-center space-x-4">
                {getRoleBadge(profile.role)}
                {!editing && (
                  <Button onClick={() => setEditing(true)} className="bg-red-600 hover:bg-red-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations personnelles */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Nom complet</Label>
                      {editing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      ) : (
                        <div className="text-white py-2">{profile.name}</div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      {editing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      ) : (
                        <div className="text-white py-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                    {editing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    ) : (
                      <div className="text-white py-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {profile.phone || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-300">Adresse</Label>
                    {editing ? (
                      <div className="space-y-4">
                        <Input
                          placeholder="Adresse"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Ville"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                          <Input
                            placeholder="Code postal"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <Input
                          placeholder="Pays"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    ) : (
                      <div className="text-white py-2 flex items-start">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div>
                          {profile.address && <div>{profile.address}</div>}
                          {profile.city && profile.postalCode && (
                            <div>{profile.postalCode} {profile.city}</div>
                          )}
                          {profile.country && <div>{profile.country}</div>}
                          {!profile.address && !profile.city && (
                            <div className="text-gray-400">Adresse non renseignée</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {editing && (
                    <div className="flex space-x-4 pt-4">
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations du compte */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Rôle</Label>
                    <div className="mt-1">
                      {getRoleBadge(profile.role)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Membre depuis</Label>
                    <div className="text-white py-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  {profile.lastLogin && (
                    <div>
                      <Label className="text-gray-300">Dernière connexion</Label>
                      <div className="text-white py-2">
                        {new Date(profile.lastLogin).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section Sécurité - Mot de passe */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Sécurité
                    </CardTitle>
                    {!editingPassword && (
                      <Button 
                        onClick={() => setEditingPassword(true)} 
                        variant="outline" 
                        size="sm"
                        className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Changer le mot de passe
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingPassword ? (
                    <div className="space-y-4">
                      {passwordError && (
                        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                          {passwordError}
                        </div>
                      )}
                      
                      {passwordSuccess && (
                        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                          {passwordSuccess}
                        </div>
                      )}

                      <div>
                        <Label htmlFor="currentPassword" className="text-gray-300">Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white pr-10"
                            placeholder="Entrez votre mot de passe actuel"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="newPassword" className="text-gray-300">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white pr-10"
                            placeholder="Entrez votre nouveau mot de passe"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères</p>
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-300">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="bg-gray-800 border-gray-700 text-white pr-10"
                            placeholder="Confirmez votre nouveau mot de passe"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <Button 
                          onClick={handlePasswordChange} 
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Changer le mot de passe
                        </Button>
                        <Button 
                          onClick={handleCancelPassword} 
                          variant="outline" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <p className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Votre mot de passe est sécurisé
                      </p>
                      <p className="text-sm mt-2">
                        Cliquez sur "Changer le mot de passe" pour modifier votre mot de passe.
                      </p>
                    </div>
                  )}
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
