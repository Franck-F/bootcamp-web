'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  RotateCcw, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Truck,
  CreditCard,
  FileText,
  Mail,
  Phone,
  Calendar,
  Shield
} from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8">
              <RotateCcw className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">Retours & Échanges</span>
              <Package className="w-4 h-4 text-pink-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Retours &{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Échanges
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Retournez facilement vos articles dans les 14 jours suivant la réception.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            
            {/* Droit de rétractation */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-400" />
                  Droit de rétractation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Délai de rétractation</h4>
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-white">14 jours</span>
                    </div>
                    <p className="text-sm">
                      Vous disposez de 14 jours à compter de la réception de votre commande 
                      pour exercer votre droit de rétractation, conformément à la réglementation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Conditions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Articles non portés</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Emballage d'origine</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Étiquettes conservées</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Accessoires inclus</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processus de retour */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <RotateCcw className="w-6 h-6 mr-3 text-blue-400" />
                  Comment retourner un article
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Demande de retour</h4>
                    <p className="text-sm">Connectez-vous à votre espace client et demandez un retour</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Étiquette</h4>
                    <p className="text-sm">Recevez votre étiquette de retour par e-mail</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Expédition</h4>
                    <p className="text-sm">Emballez et envoyez votre colis</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-400 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Remboursement</h4>
                    <p className="text-sm">Remboursement sous 48h après réception</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types de retour */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Retour simple */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-green-400" />
                    Retour simple
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Remboursement</span>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">48h</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Remboursement intégral</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Même mode de paiement</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Frais de retour gratuits</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong>Délai :</strong> 48h après réception du retour
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Échange */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Package className="w-5 h-5 mr-3 text-blue-400" />
                    Échange
                    <Badge className="ml-2 bg-blue-600/20 text-blue-400 border-blue-500/30">Recommandé</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Nouvel article</span>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">5-7 jours</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Même taille, autre couleur</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Autre taille, même modèle</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Livraison gratuite</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      <strong>Délai :</strong> 5-7 jours ouvrés
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Frais de retour */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-orange-400" />
                  Frais de retour
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Retour gratuit</h4>
                    <p className="text-2xl font-bold text-green-400 mb-2">0€</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Article défectueux</li>
                      <li>• Erreur de notre part</li>
                      <li>• Taille incorrecte</li>
                    </ul>
                  </div>
                  <div className="text-center p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Retour standard</h4>
                    <p className="text-2xl font-bold text-blue-400 mb-2">4,90€</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Changement d'avis</li>
                      <li>• Article non conforme</li>
                      <li>• Retour après 7 jours</li>
                    </ul>
                  </div>
                  <div className="text-center p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Retour express</h4>
                    <p className="text-2xl font-bold text-purple-400 mb-2">9,90€</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Retour prioritaire</li>
                      <li>• Remboursement rapide</li>
                      <li>• Suivi détaillé</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles non retournables */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
                  Articles non retournables
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Articles personnalisés</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Sneakers personnalisées</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Articles sur mesure</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Produits gravés</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Articles d'hygiène</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Chaussettes portées</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Articles intimes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Produits d'entretien</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendrier de retour */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-purple-400" />
                  Calendrier de retour
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Délais importants</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                        <span className="text-sm">Demande de retour</span>
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">14 jours</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                        <span className="text-sm">Expédition du retour</span>
                        <Badge className="bg-green-600/20 text-green-400 border-green-500/30">7 jours</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                        <span className="text-sm">Remboursement</span>
                        <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">48h</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Conseils</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Retournez rapidement</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Conservez la preuve d'envoi</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Vérifiez l'état des articles</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Contactez-nous en cas de doute</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-blue-400" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Notre équipe est là pour vous accompagner dans vos retours et échanges. 
                  N'hésitez pas à nous contacter pour toute question.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Contact retour</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">retours@sneakpeak.fr</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">01 23 45 67 89</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Horaires</h4>
                    <div className="space-y-1 text-sm">
                      <p>Lun-Ven : 9h-18h</p>
                      <p>Sam : 10h-16h</p>
                      <p>Dim : Fermé</p>
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
