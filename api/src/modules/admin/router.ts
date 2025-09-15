import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";
import { requireAdmin } from "../../middlewares/guards";

const admin = Router();

// applique le guard admin à toutes les routes de ce router
admin.use(requireAdmin);

// ---------- Aide catalog (pour le front filtres) ----------
admin.get("/brands", async (_req, res) => {
    const list = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    res.json(list);
});

admin.get("/categories", async (_req, res) => {
    const list = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { children: true },
    });
    res.json(list);
});

// ---------- Produits ----------
const ProductCreate = z.object({
    name: z.string().min(2),
    brandId: z.number().int().optional(),
    categoryId: z.number().int().optional(),
    description: z.string().optional(),
    basePrice: z.coerce.number().positive().optional(),
    sku: z.string().max(50).optional(),
    isActive: z.boolean().default(true),
});

const ProductUpdate = ProductCreate.partial();

admin.get("/products", async (req, res) => {
    const Q = z.object({
        q: z.string().optional(),
        brandId: z.coerce.number().int().optional(),
        categoryId: z.coerce.number().int().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        offset: z.coerce.number().int().min(0).default(0),
        active: z.enum(["all","only","inactive"]).default("all"),
    });
    const parsed = Q.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { q, brandId, categoryId, limit, offset, active } = parsed.data;

    const where: any = {};
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (active === "only") where.isActive = true;
    if (active === "inactive") where.isActive = false;

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: { orderBy: { displayOrder: "asc" } },
                variants: true,
                brand: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
            take: limit, skip: offset,
        }),
        prisma.product.count({ where }),
    ]);

    res.json({ items, total, limit, offset });
});

admin.get("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const p = await prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { displayOrder: "asc" } }, variants: true, brand: true, category: true },
    });
    if (!p) return res.status(404).json({ error: "Produit introuvable" });
    res.json(p);
});

admin.post("/products", async (req, res) => {
    const parsed = ProductCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const data = parsed.data;

    const product = await prisma.product.create({ data });
    res.status(201).json(product);
});

admin.patch("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const parsed = ProductUpdate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const updated = await prisma.product.update({ where: { id }, data: parsed.data });
    res.json(updated);
});

admin.delete("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } }); // variants/images sont en cascade
    res.status(204).end();
});

// ---------- Variantes ----------
const VariantCreate = z.object({
    size: z.coerce.number().optional(), // ex 42.5
    color: z.string().max(50).optional(),
    stockQuantity: z.number().int().min(0).default(0),
    price: z.coerce.number().positive(),
    sku: z.string().max(50).optional(),
});

admin.post("/products/:id/variants", async (req, res) => {
    const id = Number(req.params.id);
    const parsed = VariantCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const v = await prisma.productVariant.create({
        data: { productId: id, ...parsed.data },
    });
    res.status(201).json(v);
});

const VariantUpdate = VariantCreate.partial();
admin.patch("/variants/:variantId", async (req, res) => {
    const variantId = Number(req.params.variantId);
    const parsed = VariantUpdate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const v = await prisma.productVariant.update({ where: { id: variantId }, data: parsed.data });
    res.json(v);
});

admin.delete("/variants/:variantId", async (req, res) => {
    const variantId = Number(req.params.variantId);
    await prisma.productVariant.delete({ where: { id: variantId } });
    res.status(204).end();
});

// ---------- Images ----------
const ImageCreate = z.object({
    imageUrl: z.string().url(),
    altText: z.string().max(255).optional(),
    isPrimary: z.boolean().optional(), // si true, on met les autres à false
});

admin.post("/products/:id/images", async (req, res) => {
    const id = Number(req.params.id);
    const parsed = ImageCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    if (parsed.data.isPrimary) {
        await prisma.productImage.updateMany({ where: { productId: id }, data: { isPrimary: false } });
    }
    const count = await prisma.productImage.count({ where: { productId: id } });
    const img = await prisma.productImage.create({
        data: { productId: id, ...parsed.data, displayOrder: count },
    });
    res.status(201).json(img);
});

admin.post("/images/:imageId/primary", async (req, res) => {
    const imageId = Number(req.params.imageId);
    const img = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!img) return res.status(404).json({ error: "Image introuvable" });

    await prisma.$transaction([
        prisma.productImage.updateMany({ where: { productId: img.productId }, data: { isPrimary: false } }),
        prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
    ]);

    res.json({ ok: true });
});

admin.delete("/images/:imageId", async (req, res) => {
    const imageId = Number(req.params.imageId);
    await prisma.productImage.delete({ where: { id: imageId } });
    res.status(204).end();
});

// ---------- Commandes (vue Admin) ----------
admin.get("/orders", async (req, res) => {
    const Q = z.object({
        status: z.enum(["pending","confirmed","shipped","delivered","cancelled"]).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        offset: z.coerce.number().int().min(0).default(0),
    });
    const parsed = Q.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { status, limit, offset } = parsed.data;

    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: { user: true, items: { include: { productVariant: { include: { product: true } } } } },
            orderBy: { createdAt: "desc" },
            take: limit, skip: offset,
        }),
        prisma.order.count({ where }),
    ]);

    res.json({ items, total, limit, offset });
});

admin.patch("/orders/:id/status", async (req, res) => {
    const id = Number(req.params.id);
    const Body = z.object({ status: z.enum(["pending","confirmed","shipped","delivered","cancelled"]) });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
    res.json(updated);
});

export default admin;
