import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // 1) Admin
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const adminPwd = await bcrypt.hash("admin123", rounds);

    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            passwordHash: adminPwd,
            firstName: "Admin",
            lastName: "Local",
            role: Role.admin,
            emailVerified: true,
        },
    });

    // 2) Permissions (optionnel)
    const permManage = await prisma.permission.upsert({
        where: { name: "manage_products" },
        update: {},
        create: { name: "manage_products", description: "CRUD produits & variantes" },
    });
    await prisma.rolePermission.upsert({
        where: { role_permissionId: { role: Role.admin, permissionId: permManage.id } },
        update: {},
        create: { role: Role.admin, permissionId: permManage.id },
    });

    // 3) Marque / Catégorie / Produit / Variante / Image
    const nike = await prisma.brand.upsert({
        where: { name: "Nike" },
        update: {},
        create: { name: "Nike", logoUrl: "https://example.com/nike.png" },
    });

    const parentCat = await prisma.category.upsert({
        where: { slug: "sneakers" },
        update: {},
        create: { name: "Sneakers", slug: "sneakers" },
    });

    const subCat = await prisma.category.upsert({
        where: { slug: "running" },
        update: {},
        create: { name: "Running", slug: "running", parentId: parentCat.id },
    });

    const product = await prisma.product.create({
        data: {
            name: "Nike Air Zoom",
            brandId: nike.id,
            categoryId: subCat.id,
            description: "Chaussure de running légère",
            basePrice: 129.99,
            sku: "AIRZOOM-BASE",
            isActive: true,
            scrapedFrom: "seed",
            variants: {
                create: [
                    {
                        size: 42.5,
                        color: "Black",
                        stockQuantity: 12,
                        price: 139.99,
                        sku: "AIRZOOM-42_5-BLK",
                    },
                    {
                        size: 43.0,
                        color: "White",
                        stockQuantity: 5,
                        price: 139.99,
                        sku: "AIRZOOM-43-WHT",
                    },
                ],
            },
            images: {
                create: [
                    {
                        imageUrl: "https://example.com/airzoom-1.jpg",
                        altText: "Vue latérale",
                        isPrimary: true,
                        displayOrder: 1,
                    },
                    {
                        imageUrl: "https://example.com/airzoom-2.jpg",
                        altText: "Vue semelle",
                        displayOrder: 2,
                    },
                ],
            },
        },
        include: { variants: true },
    });

    // 4) Panier de test
    await prisma.shoppingCartItem.create({
        data: {
            userId: admin.id,
            productVariantId: product.variants[0].id,
            quantity: 2,
        },
    });

    // 5) Commande de test
    await prisma.order.create({
        data: {
            userId: admin.id,
            orderNumber: "ORD-0001",
            status: OrderStatus.confirmed,
            totalAmount: 279.98,
            shippingAddress: "1 rue de la Paix, 75002 Paris",
            billingAddress: "1 rue de la Paix, 75002 Paris",
            paymentMethod: "card",
            paymentStatus: PaymentStatus.paid,
            items: {
                create: [
                    {
                        productVariantId: product.variants[0].id,
                        quantity: 2,
                        unitPrice: 139.99,
                        totalPrice: 279.98,
                    },
                ],
            },
        },
    });

    console.log("✅ Seed terminé (admin + catalog + panier + commande).");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
