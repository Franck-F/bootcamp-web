'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Euro,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-8">
              <Truck className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-white">Livraison</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Informations de{' '}
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Livraison
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Découvrez nos options de livraison rapide et sécurisée partout en France.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            
            {/* Options de livraison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Livraison standard */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Truck className="w-6 h-6 mr-3 text-green-400" />
                    Livraison Standard
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">3-5 jours</span>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Gratuite dès 50€</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Livraison à domicile</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Suivi en temps réel</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Signature requise</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong>Frais :</strong> 4,90€ (gratuit dès 50€)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Livraison express */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-blue-400" />
                    Livraison Express
                    <Badge className="ml-2 bg-blue-600/20 text-blue-400 border-blue-500/30">Populaire</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">24-48h</span>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">9,90€</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Livraison prioritaire</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Suivi détaillé</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Livraison samedi</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong>Frais :</strong> 9,90€ (toujours)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Point relais */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-purple-400" />
                    Point Relais
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">2-4 jours</span>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Gratuit dès 30€</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>+30 000 points</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Conservation 7 jours</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Horaires étendus</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong>Frais :</strong> 2,90€ (gratuit dès 30€)
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Zones de livraison */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-blue-400" />
                  Zones de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">France métropolitaine</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Livraison standard : 3-5 jours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Livraison express : 24-48h</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Points relais disponibles</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Corse et DOM-TOM</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span>Livraison : 5-7 jours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span>Frais supplémentaires : 15€</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span>Suivi disponible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processus de livraison */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Package className="w-6 h-6 mr-3 text-orange-400" />
                  Processus de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Commande</h4>
                    <p className="text-sm">Validation et préparation de votre commande</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Expédition</h4>
                    <p className="text-sm">Envoi avec numéro de suivi</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Transport</h4>
                    <p className="text-sm">Suivi en temps réel de votre colis</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-400 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Livraison</h4>
                    <p className="text-sm">Réception et confirmation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suivi et sécurité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Suivi de commande */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-green-400" />
                    Suivi de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>E-mail de confirmation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>SMS de suivi</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Espace client</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Application mobile</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-blue-400" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Emballage sécurisé</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Assurance incluse</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Signature requise</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Protection contre le vol</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

            </div>

            {/* Problèmes de livraison */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
                  En cas de problème
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Retard de livraison</h4>
                    <p className="text-sm mb-3">
                      En cas de retard, nous vous informons par e-mail et SMS. 
                      Vous pouvez suivre votre colis en temps réel.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• Vérifiez le statut sur notre site</li>
                      <li>• Contactez le transporteur</li>
                      <li>• Appelez notre service client</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Colis endommagé</h4>
                    <p className="text-sm mb-3">
                      Si votre colis arrive endommagé, refusez-le et contactez-nous immédiatement.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• Prenez des photos</li>
                      <li>• Gardez l'emballage</li>
                      <li>• Contactez-nous sous 48h</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Contact d'urgence</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">01 23 45 67 89</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">contact@sneakpeak.fr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
