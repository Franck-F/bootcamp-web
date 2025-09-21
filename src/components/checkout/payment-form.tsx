'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react'

interface PaymentData {
  method: 'card' | 'paypal'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

interface PaymentFormProps {
  onNext: (data: { paymentMethod: PaymentData }) => void
  onBack: () => void
}

export function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })

  const [errors, setErrors] = useState<Partial<PaymentData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) return // Max 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/')
      if (formattedValue.length > 5) return // MM/YY
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length > 4) return
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }))
    
    // Clear error when user starts typing
    if (errors[name as keyof PaymentData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {}

    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Le numéro de carte est requis'
      } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres'
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'La date d\'expiration est requise'
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = 'Format invalide (MM/AA)'
      }

      if (!paymentData.cvv) {
        newErrors.cvv = 'Le CVV est requis'
      } else if (paymentData.cvv.length < 3) {
        newErrors.cvv = 'Le CVV doit contenir au moins 3 chiffres'
      }

      if (!paymentData.cardName.trim()) {
        newErrors.cardName = 'Le nom sur la carte est requis'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ paymentMethod: paymentData })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Méthode de paiement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Méthode de paiement */}
            <div>
              <Label>Choisissez votre méthode de paiement</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    id="card"
                    name="method"
                    value="card"
                    checked={paymentData.method === 'card'}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value as 'card' }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium">Carte bancaire</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Visa</Badge>
                    <Badge variant="outline">MC</Badge>
                    <Badge variant="outline">AMEX</Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    id="paypal"
                    name="method"
                    value="paypal"
                    checked={paymentData.method === 'paypal'}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value as 'paypal' }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-gray-600">Paiement sécurisé avec PayPal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de carte bancaire */}
            {paymentData.method === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte *</Label>
                  <div className="mt-1 relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleChange}
                      className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cardName">Nom sur la carte *</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleChange}
                    className={errors.cardName ? 'border-red-500' : ''}
                    placeholder="Jean Dupont"
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                      className={errors.expiryDate ? 'border-red-500' : ''}
                      placeholder="MM/AA"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      className={errors.cvv ? 'border-red-500' : ''}
                      placeholder="123"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sécurité */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Paiement sécurisé</p>
                  <p className="text-xs text-green-700">
                    Vos informations de paiement sont chiffrées et protégées par SSL.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Button>
              <Button type="submit" className="flex items-center space-x-2">
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informations de sécurité */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>SSL sécurisé</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Données protégées</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Paiement 3D Secure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
