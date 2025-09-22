'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Scale, CreditCard, Truck, RotateCcw, Shield, AlertTriangle, Mail, Phone } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-3 mb-8">
              <Scale className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-semibold text-white">Conditions générales</span>
              <FileText className="w-4 h-4 text-red-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Conditions{' '}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Générales
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
                  <FileText className="w-6 h-6 mr-3 text-orange-400" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Les présentes conditions générales de vente régissent les relations contractuelles 
                  entre SneakPeak et ses clients. Elles s'appliquent à toutes les commandes passées 
                  sur notre site web.
                </p>
                <p>
                  En passant commande, vous acceptez sans réserve les présentes conditions générales. 
                  Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser nos services.
                </p>
              </CardContent>
            </Card>

            {/* Informations légales */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Scale className="w-6 h-6 mr-3 text-blue-400" />
                  Informations légales
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">SneakPeak</h4>
                    <p>123 Rue de la Mode</p>
                    <p>75001 Paris, France</p>
                    <p>SIRET: 123 456 789 00012</p>
                    <p>TVA: FR12 123456789</p>
                    <p>RCS Paris B 123 456 789</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Contact</h4>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>contact@sneakpeak.fr</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>01 23 45 67 89</span>
                    </div>
                    <p className="mt-2">Site web : www.sneakpeak.fr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Produits et prix */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-green-400" />
                  Produits et prix
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Description des produits</h4>
                  <p>
                    SneakPeak propose une sélection de sneakers authentiques et de qualité. 
                    Tous nos produits sont décrits avec précision sur notre site web, 
                    incluant les caractéristiques, dimensions et matériaux.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Prix</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Les prix sont indiqués en euros TTC</li>
                    <li>• Les prix incluent la TVA</li>
                    <li>• Les frais de port sont calculés selon le mode de livraison</li>
                    <li>• SneakPeak se réserve le droit de modifier ses prix à tout moment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Disponibilité</h4>
                  <p>
                    Les produits sont proposés dans la limite des stocks disponibles. 
                    En cas d'indisponibilité, nous vous en informerons dans les plus brefs délais 
                    et vous proposerons une alternative ou un remboursement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-purple-400" />
                  Commandes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Processus de commande</h4>
                  <ol className="space-y-2 ml-4 list-decimal">
                    <li>Sélection des produits et ajout au panier</li>
                    <li>Vérification du panier et des quantités</li>
                    <li>Saisie des informations de livraison et de facturation</li>
                    <li>Choix du mode de paiement</li>
                    <li>Validation de la commande</li>
                    <li>Confirmation par e-mail</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Confirmation</h4>
                  <p>
                    Toute commande vaut acceptation des présentes conditions générales. 
                    Une confirmation de commande sera envoyée par e-mail avec le récapitulatif 
                    de votre commande et le numéro de suivi.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Annulation</h4>
                  <p>
                    Vous pouvez annuler votre commande avant son expédition en nous contactant 
                    par e-mail ou téléphone. En cas d'annulation, le remboursement sera effectué 
                    dans les 48h.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-blue-400" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Modes de paiement acceptés</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Carte bancaire</Badge>
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">PayPal</Badge>
                    <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30">Apple Pay</Badge>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Google Pay</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Sécurité</h4>
                  <p>
                    Tous les paiements sont sécurisés par cryptage SSL. Aucune information 
                    bancaire n'est stockée sur nos serveurs. Les transactions sont traitées 
                    par nos partenaires de confiance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Facturation</h4>
                  <p>
                    Une facture sera envoyée par e-mail après validation du paiement. 
                    Les factures sont conservées conformément à la réglementation en vigueur.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Livraison */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-green-400" />
                  Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Zones de livraison</h4>
                  <p>
                    Nous livrons en France métropolitaine, Corse et DOM-TOM. 
                    Les frais de port varient selon la destination et le mode de livraison choisi.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Délais de livraison</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Livraison standard : 3-5 jours ouvrés</li>
                    <li>• Livraison express : 24-48h</li>
                    <li>• Livraison gratuite dès 50€ d'achat</li>
                    <li>• Suivi de commande en temps réel</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Réception</h4>
                  <p>
                    En cas d'absence, le colis sera déposé en point relais ou retourné à l'expéditeur. 
                    Vous serez informé par SMS ou e-mail des modalités de récupération.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Retours et échanges */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <RotateCcw className="w-6 h-6 mr-3 text-purple-400" />
                  Retours et échanges
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Droit de rétractation</h4>
                  <p>
                    Conformément à la réglementation, vous disposez d'un délai de 14 jours 
                    à compter de la réception de votre commande pour exercer votre droit de rétractation.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Conditions de retour</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Produits non portés et en parfait état</li>
                    <li>• Emballage d'origine conservé</li>
                    <li>• Étiquettes et accessoires inclus</li>
                    <li>• Demande de retour via votre compte client</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Remboursement</h4>
                  <p>
                    Le remboursement sera effectué dans les 14 jours suivant la réception 
                    du retour. Les frais de retour sont à votre charge, sauf en cas de produit défectueux.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-400" />
                  Garanties
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Garantie légale</h4>
                  <p>
                    Tous nos produits bénéficient de la garantie légale de conformité de 2 ans 
                    et de la garantie des vices cachés. Ces garanties s'ajoutent aux garanties 
                    constructeur le cas échéant.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Authenticité</h4>
                  <p>
                    SneakPeak garantit l'authenticité de tous ses produits. En cas de doute, 
                    nous fournissons les certificats d'authenticité et les justificatifs d'origine.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Service client</h4>
                  <p>
                    Notre service client est disponible du lundi au vendredi de 9h à 18h 
                    pour vous accompagner dans vos démarches de garantie et de retour.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsabilités */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                  Responsabilités
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Responsabilité de SneakPeak</h4>
                  <p>
                    SneakPeak s'engage à livrer des produits conformes à la commande. 
                    Notre responsabilité est limitée au montant de la commande en cas de dommage.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Responsabilité du client</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• Vérification de la commande à réception</li>
                    <li>• Signalement des anomalies dans les 48h</li>
                    <li>• Respect des conditions de retour</li>
                    <li>• Utilisation conforme des produits</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Force majeure</h4>
                  <p>
                    SneakPeak ne saurait être tenu responsable en cas de force majeure 
                    ou d'événements indépendants de sa volonté affectant l'exécution de la commande.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Données personnelles */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-400" />
                  Données personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Le traitement de vos données personnelles est régi par notre 
                  <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                    Politique de Confidentialité
                  </a>.
                </p>
                <p>
                  En passant commande, vous acceptez le traitement de vos données 
                  dans le cadre de l'exécution de la commande et de la relation commerciale.
                </p>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Scale className="w-6 h-6 mr-3 text-red-400" />
                  Droit applicable
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Les présentes conditions générales sont soumises au droit français. 
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
                <p>
                  Avant tout recours judiciaire, nous privilégions la résolution amiable 
                  des différends. Vous pouvez nous contacter pour toute réclamation.
                </p>
                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Médiation</h4>
                  <p className="text-sm">
                    En cas de litige, vous pouvez recourir à la médiation de la consommation 
                    conformément aux dispositions du Code de la consommation.
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
                  SneakPeak se réserve le droit de modifier les présentes conditions générales 
                  à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
                </p>
                <p>
                  Les conditions applicables sont celles en vigueur au moment de la commande.
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