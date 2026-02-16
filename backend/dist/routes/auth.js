"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Register with email/password
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password, name } = req.body;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                emailVerified: new Date(), // Auto-verify for now, implement email verification later
            },
        });
        // Generate tokens
        const tokens = (0, jwt_1.generateTokenPair)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            ...tokens,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Login with email/password
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Check if user is blocked
        if (user.isBlocked) {
            res.status(403).json({ error: 'Account has been blocked' });
            return;
        }
        // Verify password
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Check email verification
        if (!user.emailVerified) {
            res.status(403).json({ error: 'Please verify your email first' });
            return;
        }
        // Generate tokens
        const tokens = (0, jwt_1.generateTokenPair)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
            },
            ...tokens,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Refresh access token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }
        // Verify refresh token
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || user.isBlocked) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }
        // Generate new token pair
        const tokens = (0, jwt_1.generateTokenPair)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.json(tokens);
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
});
// Get current user (protected route)
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                role: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
                createdAt: true,
            },
        });
        if (!user) {
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// Logout (optional - mainly handled on client side by removing tokens)
router.post('/logout', auth_1.authenticateToken, (_req, res) => {
    // In a production app, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map