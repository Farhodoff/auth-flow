import { DefaultSession } from "next-auth";
import { User as PrismaUser, Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            role: Role;
        } & DefaultSession["user"];
    }

    interface User extends PrismaUser {
        role: Role;
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser extends PrismaUser {
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role;
    }
}
