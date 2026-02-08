import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                }) as any;

                if (!user || !user.password) {
                    return null;
                }

                if (!user.emailVerified) {
                    throw new Error("Email not verified!");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

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
            }) as any;

            // Check if user is blocked
            if (existingUser?.isBlocked) {
                return false;
            }

            // 2FA Check
            if (existingUser?.isTwoFactorEnabled) {
                const twoFactorConfirmation = await (prisma as any).twoFactorConfirmation.findUnique({
                    where: { userId: existingUser.id }
                });

                if (!twoFactorConfirmation) return false;

                // Delete confirmation for next sign in
                await (prisma as any).twoFactorConfirmation.delete({
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
                session.user.role = token.role as any;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
