"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // Verify user still exists and is not blocked
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || user.isBlocked) {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.user = decoded; // Now valid due to global declaration
        return next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        return next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map