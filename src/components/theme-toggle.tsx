'use client'

import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './theme-provider'
import { ClientOnly } from './client-only'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />
    if (theme === 'dark') return <Moon className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
  }

  const getLabel = () => {
    if (theme === 'light') return 'Basculer vers le thème sombre'
    if (theme === 'dark') return 'Basculer vers le thème système'
    return 'Basculer vers le thème clair'
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
        aria-label={getLabel()}
      >
        {getIcon()}
      </Button>
    </ClientOnly>
  )
}
