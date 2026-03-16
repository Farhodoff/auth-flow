import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, Role } from "@prisma/client";
import type { AdapterUser } from "@auth/core/adapters";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // ── Account-lock check (brute-force protection) ──────────────
                //  This is a secondary guard — the action layer checks first,
                //  but we also check here so direct API calls are protected too.
                const lock = await (prisma as any).rateLimit.findUnique({
                    where: { identifier: `account:${(credentials.email as string).toLowerCase().trim()}` },
                });

                const now = new Date();
                if (lock?.lockedUntil && lock.lockedUntil > now) {
                    // Do NOT reveal lock status — just refuse
                    return null;
                }

                // ── Look up user ─────────────────────────────────────────────
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                // Always hash-compare to avoid timing attacks revealing user existence
                const dummyHash = "$2b$10$dummyhashpaddingtomatchbcrypttime.dummyvalue00";
                const isPasswordValid = user?.password
                    ? await bcrypt.compare(credentials.password as string, user.password)
                    : (await bcrypt.compare(credentials.password as string, dummyHash), false);

                if (!user || !user.password || !isPasswordValid) {
                    return null;
                }

                // ── Additional guards (no descriptive errors — return null) ──
                if (!user.emailVerified) return null;
                if ((user as any).isBlocked) return null;

                return user as unknown as AdapterUser;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without 2FA for now (or handle separately)
            if (account?.provider !== "credentials") return true;

            const existingUser = await prisma.user.findUnique({
                where: { id: user.id }
            });

            // Check if user is blocked
            if (existingUser?.isBlocked) {
                return false;
            }

            if (existingUser?.isTwoFactorEnabled) {
                const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
                    where: { userId: existingUser.id }
                });

                if (!twoFactorConfirmation) return false;

                // Delete confirmation for next sign in
                await prisma.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                // Use cast to any to avoid "Role" import issues if direct import fails
                // The underlying value is compatible
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
