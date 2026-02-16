import { Router, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
                createdAt: true,
                updatedAt: true,
                stripeCustomerId: true,
                stripeSubscriptionId: true,
                stripePriceId: true,
                stripeCurrentPeriodEnd: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put(
    '/profile',
    authenticateToken,
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Invalid email'),
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, email } = req.body;
            const updateData: any = {};

            if (name) updateData.name = name;
            if (email && email !== req.user!.email) {
                // Check if email is already taken
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    res.status(400).json({ error: 'Email already in use' });
                    return;
                }
                updateData.email = email;
                updateData.emailVerified = null; // Require re-verification
            }

            const user = await prisma.user.update({
                where: { id: req.user!.userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    emailVerified: true,
                },
            });

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
);

// Delete user account
router.delete('/account', authenticateToken, async (req: Request, res: Response) => {
    try {
        await prisma.user.delete({
            where: { id: req.user!.userId },
        });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Get audit logs
router.get('/audit-logs', authenticateToken, async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

export default router;
