'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Headphones
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' })
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              <Headphones className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">Service client</span>
              <MessageSquare className="w-4 h-4 text-green-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Nous{' '}
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Contacter
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Notre équipe est là pour vous accompagner et répondre à toutes vos questions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Informations de contact */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Contact principal */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-blue-400" />
                    Contact principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">E-mail</p>
                      <p className="text-sm">contact@sneakpeak.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">Téléphone</p>
                      <p className="text-sm">01 23 45 67 89</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">Horaires</p>
                      <p className="text-sm">Lun-Ven : 9h-18h</p>
                      <p className="text-sm">Sam : 10h-16h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adresse */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-green-400" />
                    Notre adresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-2">SneakPeak</p>
                  <p>123 Rue de la Mode</p>
                  <p>75001 Paris, France</p>
                  <div className="mt-4 p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-400">
                      <strong>Boutique physique :</strong> Ouverte du mardi au samedi, 10h-19h
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Types de contact */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3 text-purple-400" />
                    Services spécialisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Service client</span>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">contact@sneakpeak.fr</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Support technique</span>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/30">support@sneakpeak.fr</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Partenariat</span>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">partenariat@sneakpeak.fr</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Presse</span>
                    <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">presse@sneakpeak.fr</Badge>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <Send className="w-6 h-6 mr-3 text-blue-400" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Type de demande */}
                    <div>
                      <Label htmlFor="type" className="text-white font-semibold">Type de demande</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="general">Question générale</option>
                        <option value="order">Commande</option>
                        <option value="return">Retour/Échange</option>
                        <option value="technical">Support technique</option>
                        <option value="partnership">Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    {/* Nom et Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white font-semibold">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-2 bg-gray-900/50 border-gray-600 text-white focus:border-blue-500"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white font-semibold">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-2 bg-gray-900/50 border-gray-600 text-white focus:border-blue-500"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    {/* Sujet */}
                    <div>
                      <Label htmlFor="subject" className="text-white font-semibold">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-2 bg-gray-900/50 border-gray-600 text-white focus:border-blue-500"
                        placeholder="Objet de votre message"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-white font-semibold">Message *</Label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </div>

                    {/* Bouton d'envoi */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>

                    {/* Statut d'envoi */}
                    {submitStatus === 'success' && (
                      <div className="flex items-center space-x-2 p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-green-400 font-semibold">
                          Message envoyé avec succès ! Nous vous répondrons dans les 24h.
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="flex items-center space-x-2 p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-red-400 font-semibold">
                          Erreur lors de l'envoi. Veuillez réessayer.
                        </p>
                      </div>
                    )}

                  </form>
                </CardContent>
              </Card>

              {/* FAQ rapide */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-orange-400" />
                    Questions fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Délai de réponse</h4>
                    <p className="text-sm">Nous répondons généralement dans les 24h en semaine.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Urgences</h4>
                    <p className="text-sm">Pour les urgences, appelez-nous directement au 01 23 45 67 89.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Suivi de commande</h4>
                    <p className="text-sm">Consultez votre espace client ou contactez-nous avec votre numéro de commande.</p>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
