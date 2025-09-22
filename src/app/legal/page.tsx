'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, Building, FileText, Mail, Phone, MapPin, Globe, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8">
              <Scale className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">Informations légales</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Mentions{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Légales
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
            
            {/* Éditeur du site */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Building className="w-6 h-6 mr-3 text-blue-400" />
                  Éditeur du site
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">SneakPeak</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>123 Rue de la Mode, 75001 Paris, France</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>01 23 45 67 89</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>contact@sneakpeak.fr</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span>www.sneakpeak.fr</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Informations légales</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Forme juridique :</strong> Société par actions simplifiée (SAS)</p>
                      <p><strong>Capital social :</strong> 50 000 €</p>
                      <p><strong>SIRET :</strong> 123 456 789 00012</p>
                      <p><strong>RCS :</strong> Paris B 123 456 789</p>
                      <p><strong>TVA :</strong> FR12 123456789</p>
                      <p><strong>Code APE :</strong> 4771Z (Commerce de détail d'habillement)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Directeur de publication */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-green-400" />
                  Directeur de publication
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Le directeur de la publication est le Président de SneakPeak, 
                  responsable du contenu éditorial du site web.
                </p>
                <div className="p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Contact rédactionnel</h4>
                  <p className="text-sm">
                    Pour toute question concernant le contenu du site, 
                    contactez-nous à : redaction@sneakpeak.fr
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-purple-400" />
                  Hébergement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Railway</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Adresse :</strong> Railway Technologies Inc.</p>
                      <p><strong>Site :</strong> railway.app</p>
                      <p><strong>Type :</strong> Hébergement cloud</p>
                      <p><strong>Localisation :</strong> États-Unis (conformité RGPD)</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Base de données</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type :</strong> PostgreSQL</p>
                      <p><strong>Chiffrement :</strong> SSL/TLS</p>
                      <p><strong>Sauvegarde :</strong> Automatique quotidienne</p>
                      <p><strong>Sécurité :</strong> Conformité RGPD</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-orange-400" />
                  Propriété intellectuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Contenu du site</h4>
                  <p>
                    L'ensemble du contenu du site SneakPeak (textes, images, vidéos, logos, 
                    graphismes, etc.) est protégé par le droit d'auteur et appartient à SneakPeak 
                    ou à ses partenaires.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Utilisation autorisée</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Consultation du site à des fins personnelles</li>
                    <li>• Impression de pages pour usage privé</li>
                    <li>• Partage de liens vers le site</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Utilisation interdite</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Reproduction sans autorisation</li>
                    <li>• Modification du contenu</li>
                    <li>• Utilisation commerciale non autorisée</li>
                    <li>• Extraction de données (scraping)</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-600/10 border border-orange-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Marques déposées</h4>
                  <p className="text-sm">
                    Les marques mentionnées sur le site (Nike, Adidas, Jordan, etc.) 
                    sont la propriété de leurs détenteurs respectifs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                  Limitation de responsabilité
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Disponibilité du site</h4>
                  <p>
                    SneakPeak s'efforce d'assurer la disponibilité du site 24h/24 et 7j/7. 
                    Cependant, nous ne pouvons garantir une disponibilité absolue et ne saurions 
                    être tenus responsables des interruptions de service.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Contenu du site</h4>
                  <p>
                    Les informations présentes sur le site sont fournies à titre indicatif. 
                    SneakPeak s'efforce de maintenir ces informations à jour, mais ne peut 
                    garantir leur exactitude, leur exhaustivité ou leur actualité.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Liens externes</h4>
                  <p>
                    Notre site peut contenir des liens vers d'autres sites web. 
                    SneakPeak n'est pas responsable du contenu de ces sites externes 
                    ni des dommages qui pourraient résulter de leur utilisation.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Virus et sécurité</h4>
                  <p>
                    Bien que nous prenions toutes les précautions nécessaires, 
                    nous ne pouvons garantir que le site soit exempt de virus ou d'autres 
                    éléments nuisibles.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-400" />
                  Protection des données
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Le traitement de vos données personnelles est régi par notre 
                  <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                    Politique de Confidentialité
                  </a>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Conformité RGPD</h4>
                    <ul className="space-y-2 ml-4 text-sm">
                      <li>• Consentement explicite</li>
                      <li>• Droit d'accès et de rectification</li>
                      <li>• Droit à l'effacement</li>
                      <li>• Portabilité des données</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Sécurité</h4>
                    <ul className="space-y-2 ml-4 text-sm">
                      <li>• Chiffrement SSL/TLS</li>
                      <li>• Authentification forte</li>
                      <li>• Sauvegardes sécurisées</li>
                      <li>• Monitoring 24/7</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Délégué à la Protection des Données (DPO)</h4>
                  <p className="text-sm">
                    Contact : dpo@sneakpeak.fr | Tél : 01 23 45 67 89
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-yellow-400" />
                  Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                  Consultez notre 
                  <a href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                    Politique des Cookies
                  </a> pour plus d'informations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Cookies essentiels</Badge>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Cookies analytiques</Badge>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Cookies marketing</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Scale className="w-6 h-6 mr-3 text-red-400" />
                  Droit applicable et juridiction
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Droit applicable</h4>
                  <p>
                    Les présentes mentions légales sont soumises au droit français. 
                    Tout litige relatif à l'utilisation du site sera de la compétence 
                    exclusive des tribunaux français.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Résolution des litiges</h4>
                  <p>
                    En cas de litige, nous privilégions la résolution amiable. 
                    Vous pouvez également recourir à la médiation de la consommation 
                    ou saisir la CNIL pour les questions de protection des données.
                  </p>
                </div>

                <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Autorités compétentes</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>CNIL :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
                    <p><strong>Médiateur de la consommation :</strong> 60 rue de la Boétie - 75008 Paris</p>
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
                  Pour toute question concernant ces mentions légales ou le site SneakPeak, 
                  vous pouvez nous contacter :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Par e-mail</h4>
                    <div className="space-y-2">
                      <p>contact@sneakpeak.fr</p>
                      <p>dpo@sneakpeak.fr (protection des données)</p>
                      <p>redaction@sneakpeak.fr (contenu éditorial)</p>
                    </div>
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
                  <FileText className="w-6 h-6 mr-3 text-purple-400" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  SneakPeak se réserve le droit de modifier ces mentions légales à tout moment. 
                  Les modifications entrent en vigueur dès leur publication sur le site.
                </p>
                <p>
                  Il vous appartient de consulter régulièrement cette page pour prendre 
                  connaissance des éventuelles modifications.
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
