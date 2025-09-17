import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">SneakPeak</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre destination premium pour les sneakers authentiques et les dernières tendances streetwear.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold">Boutique</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/homme" className="text-muted-foreground hover:text-foreground transition-colors">
                  Homme
                </Link>
              </li>
              <li>
                <Link href="/femme" className="text-muted-foreground hover:text-foreground transition-colors">
                  Femme
                </Link>
              </li>
              <li>
                <Link href="/enfant" className="text-muted-foreground hover:text-foreground transition-colors">
                  Enfant
                </Link>
              </li>
              <li>
                <Link href="/nouveautes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link href="/soldes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Soldes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="text-muted-foreground hover:text-foreground transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/retours" className="text-muted-foreground hover:text-foreground transition-colors">
                  Retours
                </Link>
              </li>
              <li>
                <Link href="/guide-tailles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guide des tailles
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-muted-foreground hover:text-foreground transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Confidentialité & RGPD
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 SneakPeak. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Paiement sécurisé</span>
            <div className="flex gap-2">
              <div className="h-6 w-8 bg-muted rounded border flex items-center justify-center text-xs font-bold">
                VISA
              </div>
              <div className="h-6 w-8 bg-muted rounded border flex items-center justify-center text-xs font-bold">
                MC
              </div>
              <div className="h-6 w-8 bg-muted rounded border flex items-center justify-center text-xs font-bold">
                PP
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
