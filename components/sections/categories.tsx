import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: "homme",
    name: "Homme",
    description: "Style urbain et performance",
    image: "/air-jordan-1-side-view.jpg",
    count: "200+ modèles",
    href: "/homme",
  },
  {
    id: "femme",
    name: "Femme",
    description: "Élégance et confort",
    image: "/nike-dunk-low-white-black-panda-sneaker.jpg",
    count: "150+ modèles",
    href: "/femme",
  },
  {
    id: "enfant",
    name: "Enfant",
    description: "Couleurs et durabilité",
    image: "/yeezy-boost-350-v2-cream-white-sneaker.jpg",
    count: "80+ modèles",
    href: "/enfant",
  },
]

export function Categories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Explorez par catégorie</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Trouvez la paire parfaite selon votre style et vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Link href={category.href}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={`Sneakers ${category.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-75">{category.count}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Explorer
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
