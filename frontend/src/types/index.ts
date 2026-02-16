export interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    role: 'USER' | 'ADMIN';
    emailVerified: Date | null;
    isTwoFactorEnabled: boolean;
    createdAt: string;
    updatedAt?: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripePriceId?: string | null;
    stripeCurrentPeriodEnd?: string | null;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}
