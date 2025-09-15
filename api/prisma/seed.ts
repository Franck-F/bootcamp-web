import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hash = await bcrypt.hash("admin123", rounds); // à changer ensuite

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            passwordHash: hash,
            firstName: "Admin",
            lastName: "Local",
            role: "admin"
        }
    });

    console.log("✅ Seed OK: admin@example.com / admin123");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
