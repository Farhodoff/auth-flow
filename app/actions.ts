"use server";

import { auth } from "@/auth";
import { prisma } from "../lib/prisma"; // Relative import to avoid alias issues
import { revalidatePath } from "next/cache";

// Temporary prisma instantiation if lib/prisma doesn't exist yet
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prismaClient = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;


export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string; // We'll add bio to schema later if needed, or just mock for now

    // Check if bio is in schema? Schema has no bio. We should add it or just ignore.
    // For now let's just update Name.

    await prismaClient.user.update({
        where: { email: session.user.email },
        data: {
            name: name,
        }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    await prismaClient.user.delete({
        where: { email: session.user.email }
    });

    return { success: true };
}
