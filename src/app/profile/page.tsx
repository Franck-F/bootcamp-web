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
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Crown
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      // Simuler les données du profil (en production, récupérer depuis l'API)
      setProfile({
        id: session.user.id || '1',
        name: session.user.name || 'Utilisateur',
        email: session.user.email || '',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Mode',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        role: session.user.role || 'customer',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastLogin: new Date().toISOString()
      })

      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Mode',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      })

      setLoading(false)
    }
  }, [session, status, router])

  const handleSave = async () => {
    try {
      // En production, faire un appel API pour sauvegarder
      console.log('Sauvegarde du profil:', formData)
      setEditing(false)
      // Mettre à jour le profil local
      if (profile) {
        setProfile({
          ...profile,
          ...formData
        })
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
            <div>
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
