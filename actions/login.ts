"use server";

import { ipRateLimit, accountRateLimit } from "@/lib/rate-limit";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { AuthError } from "next-auth";
import { logAudit } from "@/lib/audit";
import { headers } from "next/headers";

// ─── Generic messages (no user-existence leaks) ──────────────────────────────
//
//  ✅  "Invalid credentials."  ← use for any email/password mismatch
//  ✅  "Authentication failed." ← use for unexpected errors
//  ✅  "Too many requests…"    ← use for rate-limit hits
//
//  ❌  "Email not found!"  — reveals which emails exist
//  ❌  "Wrong password!"   — reveals the email is valid
//  ❌  "Email not verified!" — reveals email exists but unverified
// ─────────────────────────────────────────────────────────────────────────────

const GENERIC_ERROR = "Invalid credentials.";

function formatRetryMessage(retryAfter: Date): string {
    const mins = Math.ceil((retryAfter.getTime() - Date.now()) / 60_000);
    return `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`;
}

export const login = async (values: any, callbackUrl?: string | null) => {
    const { email, password, code } = values;

    if (!email || !password) {
        return { error: GENERIC_ERROR };
    }

    // ── 1. IP-based rate limit ────────────────────────────────────────────────
    const headersList = await headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headersList.get("x-real-ip") ??
        "unknown";

    const ipCheck = await ipRateLimit(ip);
    if (!ipCheck.success) {
        return { error: formatRetryMessage(ipCheck.retryAfter) };
    }

    // ── 2. Account-based rate limit ───────────────────────────────────────────
    const accountCheck = await accountRateLimit(email);
    if (!accountCheck.success) {
        return { error: formatRetryMessage(accountCheck.retryAfter) };
    }

    // ── 3. Verify credentials (constant-time to prevent timing attacks) ───────
    const existingUser = await prisma.user.findUnique({
        where: { email },
    }) as any;

    // Always run bcrypt even when user doesn't exist to prevent timing attacks
    const dummyHash = "$2b$10$dummyhashpaddingtomatchbcrypttime.dummyvalue00000";
    const passwordToCheck = existingUser?.password ?? dummyHash;
    const passwordValid =
        existingUser?.password
            ? await bcrypt.compare(password as string, existingUser.password)
            : (await bcrypt.compare(password as string, dummyHash), false);

    if (!existingUser || !existingUser.email || !passwordValid) {
        return { error: GENERIC_ERROR };
    }

    // NOTE: We deliberately do NOT say "email not verified" — generic message
    // to prevent user enumeration. The user will notice via their inbox.
    if (!existingUser.emailVerified) {
        return { error: GENERIC_ERROR };
    }

    // ── 4. Account block check ────────────────────────────────────────────────
    if (existingUser.isBlocked) {
        // Return generic — don't reveal block reason
        return { error: GENERIC_ERROR };
    }

    // ── 5. Two-factor authentication ─────────────────────────────────────────
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await (prisma as any).twoFactorToken.findFirst({
                where: { email: existingUser.email },
            });

            if (!twoFactorToken) {
                return { error: "Invalid or expired code." };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid or expired code." };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "Invalid or expired code." };
            }

            await (prisma as any).twoFactorToken.delete({
                where: { id: twoFactorToken.id },
            });

            const existingConfirmation = await (prisma as any).twoFactorConfirmation.findUnique({
                where: { userId: existingUser.id },
            });

            if (existingConfirmation) {
                await (prisma as any).twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id },
                });
            }

            await (prisma as any).twoFactorConfirmation.create({
                data: { userId: existingUser.id },
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
            return { twoFactor: true };
        }
    }

    // ── 6. Sign in ────────────────────────────────────────────────────────────
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
                    return { error: GENERIC_ERROR };
                default:
                    return { error: "Authentication failed. Please try again." };
            }
        }
        throw error;
    }
};
