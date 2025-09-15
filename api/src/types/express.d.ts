import { Role } from "@prisma/client";

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            role: Role;
        }
        interface Request {
            user?: User;
        }
    }
}
export {};
