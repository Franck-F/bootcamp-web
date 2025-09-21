'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Veuillez entrer votre adresse email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Veuillez entrer une adresse email valide')
      return
    }

    setIsLoading(true)

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubscribed(true)
      toast.success('Inscription à la newsletter réussie !')
      setEmail('')
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Inscription réussie !
          </h3>
          <p className="text-green-600 dark:text-green-300">
            Merci de vous être abonné à notre newsletter. Vous recevrez nos dernières actualités.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Restez informé
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Recevez nos dernières nouveautés et offres exclusives
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? '...' : 'S\'abonner'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            En vous abonnant, vous acceptez de recevoir nos emails marketing. 
            Vous pouvez vous désabonner à tout moment.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

// Composant pour la page d'accueil
export function NewsletterSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ne manquez aucune nouveauté
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter et soyez le premier à découvrir nos nouvelles collections, 
            offres exclusives et conseils mode.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Newsletter />
        </div>
      </div>
    </section>
  )
}
