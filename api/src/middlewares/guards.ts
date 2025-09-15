import { NextFunction, Response } from "express";

export function requireAuth(req: any, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    next();
}

export function requireAdmin(req: any, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ error: "Auth required" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
}
