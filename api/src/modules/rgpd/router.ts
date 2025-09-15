import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const rgpd = Router();

// --- utils ---
const oneMonthMs = 1000 * 60 * 60 * 24 * 30;
const thirteenMonthsMs = oneMonthMs * 13;

const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    next();
};

const audit = async (req: any, action: string, details?: any) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId: req.user?.id ?? null,
                action,
                details,
                ip: req.ip,
                userAgent: req.get("user-agent") ?? undefined,
            },
        });
    } catch {}
};

// =========================
// CONSENTEMENT COOKIES
// =========================
const ConsentSchema = z.object({
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false),
    personalization: z.boolean().default(false),
    version: z.string().default("v1"),
});

rgpd.get("/consent", async (req, res) => {
    if (req.user?.id) {
        const c = await prisma.consent.findUnique({ where: { userId: req.user.id } });
        return res.json(
            c ?? { analytics: false, marketing: false, personalization: false, version: "v1" }
        );
    }
    const raw = req.cookies?.["consent_v1"];
    return res.json(raw ? JSON.parse(raw) : { analytics: false, marketing: false, personalization: false, version: "v1" });
});

rgpd.put("/consent", async (req, res) => {
    const parsed = ConsentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    res.cookie("consent_v1", JSON.stringify(parsed.data), {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: thirteenMonthsMs, // 13 mois
    });

    const ip = req.ip;
    const ua = req.get("user-agent") ?? "";

    if (req.user?.id) {
        await prisma.consent.upsert({
            where: { userId: req.user.id },
            create: { userId: req.user.id, ip, userAgent: ua, ...parsed.data },
            update: { ip, userAgent: ua, ...parsed.data },
        });
    }

    await audit(req, "CONSENT_UPDATE", parsed.data);
    res.json({ ok: true });
});

rgpd.post("/consent/revoke", async (req, res) => {
    res.clearCookie("consent_v1");
    if (req.user?.id) {
        await prisma.consent.updateMany({
            where: { userId: req.user.id },
            data: { analytics: false, marketing: false, personalization: false },
        });
    }
    await audit(req, "CONSENT_REVOKE");
    res.json({ ok: true });
});

// =========================
// DROITS UTILISATEUR
// =========================
rgpd.get("/me/export", requireAuth, async (req: any, res) => {
    const userId: number = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            consent: true,
            // TODO: ajoutes-y d'autres relations (orders, adresses, etc.) si tu veux
        },
    });
    await prisma.dataRequest.create({ data: { userId, type: "ACCESS" } });
    await audit(req, "DATA_EXPORT");
    res.json({ exportedAt: new Date().toISOString(), user });
});

rgpd.get("/me/portability.csv", requireAuth, async (req: any, res) => {
    const u = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!u) return res.status(404).end();
    const csv = `id,email,firstName,lastName\n${u.id},${u.email},${u.firstName ?? ""},${u.lastName ?? ""}\n`;
    await prisma.dataRequest.create({ data: { userId: u.id, type: "PORTABILITY" } });
    await audit(req, "DATA_PORTABILITY");
    res.setHeader("Content-Type", "text/csv");
    res.attachment("portability.csv").send(csv);
});

rgpd.patch("/me", requireAuth, async (req: any, res) => {
    const Body = z.object({
        email: z.string().email().optional(),
        firstName: z.string().max(100).optional(),
        lastName: z.string().max(100).optional(),
        password: z.string().min(8).optional(),
    });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const data: any = { ...parsed.data };
    if (data.password) {
        data.passwordHash = await bcrypt.hash(data.password, 12);
        delete data.password;
    }

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    await prisma.dataRequest.create({ data: { userId: user.id, type: "RECTIFY", payload: parsed.data } });
    await audit(req, "DATA_RECTIFY", parsed.data);
    res.json({ ok: true });
});

rgpd.delete("/me", requireAuth, async (req: any, res) => {
    const userId: number = req.user.id;

    // ⚠️ À adapter si conservation/anonymisation légale de factures est requise
    await prisma.user.delete({ where: { id: userId } });

    await prisma.dataRequest.create({ data: { userId, type: "ERASURE" } });
    await audit(req, "DATA_ERASURE");
    res.status(204).end();
});

rgpd.post("/me/restrict", requireAuth, async (req: any, res) => {
    await prisma.dataRequest.create({ data: { userId: req.user.id, type: "RESTRICT", payload: req.body ?? {} } });
    await audit(req, "DATA_RESTRICT");
    res.json({ ok: true });
});

rgpd.post("/me/opt-out-marketing", requireAuth, async (req: any, res) => {
    // Exemple: si plus tard tu ajoutes user.marketingOptIn
    // await prisma.user.update({ where: { id: req.user.id }, data: { marketingOptIn: false } });
    await prisma.dataRequest.create({ data: { userId: req.user.id, type: "OBJECT_MARKET" } });
    await audit(req, "DATA_OBJECT_MARKETING");
    res.json({ ok: true });
});

// DPO — Contact
rgpd.post("/dpo/contact", async (req, res) => {
    const Body = z.object({
        email: z.string().email(),
        subject: z.string().min(3).max(200),
        message: z.string().min(10).max(5000),
    });
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    // TODO: envoi e-mail / ticketing DPO
    await audit(req, "DPO_CONTACT", { email: parsed.data.email, subject: parsed.data.subject });
    res.json({ ok: true });
});

export default rgpd;
