import React, { createContext, useContext, useState, useEffect } from 'react';
import { CookieConsent } from '../types';

interface CookieContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  acceptAll: () => void;
  acceptSelected: (consent: Partial<CookieConsent>) => void;
  rejectAll: () => void;
  showPreferences: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function useCookies() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('stridestyle-cookie-consent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
      } catch (error) {
        console.error('Error parsing saved cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (consentData: CookieConsent) => {
    setConsent(consentData);
    setShowBanner(false);
    localStorage.setItem('stridestyle-cookie-consent', JSON.stringify(consentData));
  };

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
    };
    saveConsent(fullConsent);
  };

  const acceptSelected = (selectedConsent: Partial<CookieConsent>) => {
    const finalConsent: CookieConsent = {
      analytics: selectedConsent.analytics || false,
      marketing: selectedConsent.marketing || false,
      functional: selectedConsent.functional || false,
      timestamp: new Date().toISOString(),
    };
    saveConsent(finalConsent);
  };

  const rejectAll = () => {
    const minimalConsent: CookieConsent = {
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
    };
    saveConsent(minimalConsent);
  };

  const showPreferences = () => {
    setShowBanner(true);
  };

  const value: CookieContextType = {
    consent,
    showBanner,
    acceptAll,
    acceptSelected,
    rejectAll,
    showPreferences,
  };

  return <CookieContext.Provider value={value}>{children}</CookieContext.Provider>;
}