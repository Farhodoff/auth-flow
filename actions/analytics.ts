"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getAnalyticsData = async () => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const totalUsers = await prisma.user.count();

    // Simple way to get active subscriptions (users with stripeSubscriptionId)
    const activeSubscriptions = await (prisma.user as any).count({
        where: {
            stripeSubscriptionId: {
                not: null
            }
        }
    });

    // Get users created in the last 7 days for the chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsers = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        select: {
            createdAt: true
        }
    });

    // Group by day for the chart
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse().map(date => {
        const count = newUsers.filter(user =>
            user.createdAt.toISOString().split('T')[0] === date
        ).length;

        return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            total: count
        };
    });

    // Mock revenue for now (or calculate from Stripe if we had Price info stored locally)
    const totalRevenue = activeSubscriptions * 20; // Assuming $20/month

    return {
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        chartData
    };
};

export const getRecentSales = async () => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return [];
    }

    // Fetch recent pro users
    const recentProUsers = await (prisma.user as any).findMany({
        where: {
            stripeSubscriptionId: {
                not: null
            }
        },
        take: 5,
        orderBy: {
            updatedAt: 'desc' // Approximation of when they subscribed if we don't have a separate subscription table
        },
        select: {
            name: true,
            email: true,
            image: true,
            stripePriceId: true // To guess the amount
        }
    });

    return recentProUsers.map((user: any) => ({
        name: user.name || "Unknown",
        email: user.email,
        amount: "+$20.00", // Hardcoded for demo
        image: user.image
    }));
};
