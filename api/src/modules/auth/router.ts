import { Router } from "express";
import { prisma } from "../../prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { COOKIE_NAME } from "../../middlewares/auth";

const auth = Router();

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}
function newToken() {
    return crypto.randomBytes(32).toString("base64url");
}

auth.post("/register", async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { email, password, firstName, lastName } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email déjà utilisé" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, passwordHash, firstName, lastName, emailVerified: false, isActive: true },
    });

    // session auto-login
    const token = newToken();
    await prisma.userSession.create({
        data: {
            userId: user.id,
            tokenHash: sha256(token),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 jours
        },
    });

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    await prisma.auditLog.create({ data: { userId: user.id, action: "AUTH_REGISTER" } });
    res.status(201).json({ id: user.id, email: user.email });
});

auth.post("/login", async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const token = newToken();
    await prisma.userSession.create({
        data: {
            userId: user.id,
            tokenHash: sha256(token),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
    });

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    await prisma.auditLog.create({ data: { userId: user.id, action: "AUTH_LOGIN" } });
    res.json({ ok: true });
});

auth.post("/logout", async (req, res) => {
    const token = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (token) {
        await prisma.userSession.deleteMany({ where: { tokenHash: sha256(token) } });
    }
    res.clearCookie(COOKIE_NAME);
    await prisma.auditLog.create({ data: { userId: (req as any).user?.id ?? null, action: "AUTH_LOGOUT" } });
    res.json({ ok: true });
});

auth.get("/me", async (req, res) => {
    const u = (req as any).user;
    if (!u) return res.status(401).json({ error: "Auth required" });
    res.json(u);
});

export default auth;
