import { Resend } from "resend";
import VerificationEmail from "@/emails/verification-email";
import PasswordResetEmail from "@/emails/password-reset-email";
import TwoFactorEmail from "@/emails/two-factor-email";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
        console.log("----------------------------------------");
        console.log("📧 Email (Verification):", email);
        console.log("🔗 Link:", confirmLink);
        console.log("----------------------------------------");
        // return; // Commented out to allow testing logic flow if needed, but normally return
    }

    try {
        await resend.emails.send({
            from: "Auth App <onboarding@resend.dev>",
            to: email,
            subject: "Confirm your email",
            react: VerificationEmail({ token }),
        });
    } catch (error) {
        console.log("Email error:", error);
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
        console.log("----------------------------------------");
        console.log("📧 Email (Password Reset):", email);
        console.log("🔗 Link:", resetLink);
        console.log("----------------------------------------");
    }

    try {
        await resend.emails.send({
            from: "Auth App <onboarding@resend.dev>",
            to: email,
            subject: "Reset your password",
            react: PasswordResetEmail({ token }),
        });
    } catch (error) {
        console.log("Email error:", error);
    }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    if (!process.env.RESEND_API_KEY) {
        console.log("----------------------------------------");
        console.log("📧 Email (2FA):", email);
        console.log("🔢 Token:", token);
        console.log("----------------------------------------");
    }

    try {
        await resend.emails.send({
            from: "Auth App <onboarding@resend.dev>",
            to: email,
            subject: "2FA Code",
            react: TwoFactorEmail({ token }),
        });
    } catch (error) {
        console.log("Email error:", error);
    }
};
