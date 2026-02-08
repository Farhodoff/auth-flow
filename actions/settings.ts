"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export const updateSettings = async (values: any) => {
    const session = await auth();

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    await (prisma.user.update as any)({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    await logAudit("USER_SETTINGS_UPDATE", values, dbUser.id);

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");

    return { success: "Settings Updated!" };
};
