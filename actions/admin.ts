"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

type Role = "ADMIN" | "USER";

export const deleteUser = async (userId: string) => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return { error: "Forbidden!" };
    }

    if (session.user.id === userId) {
        return { error: "You cannot delete yourself!" };
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });

        revalidatePath("/dashboard/users");
        await logAudit("ADMIN_DELETE_USER", { targetUserId: userId }, session.user.id);
        return { success: "User deleted!" };
    } catch (error) {
        return { error: "Failed to delete user!" };
    }
};

export const updateUserRole = async (userId: string, role: Role) => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return { error: "Forbidden!" };
    }

    if (session.user.id === userId) {
        return { error: "You cannot change your own role!" };
    }

    try {
        await (prisma.user.update as any)({
            where: { id: userId },
            data: { role },
        });

        revalidatePath("/dashboard/users");
        await logAudit("ADMIN_UPDATE_ROLE", { targetUserId: userId, role }, session.user.id);
        return { success: "Role updated!" };
    } catch (error) {
        return { error: "Failed to update role!" };
    }
};

export const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return { error: "Forbidden!" };
    }

    if (session.user.id === userId) {
        return { error: "You cannot block yourself!" };
    }

    try {
        await (prisma.user.update as any)({
            where: { id: userId },
            data: { isBlocked },
        });

        revalidatePath("/dashboard/users");
        await logAudit("ADMIN_TOGGLE_BLOCK", { targetUserId: userId, isBlocked }, session.user.id);
        return { success: isBlocked ? "User blocked!" : "User unblocked!" };
    } catch (error) {
        return { error: "Failed to update status!" };
    }
};
