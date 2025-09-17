"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface GDPRConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface GDPRContextType {
  consent: GDPRConsent
  hasConsented: boolean
  updateConsent: (newConsent: Partial<GDPRConsent>) => void
  acceptAll: () => void
  rejectAll: () => void
  showBanner: boolean
  hideBanner: () => void
}

const defaultConsent: GDPRConsent = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  preferences: false,
}

const GDPRContext = createContext<GDPRContextType | undefined>(undefined)

export function GDPRProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<GDPRConsent>(defaultConsent)
  const [hasConsented, setHasConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem("gdpr-consent")
    if (savedConsent) {
      const parsedConsent = JSON.parse(savedConsent)
      setConsent(parsedConsent)
      setHasConsented(true)
    } else {
      setShowBanner(true)
    }
  }, [])

  const updateConsent = (newConsent: Partial<GDPRConsent>) => {
    const updatedConsent = { ...consent, ...newConsent, necessary: true }
    setConsent(updatedConsent)
    localStorage.setItem("gdpr-consent", JSON.stringify(updatedConsent))
    setHasConsented(true)
    setShowBanner(false)
  }

  const acceptAll = () => {
    const allAccepted: GDPRConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    updateConsent(allAccepted)
  }

  const rejectAll = () => {
    updateConsent(defaultConsent)
  }

  const hideBanner = () => {
    setShowBanner(false)
  }

  return (
    <GDPRContext.Provider
      value={{
        consent,
        hasConsented,
        updateConsent,
        acceptAll,
        rejectAll,
        showBanner,
        hideBanner,
      }}
    >
      {children}
    </GDPRContext.Provider>
  )
}

export function useGDPR() {
  const context = useContext(GDPRContext)
  if (context === undefined) {
    throw new Error("useGDPR must be used within a GDPRProvider")
  }
  return context
}
