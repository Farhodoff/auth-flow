import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const logAudit = async (action: string, details?: any, userId?: string) => {
    try {
        let id = userId;

        if (!id) {
            const session = await auth();
            id = session?.user?.id;
        }

        if (!id) return;

        await (prisma as any).auditLog.create({
            data: {
                action,
                userId: id,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
};
