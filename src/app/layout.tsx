import type { Metadata } from 'next'
import { Inter, Poppins, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { CookieConsent } from '@/components/cookie-consent'
import { ThemeScript } from '@/components/theme-script'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'SneakPeak',
  description: 'Boutique en ligne de sneakers avec gestion de stock avancée',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  keywords: 'sneakers, chaussures, e-commerce, mode',
  authors: [{ name: 'Sneakers Store' }],
  openGraph: {
    title: 'Sneakers Store',
    description: 'Boutique en ligne de sneakers avec gestion de stock avancée',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${poppins.variable} ${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}
