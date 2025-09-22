'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqItems: FAQItem[] = [
    // Commandes
    {
      id: 'order-1',
      question: 'Comment passer une commande ?',
      answer: 'Pour passer une commande, ajoutez les articles à votre panier, puis procédez au checkout. Vous devrez fournir vos informations de livraison et de paiement. Une confirmation vous sera envoyée par e-mail.',
      category: 'commandes'
    },
    {
      id: 'order-2',
      question: 'Puis-je modifier ma commande ?',
      answer: 'Vous pouvez modifier votre commande tant qu\'elle n\'a pas été expédiée. Connectez-vous à votre espace client ou contactez notre service client au 01 23 45 67 89.',
      category: 'commandes'
    },
    {
      id: 'order-3',
      question: 'Comment annuler une commande ?',
      answer: 'Vous pouvez annuler votre commande dans les 24h suivant la commande. Au-delà, contactez notre service client qui vous aidera selon l\'état de votre commande.',
      category: 'commandes'
    },
    // Paiement
    {
      id: 'payment-1',
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Apple Pay et Google Pay. Tous les paiements sont sécurisés par cryptage SSL.',
      category: 'paiement'
    },
    {
      id: 'payment-2',
      question: 'Mes informations de paiement sont-elles sécurisées ?',
      answer: 'Oui, toutes vos informations de paiement sont chiffrées et sécurisées. Nous utilisons les dernières technologies de sécurité et ne stockons aucune information bancaire sur nos serveurs.',
      category: 'paiement'
    },
    {
      id: 'payment-3',
      question: 'Quand serai-je débité ?',
      answer: 'Le débit s\'effectue au moment de la validation de votre commande. En cas d\'annulation, le remboursement sera effectué dans les 48h.',
      category: 'paiement'
    },
    // Livraison
    {
      id: 'shipping-1',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Livraison standard : 3-5 jours ouvrés. Livraison express : 24-48h. Livraison gratuite dès 50€ d\'achat en France métropolitaine.',
      category: 'livraison'
    },
    {
      id: 'shipping-2',
      question: 'Livrez-vous en Corse et DOM-TOM ?',
      answer: 'Oui, nous livrons en Corse et DOM-TOM avec des délais de 5-7 jours et des frais supplémentaires de 15€.',
      category: 'livraison'
    },
    {
      id: 'shipping-3',
      question: 'Comment suivre ma commande ?',
      answer: 'Vous recevrez un numéro de suivi par e-mail. Vous pouvez également suivre votre commande dans votre espace client ou sur le site du transporteur.',
      category: 'livraison'
    },
    // Retours
    {
      id: 'return-1',
      question: 'Quel est le délai pour retourner un article ?',
      answer: 'Vous disposez de 14 jours à compter de la réception pour retourner un article. Les articles doivent être en parfait état avec l\'emballage d\'origine.',
      category: 'retours'
    },
    {
      id: 'return-2',
      question: 'Les retours sont-ils gratuits ?',
      answer: 'Les retours sont gratuits en cas d\'erreur de notre part, d\'article défectueux ou de taille incorrecte. Sinon, les frais de retour sont de 4,90€.',
      category: 'retours'
    },
    {
      id: 'return-3',
      question: 'Comment effectuer un retour ?',
      answer: 'Connectez-vous à votre espace client, sélectionnez la commande et demandez un retour. Vous recevrez une étiquette de retour par e-mail.',
      category: 'retours'
    },
    // Produits
    {
      id: 'product-1',
      question: 'Vos sneakers sont-elles authentiques ?',
      answer: 'Oui, toutes nos sneakers sont 100% authentiques. Nous travaillons directement avec les marques et leurs distributeurs officiels.',
      category: 'produits'
    },
    {
      id: 'product-2',
      question: 'Proposez-vous des tailles spéciales ?',
      answer: 'Nous proposons des tailles du 36 au 47. Pour les tailles spéciales ou les demandes particulières, contactez notre service client.',
      category: 'produits'
    },
    {
      id: 'product-3',
      question: 'Comment choisir la bonne taille ?',
      answer: 'Consultez notre guide des tailles disponible sur chaque page produit. En cas de doute, notre service client peut vous conseiller.',
      category: 'produits'
    },
    // Compte
    {
      id: 'account-1',
      question: 'Comment créer un compte ?',
      answer: 'Cliquez sur "Inscription" en haut de la page, remplissez le formulaire avec vos informations et validez votre e-mail.',
      category: 'compte'
    },
    {
      id: 'account-2',
      question: 'J\'ai oublié mon mot de passe',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un e-mail avec un lien pour réinitialiser votre mot de passe.',
      category: 'compte'
    },
    {
      id: 'account-3',
      question: 'Comment modifier mes informations ?',
      answer: 'Connectez-vous à votre espace client et allez dans "Mon profil" pour modifier vos informations personnelles.',
      category: 'compte'
    }
  ]

  const categories = [
    { id: 'all', label: 'Toutes les questions', icon: HelpCircle },
    { id: 'commandes', label: 'Commandes', icon: Package },
    { id: 'paiement', label: 'Paiement', icon: CreditCard },
    { id: 'livraison', label: 'Livraison', icon: Truck },
    { id: 'retours', label: 'Retours', icon: RotateCcw },
    { id: 'produits', label: 'Produits', icon: Shield },
    { id: 'compte', label: 'Compte', icon: MessageSquare }
  ]

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-3 mb-8">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-semibold text-white">Questions fréquentes</span>
              <MessageSquare className="w-4 h-4 text-yellow-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              FAQ{' '}
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                SneakPeak
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Trouvez rapidement les réponses à vos questions les plus courantes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            
            {/* Recherche et filtres */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Barre de recherche */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher une question..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Filtres par catégorie */}
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center space-x-2 ${
                            selectedCategory === category.id
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{category.label}</span>
                        </Button>
                      )
                    })}
                  </div>

                  {/* Résultats */}
                  <div className="text-center">
                    <p className="text-gray-400">
                      {filteredItems.length} question{filteredItems.length > 1 ? 's' : ''} trouvée{filteredItems.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions et réponses */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const isOpen = openItems.includes(item.id)
                return (
                  <Card key={item.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4">
                          {item.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-700 pt-4">
                            <p className="text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Aucun résultat */}
            {filteredItems.length === 0 && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucune question trouvée
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Essayez de modifier vos critères de recherche ou contactez notre service client.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-blue-400" />
                  Vous ne trouvez pas votre réponse ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Notre équipe de service client est là pour vous aider. 
                  Contactez-nous et nous vous répondrons dans les plus brefs délais.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">contact@sneakpeak.fr</span>
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
                <div className="pt-4">
                  <Button 
                    onClick={() => window.location.href = '/contact'}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Nous contacter
                  </Button>
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
