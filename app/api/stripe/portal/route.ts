import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXTAUTH_URL + "/dashboard/settings";

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user || !session?.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            }
        }) as any; // Cast to any to avoid stale type issues

        if (!userSubscription || !userSubscription.stripeCustomerId) {
            return new NextResponse("No subscription found", { status: 400 });
        }

        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: settingsUrl,
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        console.log("[STRIPE_PORTAL_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
