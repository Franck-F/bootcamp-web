'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, Settings, Eye, Target, BarChart3, Shield, AlertCircle, CheckCircle, XCircle, Mail, Phone } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-8">
              <Cookie className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Gestion des cookies</span>
              <Settings className="w-4 h-4 text-orange-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Politique des{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Cookies
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Dernière mise à jour : 15 décembre 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            
            {/* Introduction */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Cookie className="w-6 h-6 mr-3 text-yellow-400" />
                  Qu'est-ce qu'un cookie ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone 
                  lorsque vous visitez notre site web. Les cookies nous permettent de reconnaître votre 
                  appareil et de mémoriser vos préférences.
                </p>
                <p>
                  SneakPeak utilise des cookies pour améliorer votre expérience de navigation, 
                  personnaliser le contenu et analyser l'utilisation de notre site.
                </p>
              </CardContent>
            </Card>

            {/* Types de cookies */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-blue-400" />
                  Types de cookies utilisés
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                
                {/* Cookies essentiels */}
                <div className="border border-green-500/30 rounded-lg p-4 bg-green-600/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-white">Cookies essentiels</h4>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Obligatoires</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Gestion de la session utilisateur</li>
                    <li>• Sécurité et authentification</li>
                    <li>• Fonctionnalités de base du site</li>
                    <li>• Panier d'achat</li>
                  </ul>
                </div>

                {/* Cookies analytiques */}
                <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-600/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">Cookies analytiques</h4>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Optionnels</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site.
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Statistiques de visite</li>
                    <li>• Pages les plus consultées</li>
                    <li>• Temps passé sur le site</li>
                    <li>• Sources de trafic</li>
                  </ul>
                </div>

                {/* Cookies marketing */}
                <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-600/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-white">Cookies marketing</h4>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Optionnels</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Ces cookies permettent de personnaliser les publicités et le contenu.
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Publicités personnalisées</li>
                    <li>• Suivi des conversions</li>
                    <li>• Remarketing</li>
                    <li>• A/B testing</li>
                  </ul>
                </div>

                {/* Cookies de personnalisation */}
                <div className="border border-orange-500/30 rounded-lg p-4 bg-orange-600/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Eye className="w-5 h-5 text-orange-400" />
                    <h4 className="font-semibold text-white">Cookies de personnalisation</h4>
                    <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">Optionnels</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    Ces cookies mémorisent vos préférences et choix.
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Préférences de langue</li>
                    <li>• Thème sombre/clair</li>
                    <li>• Paramètres d'affichage</li>
                    <li>• Favoris et listes</li>
                  </ul>
                </div>

              </CardContent>
            </Card>

            {/* Cookies tiers */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-red-400" />
                  Cookies tiers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Notre site utilise des services tiers qui peuvent déposer leurs propres cookies. 
                  Ces cookies sont soumis aux politiques de confidentialité de ces services.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Google Analytics</h4>
                    <p className="text-sm mb-2">
                      Analyse du trafic et du comportement des utilisateurs.
                    </p>
                    <p className="text-xs text-gray-400">
                      <a href="https://policies.google.com/privacy" className="text-blue-400 hover:text-blue-300 underline">
                        Politique de confidentialité Google
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Facebook Pixel</h4>
                    <p className="text-sm mb-2">
                      Suivi des conversions et publicités ciblées.
                    </p>
                    <p className="text-xs text-gray-400">
                      <a href="https://www.facebook.com/privacy/explanation" className="text-blue-400 hover:text-blue-300 underline">
                        Politique de confidentialité Facebook
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Stripe</h4>
                    <p className="text-sm mb-2">
                      Traitement sécurisé des paiements.
                    </p>
                    <p className="text-xs text-gray-400">
                      <a href="https://stripe.com/privacy" className="text-blue-400 hover:text-blue-300 underline">
                        Politique de confidentialité Stripe
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Mailchimp</h4>
                    <p className="text-sm mb-2">
                      Gestion des newsletters et campagnes e-mail.
                    </p>
                    <p className="text-xs text-gray-400">
                      <a href="https://mailchimp.com/legal/privacy/" className="text-blue-400 hover:text-blue-300 underline">
                        Politique de confidentialité Mailchimp
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestion des cookies */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-green-400" />
                  Gestion de vos préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Banner de consentement</h4>
                  <p>
                    Lors de votre première visite, un banner vous permet de choisir quels cookies accepter. 
                    Vous pouvez modifier vos préférences à tout moment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Paramètres du navigateur</h4>
                  <p className="mb-3">
                    Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">Chrome</h5>
                      <p className="text-sm">Paramètres &gt; Confidentialité et sécurité &gt; Cookies</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Firefox</h5>
                      <p className="text-sm">Options &gt; Vie privée et sécurité &gt; Cookies</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Safari</h5>
                      <p className="text-sm">Préférences &gt; Confidentialité &gt; Cookies</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Edge</h5>
                      <p className="text-sm">Paramètres &gt; Cookies et autorisations de site</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Modifier vos préférences</h4>
                  <p className="text-sm mb-3">
                    Cliquez sur le bouton ci-dessous pour modifier vos préférences de cookies 
                    à tout moment.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Gérer mes cookies
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Durée de conservation */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-orange-400" />
                  Durée de conservation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Les cookies ont des durées de vie différentes selon leur type et leur finalité :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Cookies de session</h4>
                    <p className="text-sm">
                      Supprimés automatiquement à la fermeture du navigateur.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Cookies persistants</h4>
                    <p className="text-sm">
                      Conservés jusqu'à 13 mois maximum, conformément au RGPD.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Cookies analytiques</h4>
                    <p className="text-sm">
                      Durée de 2 ans maximum pour les analyses de tendances.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Cookies marketing</h4>
                    <p className="text-sm">
                      Durée de 13 mois maximum, renouvelable avec consentement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact du refus */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <XCircle className="w-6 h-6 mr-3 text-red-400" />
                  Impact du refus des cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Le refus de certains cookies peut affecter votre expérience sur notre site :
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Cookies essentiels</h4>
                      <p className="text-sm">Le site fonctionne normalement, ces cookies sont obligatoires.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Cookies analytiques</h4>
                      <p className="text-sm">Nous ne pourrons pas améliorer le site selon vos besoins.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Cookies marketing</h4>
                      <p className="text-sm">Les publicités ne seront pas personnalisées.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">Cookies de personnalisation</h4>
                      <p className="text-sm">Vos préférences ne seront pas mémorisées.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-blue-400" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Pour toute question concernant notre utilisation des cookies, 
                  vous pouvez nous contacter :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Par e-mail</h4>
                    <p>dpo@sneakpeak.fr</p>
                    <p className="text-sm text-gray-400">Réponse sous 48h</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Par téléphone</h4>
                    <p>01 23 45 67 89</p>
                    <p className="text-sm text-gray-400">Lun-Ven 9h-18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-purple-400" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Cette politique de cookies peut être modifiée à tout moment. 
                  Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
                </p>
                <p>
                  En cas de modification substantielle, nous vous en informerons par e-mail 
                  ou par un avis sur notre site web.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Dernière mise à jour :</span>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    15 décembre 2024
                  </Badge>
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
