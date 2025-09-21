'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { ClientOnly } from './client-only'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return
    
    // Récupérer le thème depuis localStorage ou utiliser le thème système
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <ClientOnly
      fallback={
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          disabled
        >
          <Sun className="h-5 w-5" />
        </Button>
      }
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative"
        aria-label={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      >
        <Sun className={`h-5 w-5 transition-all ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
        <Moon className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      </Button>
    </ClientOnly>
  )
}
