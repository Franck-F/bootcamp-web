import { Role } from "@prisma/client";

/**
 * Middleware DEV : pose un utilisateur fake si DEV_FAKE_USER_ID est défini.
 * Ne PAS activer en prod.
 */
export function devAuth(req: any, _res: any, next: any) {
    const id = Number(process.env.DEV_FAKE_USER_ID);
    if (id) {
        req.user = { id, email: "fake+dev@local", role: "customer" as Role };
    }
    next();
}
