import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.get("/db/health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ db: "ok" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ db: "down", error: String(err) });
    }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log(`🚀 API ready on http://localhost:${port}`);
});
