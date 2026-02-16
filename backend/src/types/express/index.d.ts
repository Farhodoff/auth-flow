/// <reference types="multer" />
import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
            file?: any;
            files?: any;
        }
    }
}

export { };
