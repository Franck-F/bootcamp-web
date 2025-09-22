'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ruler, 
  Footprints, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Download,
  Mail,
  Phone,
  HelpCircle
} from 'lucide-react'

export default function SizeGuidePage() {
  const [selectedBrand, setSelectedBrand] = useState('nike')
  const [selectedGender, setSelectedGender] = useState('homme')

  const brands = [
    { id: 'nike', name: 'Nike', logo: '✓' },
    { id: 'adidas', name: 'Adidas', logo: '✓' },
    { id: 'jordan', name: 'Jordan', logo: '✓' },
    { id: 'converse', name: 'Converse', logo: '✓' },
    { id: 'vans', name: 'Vans', logo: '✓' },
    { id: 'puma', name: 'Puma', logo: '✓' }
  ]

  const sizeCharts = {
    nike: {
      homme: [
        { eu: '40', us: '7', uk: '6', cm: '25.0' },
        { eu: '40.5', us: '7.5', uk: '6.5', cm: '25.5' },
        { eu: '41', us: '8', uk: '7', cm: '26.0' },
        { eu: '42', us: '8.5', uk: '7.5', cm: '26.5' },
        { eu: '42.5', us: '9', uk: '8', cm: '27.0' },
        { eu: '43', us: '9.5', uk: '8.5', cm: '27.5' },
        { eu: '44', us: '10', uk: '9', cm: '28.0' },
        { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
        { eu: '45', us: '11', uk: '10', cm: '29.0' },
        { eu: '46', us: '12', uk: '11', cm: '30.0' }
      ],
      femme: [
        { eu: '36', us: '5', uk: '3.5', cm: '22.5' },
        { eu: '36.5', us: '5.5', uk: '4', cm: '23.0' },
        { eu: '37', us: '6', uk: '4.5', cm: '23.5' },
        { eu: '37.5', us: '6.5', uk: '5', cm: '24.0' },
        { eu: '38', us: '7', uk: '5.5', cm: '24.5' },
        { eu: '38.5', us: '7.5', uk: '6', cm: '25.0' },
        { eu: '39', us: '8', uk: '6.5', cm: '25.5' },
        { eu: '40', us: '8.5', uk: '7', cm: '26.0' },
        { eu: '40.5', us: '9', uk: '7.5', cm: '26.5' },
        { eu: '41', us: '9.5', uk: '8', cm: '27.0' }
      ]
    },
    adidas: {
      homme: [
        { eu: '40', us: '7', uk: '6', cm: '25.0' },
        { eu: '40.5', us: '7.5', uk: '6.5', cm: '25.5' },
        { eu: '41', us: '8', uk: '7', cm: '26.0' },
        { eu: '42', us: '8.5', uk: '7.5', cm: '26.5' },
        { eu: '42.5', us: '9', uk: '8', cm: '27.0' },
        { eu: '43', us: '9.5', uk: '8.5', cm: '27.5' },
        { eu: '44', us: '10', uk: '9', cm: '28.0' },
        { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
        { eu: '45', us: '11', uk: '10', cm: '29.0' },
        { eu: '46', us: '12', uk: '11', cm: '30.0' }
      ],
      femme: [
        { eu: '36', us: '5', uk: '3.5', cm: '22.5' },
        { eu: '36.5', us: '5.5', uk: '4', cm: '23.0' },
        { eu: '37', us: '6', uk: '4.5', cm: '23.5' },
        { eu: '37.5', us: '6.5', uk: '5', cm: '24.0' },
        { eu: '38', us: '7', uk: '5.5', cm: '24.5' },
        { eu: '38.5', us: '7.5', uk: '6', cm: '25.0' },
        { eu: '39', us: '8', uk: '6.5', cm: '25.5' },
        { eu: '40', us: '8.5', uk: '7', cm: '26.0' },
        { eu: '40.5', us: '9', uk: '7.5', cm: '26.5' },
        { eu: '41', us: '9.5', uk: '8', cm: '27.0' }
      ]
    }
  }

  const currentChart = sizeCharts[selectedBrand as keyof typeof sizeCharts]?.[selectedGender as keyof typeof sizeCharts.nike] || sizeCharts.nike.homme

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full px-6 py-3 mb-8">
              <Ruler className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Guide des tailles</span>
              <Footprints className="w-4 h-4 text-blue-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Guide des{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tailles
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Trouvez la taille parfaite pour vos sneakers avec notre guide détaillé.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            
            {/* Instructions de mesure */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Ruler className="w-6 h-6 mr-3 text-cyan-400" />
                  Comment mesurer votre pied
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-cyan-400 font-bold text-xl">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Placez votre pied</h4>
                    <p className="text-sm">
                      Placez votre pied sur une feuille de papier, talon contre un mur.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-400 font-bold text-xl">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Tracez le contour</h4>
                    <p className="text-sm">
                      Tracez le contour de votre pied avec un crayon bien droit.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-400 font-bold text-xl">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Mesurez</h4>
                    <p className="text-sm">
                      Mesurez la distance entre le talon et l'orteil le plus long.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-cyan-400" />
                    Conseils importants
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Mesurez les deux pieds et prenez la plus grande mesure</li>
                    <li>• Portez des chaussettes similaires à celles que vous porterez avec vos sneakers</li>
                    <li>• Mesurez en fin de journée quand vos pieds sont légèrement gonflés</li>
                    <li>• Ajoutez 0.5 à 1 cm pour le confort</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Sélecteurs de marque et genre */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Choisissez votre marque et genre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Marques */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Marque</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {brands.map((brand) => (
                      <Button
                        key={brand.id}
                        variant={selectedBrand === brand.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`${
                          selectedBrand === brand.id
                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {brand.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Genre</h4>
                  <div className="flex space-x-4">
                    <Button
                      variant={selectedGender === 'homme' ? 'default' : 'outline'}
                      onClick={() => setSelectedGender('homme')}
                      className={`${
                        selectedGender === 'homme'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Homme
                    </Button>
                    <Button
                      variant={selectedGender === 'femme' ? 'default' : 'outline'}
                      onClick={() => setSelectedGender('femme')}
                      className={`${
                        selectedGender === 'femme'
                          ? 'bg-pink-600 hover:bg-pink-700 text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Femme
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des tailles */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Footprints className="w-6 h-6 mr-3 text-blue-400" />
                  Tableau des tailles - {brands.find(b => b.id === selectedBrand)?.name} {selectedGender}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-white font-semibold">EU</th>
                        <th className="text-left py-3 px-4 text-white font-semibold">US</th>
                        <th className="text-left py-3 px-4 text-white font-semibold">UK</th>
                        <th className="text-left py-3 px-4 text-white font-semibold">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChart.map((size, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-700/30">
                          <td className="py-3 px-4 text-white font-semibold">{size.eu}</td>
                          <td className="py-3 px-4 text-gray-300">{size.us}</td>
                          <td className="py-3 px-4 text-gray-300">{size.uk}</td>
                          <td className="py-3 px-4 text-gray-300">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Conseils par marque */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Info className="w-6 h-6 mr-3 text-orange-400" />
                  Conseils par marque
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Nike & Jordan</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Taille généralement conforme</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Air Max : prendre sa taille habituelle</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Dunk : peut être un peu serré</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Adidas</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Ultraboost : prendre une demi-taille au-dessus</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Stan Smith : taille normale</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Yeezy : prendre une demi-taille au-dessus</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Converse</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Chuck Taylor : prendre une taille en dessous</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>One Star : taille normale</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>All Star : prendre une demi-taille en dessous</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Vans</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Old Skool : taille normale</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Sk8-Hi : peut être un peu large</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Authentic : prendre une demi-taille en dessous</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avertissements */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-yellow-400" />
                  Points importants à retenir
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Variations possibles</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span>Les tailles peuvent varier selon les modèles</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span>Certains matériaux s'étirent avec le temps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span>Les chaussures de sport sont souvent plus larges</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Conseils d'achat</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Lisez les avis clients sur la taille</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Consultez notre service client</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Profitez de notre politique de retour</span>
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
                  <HelpCircle className="w-6 h-6 mr-3 text-blue-400" />
                  Besoin d'aide pour choisir ?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Notre équipe d'experts est là pour vous aider à trouver la taille parfaite. 
                  N'hésitez pas à nous contacter pour des conseils personnalisés.
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
