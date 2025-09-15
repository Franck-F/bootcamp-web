import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";
import { requireAuth } from "../../middlewares/guards";

const cart = Router();

cart.get("/", requireAuth, async (req: any, res) => {
    const items = await prisma.shoppingCartItem.findMany({
        where: { userId: req.user.id },
        include: {
            productVariant: {
                include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(items);
});

cart.post("/", requireAuth, async (req: any, res) => {
    const Body = z.object({ productVariantId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const { productVariantId, quantity } = parsed.data;

    const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId } });
    if (!variant || !variant.price) return res.status(404).json({ error: "Variant introuvable" });
    if (variant.stockQuantity < quantity) return res.status(400).json({ error: "Stock insuffisant" });

    const item = await prisma.shoppingCartItem.upsert({
        where: { userId_productVariantId: { userId: req.user.id, productVariantId } },
        update: { quantity: { increment: quantity } },
        create: { userId: req.user.id, productVariantId, quantity },
    });

    res.status(201).json(item);
});

cart.patch("/:variantId", requireAuth, async (req: any, res) => {
    const Body = z.object({ quantity: z.number().int().min(1).max(99) });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const productVariantId = Number(req.params.variantId);
    const { quantity } = parsed.data;

    const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId } });
    if (!variant) return res.status(404).json({ error: "Variant introuvable" });
    if (variant.stockQuantity < quantity) return res.status(400).json({ error: "Stock insuffisant" });

    const item = await prisma.shoppingCartItem.update({
        where: { userId_productVariantId: { userId: req.user.id, productVariantId } },
        data: { quantity },
    });
    res.json(item);
});

cart.delete("/:variantId", requireAuth, async (req: any, res) => {
    const productVariantId = Number(req.params.variantId);
    await prisma.shoppingCartItem.delete({
        where: { userId_productVariantId: { userId: req.user.id, productVariantId } },
    });
    res.status(204).end();
});

cart.delete("/", requireAuth, async (req: any, res) => {
    await prisma.shoppingCartItem.deleteMany({ where: { userId: req.user.id } });
    res.status(204).end();
});

export default cart;
