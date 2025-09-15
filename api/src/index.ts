import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { prisma } from "./prisma";

import { authMiddleware } from "./middlewares/auth";
import { errorHandler } from "./middlewares/error";

import authRouter from "./modules/auth/router";
import rgpdRouter from "./modules/rgpd/router";
import catalogRouter from "./modules/catalog/router";
import cartRouter from "./modules/cart/router";
import ordersRouter from "./modules/orders/router";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
    helmet({
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        contentSecurityPolicy: { useDefaults: true, directives: { "script-src": ["'self'"] } },
    })
);
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

// Health
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.get("/db/health", async (_req, res) => {
    try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true }); }
    catch (e: any) { res.status(500).json({ ok: false, error: String(e?.message || e) }); }
});

// Auth d'abord (pose req.user)
app.use(authMiddleware);
app.use("/api/auth", authRouter);

// Business routes
app.use("/api/catalog", catalogRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);

// RGPD
app.use("/api/rgpd", rgpdRouter);

// Error handler (last)
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`API up on :${PORT}`));
