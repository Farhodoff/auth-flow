import { prisma } from "@/lib/prisma";

export const rateLimit = async (identifier: string) => {
    const rateLimit = await (prisma as any).rateLimit.findUnique({
        where: { identifier },
    });

    // Strategy: Allow 5 attempts per 15 minutes
    const MAX_ATTEMPTS = 5;
    const WINDOW_DURATION = 15 * 60 * 1000; // 15 minutes

    if (rateLimit) {
        const now = new Date();

        if (now > rateLimit.expiresAt) {
            // Expired, reset
            await (prisma as any).rateLimit.update({
                where: { identifier },
                data: {
                    count: 1,
                    expiresAt: new Date(now.getTime() + WINDOW_DURATION),
                },
            });
            return { success: true };
        }

        if (rateLimit.count >= MAX_ATTEMPTS) {
            return { success: false, expiresAt: rateLimit.expiresAt };
        }

        // Increment
        await (prisma as any).rateLimit.update({
            where: { identifier },
            data: {
                count: rateLimit.count + 1,
            },
        });

        return { success: true };
    } else {
        // Create new
        await (prisma as any).rateLimit.create({
            data: {
                identifier,
                count: 1,
                expiresAt: new Date(new Date().getTime() + WINDOW_DURATION),
            },
        });

        return { success: true };
    }
};
