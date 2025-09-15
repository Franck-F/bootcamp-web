import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../prisma";

export const COOKIE_NAME = "session_token";

function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

/** Pose req.user si une session valide est trouvée (cookie ou bearer) */
export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        const header = req.get("authorization");
        const bearer = header?.toLowerCase().startsWith("bearer ") ? header.slice(7) : null;
        const token = (req.cookies?.[COOKIE_NAME] as string) || bearer;
        if (!token) return next();

        const tokenHash = sha256(token);
        const session = await prisma.userSession.findUnique({
            where: { tokenHash },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date() || !session.user?.isActive) return next();

        (req as any).user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
        };
    } catch {
        // ignore
    }
    next();
}
