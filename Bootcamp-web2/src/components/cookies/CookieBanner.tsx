import React, { useState } from 'react';
import { Cookie, Settings, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useCookies } from '../../contexts/CookieContext';

export function CookieBanner() {
  const { showBanner, acceptAll, acceptSelected, rejectAll } = useCookies();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: true, // Always required
    analytics: false,
    marketing: false,
  });

  if (!showBanner) return null;

  const handleAcceptSelected = () => {
    acceptSelected(preferences);
    setShowPreferences(false);
  };

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-orange-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Icon & Content */}
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="h-8 w-8 text-orange-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nous respectons votre vie privée
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur StrideStyle, 
                  personnaliser le contenu et analyser notre trafic. Vous pouvez choisir quels 
                  cookies accepter en cliquant sur "Personnaliser" ou accepter tous les cookies.
                </p>
                <button
                  onClick={() => window.open('/legal/privacy', '_blank')}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium underline mt-1"
                >
                  En savoir plus sur notre politique de confidentialité
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                variant="ghost"
                onClick={rejectAll}
                className="text-gray-600 hover:bg-gray-100"
              >
                Refuser tout
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Personnaliser
              </Button>
              
              <Button onClick={acceptAll}>
                <Check className="h-4 w-4 mr-2" />
                Accepter tout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <Modal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        title="Préférences des cookies"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Choisissez les types de cookies que vous souhaitez autoriser. Ces paramètres 
            n'affecteront que ce navigateur et cet appareil.
          </p>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {/* Functional - Always required */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies fonctionnels (Obligatoires)
                </h4>
                <p className="text-sm text-gray-600">
                  Ces cookies sont essentiels au bon fonctionnement du site. Ils permettent 
                  la navigation, l'authentification et l'accès aux zones sécurisées.
                </p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies d'analyse
                </h4>
                <p className="text-sm text-gray-600">
                  Ces cookies nous aident à comprendre comment les visiteurs interagissent 
                  avec notre site en collectant des informations de manière anonyme.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.analytics ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md mx-1"></div>
                </button>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies marketing
                </h4>
                <p className="text-sm text-gray-600">
                  Ces cookies sont utilisés pour personnaliser les publicités et mesurer 
                  l'efficacité de nos campagnes marketing.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    preferences.marketing ? 'bg-orange-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md mx-1"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowPreferences(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleAcceptSelected} className="flex-1">
              Sauvegarder mes préférences
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}