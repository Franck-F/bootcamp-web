import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { GDPRProvider } from "@/lib/gdpr-context"
import { CookieBanner } from "@/components/gdpr/cookie-banner"
import { Header } from "@/components/layout/header"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "SneakPeak - Boutique de Sneakers Premium",
  description: "Découvrez notre collection exclusive de sneakers haut de gamme. Mode sombre, design ultra moderne.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <GDPRProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Header />
                    {children}
                    <CookieBanner />
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </GDPRProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
