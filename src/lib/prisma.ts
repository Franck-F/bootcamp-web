import { PrismaClient } from '@prisma/client'

// Pour Edge Runtime, nous devons créer une nouvelle instance à chaque fois
// car Edge Runtime ne supporte pas les variables globales persistantes
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})
