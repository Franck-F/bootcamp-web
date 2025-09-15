/**
 * Admin router
 * -------------------------
 * - Toutes les routes ici sont protégées par requireAdmin (middleware).
 * - Fournit des endpoints d’aide au back-office : marques, catégories, produits, variantes, images, commandes.
 *
 * Stack:
 *  - Express Router
 *  - Prisma (ORM)
 *  - Zod (validation des entrées)
 */

import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";
import { requireAdmin } from "../../middlewares/guards";

const admin = Router();

/**
 * Applique le guard admin à TOUTES les routes ci-dessous.
 * - Si l’utilisateur n’est pas admin, on renvoie une 403 (implémentée dans requireAdmin).
 */
admin.use(requireAdmin);

/* ============================================================================
 * AIDE CATALOG (listes pour filtres front)
 * ==========================================================================*/

/**
 * GET /admin/brands
 * Renvoie la liste des marques triées par nom (asc).
 */
admin.get("/brands", async (_req, res) => {
    const list = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    res.json(list);
});

/**
 * GET /admin/categories
 * Renvoie la liste des catégories triées par nom (asc) avec leurs enfants.
 * - suppose un modèle auto-référentiel `Category` avec relation `children`.
 */
admin.get("/categories", async (_req, res) => {
    const list = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { children: true },
    });
    res.json(list);
});

/* ============================================================================
 * PRODUITS
 * ==========================================================================*/

/**
 * Schéma de création de produit.
 * - `brandId` et `categoryId` sont optionnels pour permettre la création progressive.
 * - `basePrice` est coercé en number (z.coerce) pour accepter des strings numériques.
 */
const ProductCreate = z.object({
    name: z.string().min(2),
    brandId: z.number().int().optional(),
    categoryId: z.number().int().optional(),
    description: z.string().optional(),
    basePrice: z.coerce.number().positive().optional(),
    sku: z.string().max(50).optional(),
    isActive: z.boolean().default(true),
});

/**
 * Schéma de mise à jour de produit (tous les champs deviennent optionnels).
 */
const ProductUpdate = ProductCreate.partial();

/**
 * GET /admin/products
 * Liste paginée + filtrée des produits.
 * Query params acceptés :
 *  - q?: string (recherche partielle sur le nom, case-insensitive)
 *  - brandId?: number
 *  - categoryId?: number
 *  - active?: "all" | "only" | "inactive"
 *  - limit?: 1..100 (default 20)
 *  - offset?: >=0 (default 0)
 */
admin.get("/products", async (req, res) => {
    const Q = z.object({
        q: z.string().optional(),
        brandId: z.coerce.number().int().optional(),
        categoryId: z.coerce.number().int().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        offset: z.coerce.number().int().min(0).default(0),
        active: z.enum(["all", "only", "inactive"]).default("all"),
    });

    const parsed = Q.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const { q, brandId, categoryId, limit, offset, active } = parsed.data;

    // Construction dynamique des filtres Prisma
    const where: any = {};
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (active === "only") where.isActive = true;
    if (active === "inactive") where.isActive = false;

    // Récupère en parallèle la page d’items + le total
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
            take: limit,
            skip: offset,
        }),
        prisma.product.count({ where }),
    ]);

    res.json({ items, total, limit, offset });
});

/**
 * GET /admin/products/:id
 * Détail d’un produit par id, avec images triées, variantes, marque, catégorie.
 */
admin.get("/products/:id", async (req, res) => {
    const id = Number(req.params.id);

    const p = await prisma.product.findUnique({
        where: { id },
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

/**
 * POST /admin/products
 * Crée un produit à partir du body validé.
 */
admin.post("/products", async (req, res) => {
    const parsed = ProductCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const product = await prisma.product.create({ data: parsed.data });
    res.status(201).json(product);
});

/**
 * PATCH /admin/products/:id
 * Met à jour un produit partiellement (body validé par ProductUpdate).
 */
admin.patch("/products/:id", async (req, res) => {
    const id = Number(req.params.id);

    const parsed = ProductUpdate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await prisma.product.update({
        where: { id },
        data: parsed.data,
    });

    res.json(updated);
});

/**
 * DELETE /admin/products/:id
 * Supprime un produit.
 * ⚠️ Les cascades (variants/images) doivent être définies côté schéma Prisma
 *     (onDelete: Cascade) pour que la suppression soit propre.
 */
admin.delete("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
});

/* ============================================================================
 * VARIANTES
 * ==========================================================================*/

/**
 * Schéma de création de variante.
 * - `size` coercé en number pour accepter des strings "42.5"
 * - `stockQuantity` min 0 (par défaut 0)
 * - `price` requis et positif
 */
const VariantCreate = z.object({
    size: z.coerce.number().optional(), // ex. 42.5
    color: z.string().max(50).optional(),
    stockQuantity: z.number().int().min(0).default(0),
    price: z.coerce.number().positive(),
    sku: z.string().max(50).optional(),
});

/**
 * POST /admin/products/:id/variants
 * Crée une variante pour un produit donné.
 */
admin.post("/products/:id/variants", async (req, res) => {
    const id = Number(req.params.id);

    const parsed = VariantCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const v = await prisma.productVariant.create({
        data: { productId: id, ...parsed.data },
    });

    res.status(201).json(v);
});

/**
 * PATCH /admin/variants/:variantId
 * Mise à jour partielle d’une variante.
 */
const VariantUpdate = VariantCreate.partial();

admin.patch("/variants/:variantId", async (req, res) => {
    const variantId = Number(req.params.variantId);

    const parsed = VariantUpdate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const v = await prisma.productVariant.update({
        where: { id: variantId },
        data: parsed.data,
    });

    res.json(v);
});

/**
 * DELETE /admin/variants/:variantId
 * Supprime une variante par id.
 */
admin.delete("/variants/:variantId", async (req, res) => {
    const variantId = Number(req.params.variantId);
    await prisma.productVariant.delete({ where: { id: variantId } });
    res.status(204).end();
});

/* ============================================================================
 * IMAGES
 * ==========================================================================*/

/**
 * Schéma de création d’image produit.
 * - `imageUrl` doit être une URL valide
 * - `isPrimary` optionnel ; si true, on remet toutes les autres images du produit en `false`
 */
const ImageCreate = z.object({
    imageUrl: z.string().url(),
    altText: z.string().max(255).optional(),
    isPrimary: z.boolean().optional(), // si true, on met les autres à false
});

/**
 * POST /admin/products/:id/images
 * Ajoute une image à un produit. Si `isPrimary` est true, on réinitialise la primary.
 * `displayOrder` est positionné sur le count actuel (append en fin).
 */
admin.post("/products/:id/images", async (req, res) => {
    const id = Number(req.params.id);

    const parsed = ImageCreate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    if (parsed.data.isPrimary) {
        await prisma.productImage.updateMany({
            where: { productId: id },
            data: { isPrimary: false },
        });
    }

    const count = await prisma.productImage.count({ where: { productId: id } });

    const img = await prisma.productImage.create({
        data: { productId: id, ...parsed.data, displayOrder: count },
    });

    res.status(201).json(img);
});

/**
 * POST /admin/images/:imageId/primary
 * Définit une image comme principale pour son produit :
 * - Met toutes les autres à `false`
 * - Met cette image à `true`
 * - Utilise une transaction pour garantir la cohérence.
 */
admin.post("/images/:imageId/primary", async (req, res) => {
    const imageId = Number(req.params.imageId);

    const img = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!img) return res.status(404).json({ error: "Image introuvable" });

    await prisma.$transaction([
        prisma.productImage.updateMany({
            where: { productId: img.productId },
            data: { isPrimary: false },
        }),
        prisma.productImage.update({
            where: { id: imageId },
            data: { isPrimary: true },
        }),
    ]);

    res.json({ ok: true });
});

/**
 * DELETE /admin/images/:imageId
 * Supprime une image par id.
 */
admin.delete("/images/:imageId", async (req, res) => {
    const imageId = Number(req.params.imageId);
    await prisma.productImage.delete({ where: { id: imageId } });
    res.status(204).end();
});

/* ============================================================================
 * COMMANDES (vue Admin)
 * ==========================================================================*/

/**
 * GET /admin/orders
 * Liste paginée des commandes, filtrable par statut.
 * Query:
 *  - status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
 *  - limit?: 1..100 (default 20)
 *  - offset?: >=0 (default 0)
 */
admin.get("/orders", async (req, res) => {
    const Q = z.object({
        status: z
            .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
            .optional(),
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
            include: {
                user: true,
                items: { include: { productVariant: { include: { product: true } } } },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        }),
        prisma.order.count({ where }),
    ]);

    res.json({ items, total, limit, offset });
});

/**
 * PATCH /admin/orders/:id/status
 * Met à jour le statut d’une commande.
 * Body:
 *  - { status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" }
 */
admin.patch("/orders/:id/status", async (req, res) => {
    const id = Number(req.params.id);

    const Body = z.object({
        status: z.enum([
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
        ]),
    });

    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await prisma.order.update({
        where: { id },
        data: { status: parsed.data.status },
    });

    res.json(updated);
});

export default admin;
