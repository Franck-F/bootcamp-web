'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        toast.success('Compte créé avec succès !')
        router.push('/auth/signin')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la création du compte')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
      {/* Left Section - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md mx-auto">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="logo-container w-9 h-9 ">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            </Link>
            <h1 className="text-3xl font-black text-white mb-2">
              SneakPeak
            </h1>
            <p className="text-gray-400 text-lg">
              Votre destination premium pour les sneakers.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <Button 
              variant="outline" 
              className="w-full h-12 bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500 rounded-xl font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500 rounded-xl font-medium"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">Or</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300 font-medium">Nom complet</Label>
              <div className="mt-2 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50 rounded-xl"
                  placeholder="Entrez votre nom complet"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50 rounded-xl"
                  placeholder="Entrez votre email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 font-medium">Mot de passe</Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50 rounded-xl"
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirmer le mot de passe</Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-red-500/50 focus:border-red-500/50 rounded-xl"
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
                J'accepte les <Link href="/terms" className="font-bold text-red-400 hover:text-red-300 underline">Conditions</Link> & <Link href="/privacy-policy" className="font-bold text-red-400 hover:text-red-300 underline">Confidentialité</Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link href="/auth/signin" className="font-bold text-red-400 hover:text-red-300">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Sneaker Image */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-black/40">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
          </div>
        </div>

        {/* Sneaker Image */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/fashion-shoes-sneakers.png"
            alt="Sneakers Premium"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </div>
  )
}