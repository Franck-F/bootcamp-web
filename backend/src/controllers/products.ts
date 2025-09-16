import { prisma } from '../services/prisma';
import { Request, Response } from 'express';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        brand: true,
        category: true,
        images: true,
        variants: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};