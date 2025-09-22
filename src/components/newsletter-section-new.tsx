'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Shield, 
  Gift, 
  Clock, 
  Star, 
  Users, 
  Award,
  Zap,
  Heart,
  Crown
} from 'lucide-react'

export function NewsletterSectionNew() {
  const advantages = [
    {
      icon: Truck,
      title: 'Livraison Express',
      description: 'Livraison gratuite en 24h partout en France',
      highlight: 'GRATUIT',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Authenticité 100%',
      description: 'Toutes nos sneakers sont vérifiées et certifiées',
      highlight: 'GARANTI',
      color: 'text-green-400'
    },
    {
      icon: Gift,
      title: 'Retour Facile',
      description: 'Échange et remboursement gratuits sous 30 jours',
      highlight: '30 JOURS',
      color: 'text-purple-400'
    },
    {
      icon: Clock,
      title: 'Support 24/7',
      description: 'Assistance client disponible à tout moment',
      highlight: '24/7',
      color: 'text-orange-400'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Clients satisfaits', icon: Users },
    { number: '4.9/5', label: 'Note moyenne', icon: Star },
    { number: '99%', label: 'Taux de satisfaction', icon: Award },
    { number: '24h', label: 'Délai de livraison', icon: Zap }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Pourquoi choisir{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-400">
              SneakPeak
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez les avantages exclusifs qui font de nous la référence 
            pour les sneakers premium en France.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-center hover:bg-gray-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800/30 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-red-600/20 transition-colors duration-300">
                    <advantage.icon className={`w-8 h-8 ${advantage.color} group-hover:text-red-400 transition-colors duration-300`} />
                  </div>
                </div>
                
                <Badge className={`mb-4 ${advantage.color} bg-gray-800 border-gray-700`}>
                  {advantage.highlight}
                </Badge>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {advantage.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-full px-8 py-4 text-white font-semibold text-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 cursor-pointer group">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Rejoignez la communauté SneakPeak</span>
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          <p className="text-gray-400 mt-4 text-sm">
            Plus de 50 000 passionnés nous font confiance
          </p>
        </div>
      </div>
    </section>
  )
}
