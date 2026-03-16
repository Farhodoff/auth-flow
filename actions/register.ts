"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ipRateLimit } from "@/lib/rate-limit";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { headers } from "next/headers";

export const register = async (values: {
    name: string;
    email: string;
    password: string;
}) => {
    const { name, email, password } = values;

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }

    // ── IP-based rate limit ───────────────────────────────────────────────────
    //
    //  Registration is even more expensive than login (writes to DB, sends email)
    //  so we use a tighter IP limit here.
    //
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

    // ── Validate password strength (basic) ───────────────────────────────────
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    // ── Check for existing user ───────────────────────────────────────────────
    //
    //  SECURITY NOTE: We return a generic message so we don't confirm
    //  whether an email is already registered (prevents user enumeration).
    //
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        //  Return same message as "success" — attacker cannot distinguish
        return {
            success:
                "If this email is not yet registered, you will receive a verification link shortly.",
        };
    }

    // ── Hash & create user ────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12); // cost factor 12

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // ── Send verification email ───────────────────────────────────────────────
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
        success:
            "If this email is not yet registered, you will receive a verification link shortly.",
    };
};
