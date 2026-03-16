import { prisma } from "@/lib/prisma";

// ─── Config ────────────────────────────────────────────────────────────────

/**
 * IP-based sliding window: protects routes from distributed flooding.
 *  - 20 requests / 15 min window
 *  - Soft-blocks the IP until the window expires (no permanent ban)
 */
const IP_CONFIG = {
    maxAttempts: 20,
    windowMs: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Account-based sliding window: protects individual credentials.
 *  - 5 failed attempts / 15 min window
 *  - After maxAttempts, account is locked for LOCK_DURATION_MS
 */
const ACCOUNT_CONFIG = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockDurationMs: 30 * 60 * 1000, // 30-minute lock
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export type RateLimitResult =
    | { success: true }
    | { success: false; reason: "ip_blocked" | "account_locked"; retryAfter: Date };

// ─── Internal helper ────────────────────────────────────────────────────────

async function checkAndIncrement(
    identifier: string,
    maxAttempts: number,
    windowMs: number,
    lockDurationMs?: number,
): Promise<RateLimitResult> {
    const now = new Date();

    // Fetch or create the record
    const existing = await (prisma as any).rateLimit.findUnique({
        where: { identifier },
    });

    // ── Active lock check (account-level only) ──
    if (existing?.lockedUntil && existing.lockedUntil > now) {
        return {
            success: false,
            reason: "account_locked",
            retryAfter: existing.lockedUntil,
        };
    }

    // ── Window expired → reset ──
    if (existing && existing.expiresAt <= now) {
        await (prisma as any).rateLimit.update({
            where: { identifier },
            data: {
                count: 1,
                expiresAt: new Date(now.getTime() + windowMs),
                lockedUntil: null,
            },
        });
        return { success: true };
    }

    // ── Within window ──
    const currentCount = existing ? existing.count : 0;

    if (currentCount >= maxAttempts) {
        // Trigger lock if configured (account-mode)
        if (lockDurationMs && existing) {
            const lockedUntil = new Date(now.getTime() + lockDurationMs);
            await (prisma as any).rateLimit.update({
                where: { identifier },
                data: { lockedUntil },
            });
            return { success: false, reason: "account_locked", retryAfter: lockedUntil };
        }

        // IP-mode: just return blocked with window expiry
        return {
            success: false,
            reason: "ip_blocked",
            retryAfter: existing?.expiresAt ?? new Date(now.getTime() + windowMs),
        };
    }

    // ── Increment ──
    if (existing) {
        await (prisma as any).rateLimit.update({
            where: { identifier },
            data: { count: currentCount + 1 },
        });
    } else {
        await (prisma as any).rateLimit.create({
            data: {
                identifier,
                count: 1,
                expiresAt: new Date(now.getTime() + windowMs),
            },
        });
    }

    return { success: true };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * IP-based rate limit.
 * Use for: /login, /register, /reset (any public route).
 *
 * identifier should be the client's IP address.
 */
export async function ipRateLimit(ip: string): Promise<RateLimitResult> {
    return checkAndIncrement(
        `ip:${ip}`,
        IP_CONFIG.maxAttempts,
        IP_CONFIG.windowMs,
        // No account lock for IPs — they just get blocked for the window
    );
}

/**
 * Account-based rate limit.
 * Use for: /login (after IP check passes).
 *
 * identifier should be the normalized email/username.
 * On too many failures the account is locked for 30 min.
 */
export async function accountRateLimit(email: string): Promise<RateLimitResult> {
    return checkAndIncrement(
        `account:${email.toLowerCase().trim()}`,
        ACCOUNT_CONFIG.maxAttempts,
        ACCOUNT_CONFIG.windowMs,
        ACCOUNT_CONFIG.lockDurationMs,
    );
}

/**
 * Legacy shim — kept for any callers that still import { rateLimit }.
 * Delegates to accountRateLimit.
 * @deprecated Use ipRateLimit / accountRateLimit directly.
 */
export async function rateLimit(
    identifier: string,
): Promise<{ success: boolean; expiresAt?: Date }> {
    const result = await accountRateLimit(identifier);
    if (result.success) return { success: true };
    return { success: false, expiresAt: result.retryAfter };
}
