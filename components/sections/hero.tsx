import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Collection Exclusive 2024
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
                Les sneakers qui
                <span className="text-primary block">définissent le style</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md text-pretty">
                Découvrez notre sélection premium de sneakers authentiques. Design ultra moderne, qualité
                exceptionnelle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Découvrir la collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Voir les nouveautés
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Modèles exclusifs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-sm text-muted-foreground">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
              <Image
                src="/air-jordan-1-black-red-sneaker.jpg"
                alt="Air Jordan 1 Retro High OG - Sneaker premium"
                fill
                className="object-cover"
                priority
              />

              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                <Badge variant="destructive">-20%</Badge>
              </div>

              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                <h3 className="font-semibold">Air Jordan 1 Retro</h3>
                <p className="text-sm text-muted-foreground">À partir de 179,99€</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">(4.8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
