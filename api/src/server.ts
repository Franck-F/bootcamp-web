// api/src/server.ts
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rgpdRouter from "./modules/rgpd/router";
import session from "express-session";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
    helmet({
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'"], // les tags analytics/marketing seront injectés SEULEMENT après consentement
            },
        },
    })
);

// Exemple de session sécurisée (si tu utilises sessions)
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 2,
        },
    })
);

// Monte le router RGPD
app.use("/api/rgpd", rgpdRouter);

app.listen(process.env.PORT || 3000, () => console.log("API up"));
