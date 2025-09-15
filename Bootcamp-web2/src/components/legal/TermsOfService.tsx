import React from 'react';
import { FileText, ShoppingCart, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conditions générales de vente
            </h1>
            <p className="text-xl text-gray-600">
              Conditions d'utilisation du site StrideStyle
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dernière mise à jour : 15 janvier 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informations légales</h2>
              <p className="text-gray-700 mb-4">
                StrideStyle est une société par actions simplifiée au capital de 100 000 €, 
                immatriculée au RCS de Paris sous le numéro 123 456 789.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Coordonnées :</h3>
                <p className="text-gray-700">
                  Siège social : 123 Rue de la Mode, 75001 Paris, France<br />
                  Email : contact@stridestyle.fr<br />
                  Téléphone : +33 1 23 45 67 89<br />
                  TVA intracommunautaire : FR12345678901
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingCart className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">2. Commandes</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Toute commande passée sur notre site constitue un contrat de vente. 
                Les prix sont indiqués en euros TTC et incluent la TVA applicable.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Les commandes sont confirmées par email</li>
                <li>Nous nous réservons le droit d'annuler toute commande en cas de stock insuffisant</li>
                <li>Les prix peuvent être modifiés à tout moment sans préavis</li>
                <li>Paiement sécurisé par carte bancaire, PayPal, Apple Pay ou Google Pay</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">3. Livraison</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Nous proposons plusieurs options de livraison :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Livraison standard</h4>
                  <p className="text-blue-700 text-sm">3-5 jours ouvrés - 9,99€</p>
                  <p className="text-blue-700 text-sm">Gratuite dès 99€ d'achat</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Livraison express</h4>
                  <p className="text-green-700 text-sm">24-48h - 19,99€</p>
                  <p className="text-green-700 text-sm">Disponible en France métropolitaine</p>
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Les délais de livraison sont donnés à titre indicatif</li>
                <li>La livraison s'effectue à l'adresse indiquée lors de la commande</li>
                <li>Un suivi de commande est envoyé par email</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <RotateCcw className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">4. Retours et remboursements</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Conformément au Code de la consommation, vous disposez d'un délai de 14 jours 
                pour retourner vos articles.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Conditions de retour :</h4>
                <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                  <li>Articles dans leur état d'origine avec étiquettes</li>
                  <li>Emballage d'origine conservé</li>
                  <li>Articles non portés et non lavés</li>
                  <li>Retour à vos frais (sauf défaut de conformité)</li>
                </ul>
              </div>
              <p className="text-gray-700">
                Le remboursement s'effectue dans un délai de 14 jours après réception du retour, 
                sur le même moyen de paiement utilisé pour l'achat.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">5. Responsabilité</h2>
              </div>
              <p className="text-gray-700 mb-4">
                StrideStyle s'engage à fournir des produits conformes aux descriptions. 
                Notre responsabilité est limitée au montant de votre commande.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Garantie légale de conformité de 2 ans</li>
                <li>Garantie contre les vices cachés</li>
                <li>Authenticité garantie de tous nos produits</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                Tous les éléments du site (textes, images, logos, marques) sont protégés par 
                les droits de propriété intellectuelle et appartiennent à StrideStyle ou à ses partenaires.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit applicable</h2>
              <p className="text-gray-700 mb-4">
                Les présentes conditions sont soumises au droit français. 
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Médiation</h2>
              <p className="text-gray-700 mb-4">
                En cas de litige, vous pouvez recourir à la médiation de la consommation. 
                Notre médiateur est la FEVAD (Fédération du e-commerce et de la vente à distance).
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4">Besoin d'aide ?</h3>
              <p className="text-orange-700 mb-4">
                Notre équipe est à votre disposition pour répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-orange-700">support@stridestyle.fr</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-orange-700">+33 1 23 45 67 89</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}