import React from 'react';
import { Shield, Eye, Lock, Users, Mail, Phone } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Politique de confidentialité
            </h1>
            <p className="text-xl text-gray-600">
              StrideStyle s'engage à protéger votre vie privée et vos données personnelles
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dernière mise à jour : 15 janvier 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">1. Collecte des données</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Nous collectons les informations que vous nous fournissez directement, notamment :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Informations de compte (nom, email, mot de passe)</li>
                <li>Informations de livraison et de facturation</li>
                <li>Historique des commandes et préférences</li>
                <li>Communications avec notre service client</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Utilisation des données</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client</li>
                <li>Améliorer nos services et votre expérience</li>
                <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Partage des données</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Nos partenaires de livraison pour l'expédition de vos commandes</li>
                <li>Les processeurs de paiement pour sécuriser vos transactions</li>
                <li>Les autorités légales si requis par la loi</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Sécurité des données</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Chiffrement SSL pour toutes les transmissions</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance continue de nos systèmes</li>
                <li>Formation régulière de nos équipes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> Consulter les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences 
                de cookies à tout moment via notre bandeau de consentement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Conservation des données</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités 
                pour lesquelles elles ont été collectées, conformément à nos obligations légales.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">8. Contact</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">privacy@stridestyle.fr</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-gray-700">123 Rue de la Mode, 75001 Paris, France</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}