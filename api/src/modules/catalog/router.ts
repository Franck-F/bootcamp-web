import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";

const catalog = Router();

catalog.get("/products", async (req, res) => {
    const Q = z.object({
        q: z.string().optional(),
        brandId: z.coerce.number().int().optional(),
        categoryId: z.coerce.number().int().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        offset: z.coerce.number().int().min(0).default(0),
    });
    const parsed = Q.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { q, brandId, categoryId, limit, offset } = parsed.data;

    const where: any = { isActive: true };
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: { where: { isPrimary: true }, take: 1 },
                variants: { take: 1 },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        }),
        prisma.product.count({ where }),
    ]);

    res.json({ items, total, limit, offset });
});

catalog.get("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const p = await prisma.product.findFirst({
        where: { id, isActive: true },
        include: {
            images: { orderBy: { displayOrder: "asc" } },
            variants: true,
            brand: true,
            category: true,
        },
    });
    if (!p) return res.status(404).json({ error: "Produit introuvable" });
    res.json(p);
});

catalog.get("/brands", async (_req, res) => {
    const list = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    res.json(list);
});

catalog.get("/categories", async (_req, res) => {
    const list = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { children: true },
    });
    res.json(list);
});


export default catalog;
