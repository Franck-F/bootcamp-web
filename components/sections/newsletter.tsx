import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Gift, Truck, Shield } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Newsletter */}
          <div className="text-center space-y-6 mb-16">
            <Badge variant="outline" className="w-fit mx-auto">
              <Mail className="h-3 w-3 mr-1" />
              Newsletter
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Restez à la pointe de la mode</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Recevez en avant-première nos nouveautés, offres exclusives et conseils style directement dans votre boîte
              mail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Votre adresse email" className="flex-1" />
              <Button>S'abonner</Button>
            </div>

            <p className="text-xs text-muted-foreground">
              En vous inscrivant, vous acceptez notre politique de confidentialité. Désabonnement possible à tout
              moment.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Livraison gratuite</h3>
              <p className="text-sm text-muted-foreground">Livraison offerte dès 100€ d'achat partout en France</p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Authenticité garantie</h3>
              <p className="text-sm text-muted-foreground">Toutes nos sneakers sont 100% authentiques et vérifiées</p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Retour 30 jours</h3>
              <p className="text-sm text-muted-foreground">Échange et remboursement gratuits sous 30 jours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
