"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get current user profile
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateToken, [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, email } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email && email !== req.user.email) {
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
            where: { id: req.user.userId },
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Delete user account
router.delete('/account', auth_1.authenticateToken, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.user.userId },
        });
        res.json({ message: 'Account deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});
// Get audit logs
router.get('/audit-logs', auth_1.authenticateToken, async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map