'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReceiptDownloadProps {
  orderId: number
  orderNumber: string
  className?: string
}

export function ReceiptDownload({ orderId, orderNumber, className = '' }: ReceiptDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadReceipt = async () => {
    setIsDownloading(true)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/receipt`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du reçu')
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob()
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `recu-${orderNumber}.pdf`
      
      // Déclencher le téléchargement
      document.body.appendChild(link)
      link.click()
      
      // Nettoyer
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Reçu téléchargé avec succès !')
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement du reçu')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownloadReceipt}
      disabled={isDownloading}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Télécharger le reçu
        </>
      )}
    </Button>
  )
}

// Composant pour afficher le reçu dans une modal
export function ReceiptModal({ orderId, orderNumber, isOpen, onClose }: {
  orderId: number
  orderNumber: string
  isOpen: boolean
  onClose: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const loadReceipt = async () => {
    if (pdfUrl) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/receipt`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du reçu:', error)
      toast.error('Erreur lors du chargement du reçu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `recu-${orderNumber}.pdf`
      link.click()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Reçu de Paiement - {orderNumber}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Fermer
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                <p className="text-gray-600">Chargement du reçu...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0 rounded"
              title={`Reçu ${orderNumber}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Button
                onClick={loadReceipt}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Charger le reçu
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
