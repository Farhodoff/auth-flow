import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXTAUTH_URL + "/dashboard/settings";

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user || !session?.user.email || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            }
        }) as any;

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: session.user.email!,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Pro Plan",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2900,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
