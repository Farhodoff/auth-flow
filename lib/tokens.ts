import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    // Expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await (prisma as any).verificationToken.findFirst({
        where: { email }
    });

    if (existingToken) {
        await (prisma as any).verificationToken.delete({
            where: {
                id: (existingToken as any).id,
            },
        });
    }

    const verificationToken = await (prisma as any).verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await (prisma as any).passwordResetToken.findFirst({
        where: { email }
    });

    if (existingToken) {
        await (prisma as any).passwordResetToken.delete({
            where: { id: (existingToken as any).id }
        });
    }

    const passwordResetToken = await (prisma as any).passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return passwordResetToken;
}

export const generateTwoFactorToken = async (email: string) => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    // Expires in 5 minutes
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await (prisma as any).twoFactorToken.findFirst({
        where: { email }
    });

    if (existingToken) {
        await (prisma as any).twoFactorToken.delete({
            where: { id: (existingToken as any).id }
        });
    }

    const twoFactorToken = await (prisma as any).twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;
}
