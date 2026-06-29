import { Request, Response, NextFunction } from 'express';
import { verifyUnipassCookie } from '../utils/jwt.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { type User } from '../db/schema.js';
import { logger } from '../utils/logger.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
      user?: User;
    }
  }
}

// ============================================
// AUTHENTICATE MIDDLEWARE
// ============================================
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logStep?.('auth:start');
    const token = req.cookies?.unipass_token;
    if (!token) {
      req.logStep?.('auth:missing-cookie');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = verifyUnipassCookie(token);
    if (!payload) {
      req.logStep?.('auth:invalid-token');
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.logStep?.('auth:token-verified', { userId: payload.userId });

    // Get user from database to check role
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (!user) {
      req.logStep?.('auth:user-not-found', { userId: payload.userId });
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      req.logStep?.('auth:user-inactive', { userId: user.id });
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.userId = user.id;
    req.userRole = user.role;
    req.user = user;
    req.logStep?.('auth:success', { userId: user.id, role: user.role });
    next();
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), 'Auth error');
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// ============================================
// REQUIRE ADMIN MIDDLEWARE
// ============================================
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    req.logStep?.('auth:admin-denied', { role: req.userRole });
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.logStep?.('auth:admin-granted');
  next();
};

// ============================================
// REQUIRE OWN OR ADMIN MIDDLEWARE
// ============================================
export const requireOwnOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  let targetUserId: number | undefined;
  
  // Fix: Properly handle userId from params
  const userIdParam = req.params.userId;
  if (userIdParam && typeof userIdParam === 'string') {
    const id = parseInt(userIdParam);
    if (!isNaN(id)) targetUserId = id;
  }
  
  // Fix: Properly handle userId from body
  if (!targetUserId && req.body.userId !== undefined) {
    const id = typeof req.body.userId === 'string' ? parseInt(req.body.userId) : req.body.userId;
    if (!isNaN(id)) targetUserId = id;
  }

  if (req.userRole === 'admin' || req.userId === targetUserId) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied' });
};

// ============================================
// OPTIONAL AUTH (doesn't require authentication)
// ============================================
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.unipass_token;
    if (token) {
      const payload = verifyUnipassCookie(token);
      if (payload) {
        const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
        if (user && user.isActive) {
          req.userId = user.id;
          req.userRole = user.role;
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Even if auth fails, continue without user
    next();
  }
};
