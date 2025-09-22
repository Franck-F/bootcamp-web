'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye, Lock, Database, User, Mail, Phone, FileText, Download } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-8">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">Protection des données</span>
              <Lock className="w-4 h-4 text-green-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Politique de{' '}
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Confidentialité
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                  <Eye className="w-6 h-6 mr-3 text-blue-400" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  SneakPeak s'engage à protéger votre vie privée et vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, 
                  stockons et protégeons vos informations personnelles conformément au RGPD.
                </p>
                <p>
                  En utilisant notre site web et nos services, vous acceptez les pratiques 
                  décrites dans cette politique de confidentialité.
                </p>
              </CardContent>
            </Card>

            {/* Responsable du traitement */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 mr-3 text-green-400" />
                  Responsable du traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">SneakPeak</h4>
                    <p>123 Rue de la Mode</p>
                    <p>75001 Paris, France</p>
                    <p>SIRET: 123 456 789 00012</p>
                    <p>TVA: FR12 123456789</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Contact DPO</h4>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>dpo@sneakpeak.fr</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>01 23 45 67 89</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Données collectées */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Database className="w-6 h-6 mr-3 text-purple-400" />
                  Données collectées
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Données d'identification</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Nom et prénom</li>
                    <li>• Adresse e-mail</li>
                    <li>• Numéro de téléphone</li>
                    <li>• Adresse de livraison et de facturation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Données de navigation</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Adresse IP</li>
                    <li>• Type de navigateur</li>
                    <li>• Pages visitées</li>
                    <li>• Durée de session</li>
                    <li>• Cookies et technologies similaires</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Données de commande</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Historique des commandes</li>
                    <li>• Préférences de produits</li>
                    <li>• Données de paiement (sécurisées)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Finalités du traitement */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-orange-400" />
                  Finalités du traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Finalités principales</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Traitement des commandes</li>
                      <li>• Livraison des produits</li>
                      <li>• Service client</li>
                      <li>• Facturation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Finalités secondaires</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Marketing (avec consentement)</li>
                      <li>• Amélioration du site</li>
                      <li>• Statistiques d'usage</li>
                      <li>• Sécurité</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Base légale */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-red-400" />
                  Base légale du traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Exécution</Badge>
                    <div>
                      <h4 className="font-semibold text-white">Exécution du contrat</h4>
                      <p className="text-sm">Traitement des commandes, livraison, service client</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Consentement</Badge>
                    <div>
                      <h4 className="font-semibold text-white">Consentement</h4>
                      <p className="text-sm">Marketing, cookies non essentiels, newsletter</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Légal</Badge>
                    <div>
                      <h4 className="font-semibold text-white">Obligation légale</h4>
                      <p className="text-sm">Conservation des factures, lutte contre la fraude</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">Intérêt</Badge>
                    <div>
                      <h4 className="font-semibold text-white">Intérêt légitime</h4>
                      <p className="text-sm">Amélioration du service, sécurité, statistiques</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Droits des utilisateurs */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 mr-3 text-cyan-400" />
                  Vos droits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit d'accès</h4>
                      <p className="text-sm">Consulter vos données personnelles</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit de rectification</h4>
                      <p className="text-sm">Corriger vos informations</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit d'effacement</h4>
                      <p className="text-sm">Supprimer vos données</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit d'opposition</h4>
                      <p className="text-sm">Vous opposer au traitement</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit à la portabilité</h4>
                      <p className="text-sm">Récupérer vos données</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Droit de limitation</h4>
                      <p className="text-sm">Limiter le traitement</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Exercer vos droits</h4>
                  <p className="text-sm mb-3">
                    Pour exercer vos droits, contactez-nous à dpo@sneakpeak.fr 
                    ou utilisez le formulaire de contact. Nous répondrons dans un délai d'un mois.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter le DPO
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conservation des données */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Database className="w-6 h-6 mr-3 text-yellow-400" />
                  Conservation des données
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Données clients</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Comptes actifs : Conservation illimitée</li>
                      <li>• Comptes inactifs : 3 ans</li>
                      <li>• Données de commande : 10 ans</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Données techniques</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Logs de connexion : 1 an</li>
                      <li>• Cookies : 13 mois maximum</li>
                      <li>• Données analytiques : 2 ans</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-red-400" />
                  Sécurité des données
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Nous mettons en place des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données personnelles contre la perte, l'utilisation abusive, 
                  l'accès non autorisé, la divulgation, l'altération ou la destruction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Mesures techniques</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Chiffrement SSL/TLS</li>
                      <li>• Authentification forte</li>
                      <li>• Sauvegardes sécurisées</li>
                      <li>• Monitoring 24/7</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Mesures organisationnelles</h4>
                    <ul className="space-y-2 ml-4">
                      <li>• Formation du personnel</li>
                      <li>• Accès limité aux données</li>
                      <li>• Audit régulier</li>
                      <li>• Procédures de sécurité</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-green-400" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Pour toute question concernant cette politique de confidentialité ou 
                  le traitement de vos données personnelles, vous pouvez nous contacter :
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
                <div className="mt-6 p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Autorité de contrôle</h4>
                  <p className="text-sm">
                    Vous avez également le droit de déposer une plainte auprès de la CNIL 
                    (Commission Nationale de l'Informatique et des Libertés) si vous estimez 
                    que vos droits ne sont pas respectés.
                  </p>
                  <p className="text-sm mt-2">
                    <strong>CNIL :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-purple-400" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Cette politique de confidentialité peut être modifiée à tout moment. 
                  Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
                </p>
                <p>
                  En cas de modification substantielle, nous vous en informerons par e-mail 
                  ou par un avis sur notre site web.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Dernière mise à jour :</span>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
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