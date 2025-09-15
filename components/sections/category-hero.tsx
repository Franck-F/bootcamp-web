"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

interface CategoryHeroProps {
  title: string
  description: string
  image: string
  category: string
  isPromo?: boolean
}

export function CategoryHero({ title, description, image, category, isPromo }: CategoryHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center text-white space-y-6 max-w-4xl mx-auto px-4">
        {isPromo && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            Jusqu'à -50%
          </Badge>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-balance">{title}</h1>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">{description}</p>

        <Button
          size="lg"
          className="mt-8"
          onClick={() => {
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          Découvrir la collection
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
