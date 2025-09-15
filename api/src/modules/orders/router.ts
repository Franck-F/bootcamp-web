import { Router } from "express";
import { prisma } from "../../prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { requireAuth, requireAdmin } from "../../middlewares/guards";
import { z } from "zod";

const orders = Router();

orders.get("/", requireAuth, async (req: any, res) => {
    const list = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: { items: { include: { productVariant: { include: { product: true } } } } },
        orderBy: { createdAt: "desc" },
    });
    res.json(list);
});

orders.post("/checkout", requireAuth, async (req: any, res) => {
    const cart = await prisma.shoppingCartItem.findMany({
        where: { userId: req.user.id },
        include: { productVariant: true },
    });
    if (cart.length === 0) return res.status(400).json({ error: "Panier vide" });

    let total = new Decimal(0);
    for (const item of cart) {
        const v = item.productVariant;
        if (!v || !v.price) return res.status(400).json({ error: "Produit invalide" });
        if (v.stockQuantity < item.quantity) return res.status(400).json({ error: `Stock insuffisant pour variante ${v.id}` });
        total = total.plus(v.price.mul(item.quantity));
    }

    const orderNumber = "CMD-" + Date.now();

    const created = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                orderNumber,
                status: "pending",
                paymentStatus: "pending",
                totalAmount: total,
            },
        });

        for (const item of cart) {
            const v = item.productVariant!;
            await tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productVariantId: v.id,
                    quantity: item.quantity,
                    unitPrice: v.price!,
                    totalPrice: v.price!.mul(item.quantity),
                },
            });
            await tx.productVariant.update({
                where: { id: v.id },
                data: { stockQuantity: { decrement: item.quantity } },
            });
        }

        await tx.shoppingCartItem.deleteMany({ where: { userId: req.user.id } });
        return order;
    });

    await prisma.auditLog.create({ data: { userId: req.user.id, action: "ORDER_CREATE", details: { orderId: created.id } } });
    res.status(201).json(created);
});

orders.get("/:id", requireAuth, async (req: any, res) => {
    const id = Number(req.params.id);
    const order = await prisma.order.findFirst({
        where: { id, userId: req.user.id },
        include: { items: { include: { productVariant: { include: { product: true } } } } },
    });
    if (!order) return res.status(404).json({ error: "Commande introuvable" });
    res.json(order);
});

// ---- Paiement mock (confirm + paid)
orders.post("/:id/pay", requireAuth, async (req: any, res) => {
    const id = Number(req.params.id);
    const Body = z.object({ method: z.string().default("card") });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const order = await prisma.order.findFirst({ where: { id, userId: req.user.id } });
    if (!order) return res.status(404).json({ error: "Commande introuvable" });
    if (order.paymentStatus === "paid") return res.json(order);

    const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "confirmed", paymentStatus: "paid", paymentMethod: parsed.data.method },
    });

    await prisma.auditLog.create({ data: { userId: req.user.id, action: "ORDER_PAID", details: { orderId: order.id } } });
    res.json(updated);
});

// ---- Admin: changer le statut d'une commande
orders.patch("/:id/status", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const Body = z.object({ status: z.enum(["pending","confirmed","shipped","delivered","cancelled"]) });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const updated = await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
    res.json(updated);
});

export default orders;
