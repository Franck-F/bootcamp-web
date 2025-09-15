import React from 'react';
import { ArrowRight, Users, Heart, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function CategoryShowcase() {
  const categories = [
    {
      id: 'men',
      title: 'Homme',
      subtitle: 'Performance & Style',
      description: 'Des sneakers conçues pour l\'homme moderne qui ne fait aucun compromis entre style et performance.',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      stats: '40+ modèles',
      features: ['Running', 'Basketball', 'Lifestyle', 'Training'],
    },
    {
      id: 'women',
      title: 'Femme',
      subtitle: 'Élégance & Confort',
      description: 'Une collection exclusive qui célèbre la féminité avec des designs innovants et un confort exceptionnel.',
      image: 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      stats: '35+ modèles',
      features: ['Fitness', 'Casual', 'Fashion', 'Wellness'],
    },
    {
      id: 'kids',
      title: 'Enfant',
      subtitle: 'Croissance & Aventure',
      description: 'Des chaussures spécialement conçues pour accompagner les petits explorateurs dans toutes leurs aventures.',
      image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-600',
      stats: '25+ modèles',
      features: ['Croissance', 'Sécurité', 'Durabilité', 'Style'],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pour chaque <span className="text-black">style de vie</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explorez nos collections soigneusement sélectionnées pour répondre aux besoins 
            et aux goûts de chaque membre de votre famille.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className="lg:w-1/2">
                <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                  <div className="aspect-[4/3] bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-5 w-5 text-gray-700" />
                      <span className="font-medium text-gray-900">{category.stats}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 rounded-full mb-4">
                    <category.icon className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-600 font-medium">{category.subtitle}</span>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    Collection {category.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  {category.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient}`} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="group">
                    Explorer la collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    Guide des tailles
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-sm text-gray-500">Marques</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8★</div>
                    <div className="text-sm text-gray-500">Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24h</div>
                    <div className="text-sm text-gray-500">Livraison</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}