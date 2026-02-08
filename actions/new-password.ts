"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const newPassword = async (password: string, token: string | null) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    const existingToken = await (prisma as any).passwordResetToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email }
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await (prisma.user.update as any)({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    });

    await (prisma as any).passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Password updated!" };
};
