import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { prisma } from "./prisma";

import rgpdRouter from "./modules/rgpd/router";
import { devAuth } from "./middlewares/devAuth"; // DEV only

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
    helmet({
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'"], // inject GA/Meta UNIQUEMENT après consentement (front)
            },
        },
    })
);
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

// Health endpoints (utiles pour Makefile)
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.get("/db/health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    } catch (e: any) {
        res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
});

// DEV: pose req.user si variable set
app.use(devAuth);

// Routes RGPD
app.use("/api/rgpd", rgpdRouter);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`API up on :${PORT}`));
