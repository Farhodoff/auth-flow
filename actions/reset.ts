"use server";

import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ipRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const reset = async (email: string) => {
    if (!email) {
        // Generic — don't say "email required" either (minor info)
        return { error: "If that email is registered, you will receive a reset link." };
    }

    // ── IP-based rate limit ───────────────────────────────────────────────────
    const headersList = await headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headersList.get("x-real-ip") ??
        "unknown";

    const ipCheck = await ipRateLimit(ip);
    if (!ipCheck.success) {
        const mins = Math.ceil((ipCheck.retryAfter.getTime() - Date.now()) / 60_000);
        return {
            error: `Too many requests. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`,
        };
    }

    // ── Look up user ──────────────────────────────────────────────────────────
    //
    //  IMPORTANT SECURITY NOTE:
    //  We always return the SAME success message regardless of whether the email
    //  exists in the database. This prevents user-enumeration attacks where an
    //  attacker could discover which emails are registered by observing different
    //  response messages.
    //
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        // Only actually send the email when the user exists
        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
    }

    // Same message for both branches ↓
    return {
        success: "If that email is registered, you will receive a reset link shortly.",
    };
};
