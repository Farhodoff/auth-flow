import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any, // Cast to any to avoid version mismatch error
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create checkout session
router.post('/checkout', authenticateToken, async (req: Request, res: Response) => {
    // const authReq = req as AuthRequest; // Removed
    try {
        const { priceId } = req.body;
        const userId = req.user!.userId;
        const userEmail = req.user!.email;

        // Get user to check for existing customer ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let customerId = user.stripeCustomerId;

        // Create customer if not exists
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    userId,
                },
            });
            customerId = customer.id;

            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customerId },
            });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${FRONTEND_URL}/dashboard?success=true`,
            cancel_url: `${FRONTEND_URL}/pricing?canceled=true`,
            metadata: {
                userId,
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Create portal session
router.post('/portal', authenticateToken, async (req: Request, res: Response) => {
    // const authReq = req as AuthRequest; // Removed
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user?.stripeCustomerId) {
            res.status(400).json({ error: 'No subscription found' });
            return;
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${FRONTEND_URL}/dashboard`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe portal error:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
});

// Webhook handler
router.post('/webhook', /* raw body middleware needed here */ async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Note: Request body needs to be raw buffer for signature verification
        // This requires specific express configuration for this route
        event = stripe.webhooks.constructEvent(req.body, sig!, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
        case 'customer.subscription.updated':
            const subscription = event.data.object as any;
            await handleSubscriptionUpdated(subscription);
            break;
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object as any;
            await handleSubscriptionDeleted(deletedSubscription);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) return;

    await prisma.user.update({
        where: { id: userId },
        data: {
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
        },
    });
}

async function handleSubscriptionUpdated(subscription: any) {
    const customerId = subscription.customer as string;
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeSubscriptionId: subscription.id,
        },
    });
}

async function handleSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer as string;
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            stripeSubscriptionId: null,
        },
    });
}

export default router;
