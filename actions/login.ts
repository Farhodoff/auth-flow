"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { AuthError } from "next-auth";
import { logAudit } from "@/lib/audit";

export const login = async (values: any, callbackUrl?: string | null) => {
    const { email, password, code } = values;

    if (!email || !password) {
        return { error: "Email and password are required!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    }) as any;

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials!" };
    }

    if (!existingUser.emailVerified) {
        return { error: "Email not verified!" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await (prisma as any).twoFactorToken.findFirst({
                where: { email: existingUser.email }
            });

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await (prisma as any).twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            });

            const existingConfirmation = await (prisma as any).twoFactorConfirmation.findUnique({
                where: { userId: existingUser.id }
            });

            if (existingConfirmation) {
                await (prisma as any).twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                });
            }

            await (prisma as any).twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                existingUser.email,
                twoFactorToken.token,
            );

            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || "/dashboard",
        });

        await logAudit("USER_LOGIN", { email }, existingUser.id);

        return { success: "Logged in!" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
};
