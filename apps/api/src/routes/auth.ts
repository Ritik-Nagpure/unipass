import { Router, Request, Response } from 'express';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { db } from '../db';
import {
  users,
  sessions,
  emailVerifications,
  passwordResets,
  loginAttempts,
  auditLogs,
} from '../db/schema';
import { hashPassword, verifyPassword, generateToken, hashToken } from '../utils/crypto';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { setAuthCookies, clearAuthCookies, REFRESH_TOKEN_COOKIE } from '../utils/cookies';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/auth';

const router = Router();

// Helper to get client IP
const getIp = (req: Request): string => {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

// ========================================
// POST /api/auth/register
// ========================================
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });

    // Create email verification token
    const verificationToken = generateToken();
    await db.insert(emailVerifications).values({
      userId: newUser.id,
      tokenHash: hashToken(verificationToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Create session
    const sessionId = randomBytes(16).toString('hex');
    const refreshToken = signRefreshToken(newUser.id, sessionId);
    await db.insert(sessions).values({
      id: sessionId,
      userId: newUser.id,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: getIp(req),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Sign access token
    const accessToken = signAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Audit log
    await db.insert(auditLogs).values({
      userId: newUser.id,
      eventType: 'register',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
      metadata: { email: newUser.email },
    });

    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

// ========================================
// POST /api/auth/login
// ========================================
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ip = getIp(req);

    // Check for too many failed attempts (simple rate limiting)
    const recentFailures = await db
      .select({ id: loginAttempts.id })
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.email, email.toLowerCase()),
          eq(loginAttempts.success, false),
          gt(loginAttempts.createdAt, new Date(Date.now() - 15 * 60 * 1000))
        )
      );

    if (recentFailures.length >= 5) {
      return res.status(429).json({
        error: 'Too many failed attempts. Please try again in 15 minutes.',
      });
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      await db.insert(loginAttempts).values({
        email: email.toLowerCase(),
        ipAddress: ip,
        success: false,
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await db.insert(loginAttempts).values({
        email: email.toLowerCase(),
        ipAddress: ip,
        success: false,
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    const sessionId = randomBytes(16).toString('hex');
    const refreshToken = signRefreshToken(user.id, sessionId);
    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Sign access token
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      eventType: 'login',
      ipAddress: ip,
      userAgent: req.headers['user-agent'] || null,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

// ========================================
// POST /api/auth/logout
// ========================================
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload) {
        // Revoke session
        await db
          .update(sessions)
          .set({ revokedAt: new Date() })
          .where(eq(sessions.id, payload.sessionId));

        // Audit log
        await db.insert(auditLogs).values({
          userId: payload.sub,
          eventType: 'logout',
          ipAddress: getIp(req),
          userAgent: req.headers['user-agent'] || null,
        });
      }
    }

    clearAuthCookies(res);
    return res.json({ message: 'Logged out successfully' });
  } catch {
    clearAuthCookies(res);
    return res.json({ message: 'Logged out successfully' });
  }
});

// ========================================
// POST /api/auth/refresh
// ========================================
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check session exists and not revoked
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, payload.sessionId),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (!session) {
      return res.status(401).json({ error: 'Session expired or revoked' });
    }

    // Verify refresh token hash matches
    const tokenHash = hashToken(refreshToken);
    if (session.refreshTokenHash !== tokenHash) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub));

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Rotate refresh token
    const newSessionId = randomBytes(16).toString('hex');
    const newRefreshToken = signRefreshToken(user.id, newSessionId);

    // Revoke old session, create new one
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, session.id));

    await db.insert(sessions).values({
      userId: user.id,
      refreshTokenHash: hashToken(newRefreshToken),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: getIp(req),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Sign new access token
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new cookies
    setAuthCookies(res, accessToken, newRefreshToken);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// ========================================
// GET /api/auth/me
// ========================================
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
        emailVerifiedAt: users.emailVerifiedAt,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

// ========================================
// PATCH /api/auth/profile
// ========================================
router.patch('/profile', requireAuth, validate(updateProfileSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, avatarUrl } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({
        ...(name !== undefined && { name }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
        emailVerifiedAt: users.emailVerifiedAt,
        createdAt: users.createdAt,
      });

    return res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ========================================
// POST /api/auth/change-password
// ========================================
router.post('/change-password', requireAuth, validate(changePasswordSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { currentPassword, newPassword } = req.body;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Revoke all sessions
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.userId, user.id));

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      eventType: 'change_password',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    clearAuthCookies(res);
    return res.json({ message: 'Password changed successfully. Please login again.' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

// ========================================
// POST /api/auth/forgot-password
// ========================================
router.post('/forgot-password', validate(forgotPasswordSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Invalidate old reset tokens
    await db
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(and(eq(passwordResets.userId, user.id), isNull(passwordResets.usedAt)));

    // Create new reset token
    const resetToken = generateToken();
    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash: hashToken(resetToken),
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    });

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      eventType: 'forgot_password',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    // TODO: Send email with reset link
    // In production, send email: `${FRONTEND_URL}/reset-password?token=${resetToken}`
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

// ========================================
// POST /api/auth/reset-password
// ========================================
router.post('/reset-password', validate(resetPasswordSchema), async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const tokenHash = hashToken(token);

    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.tokenHash, tokenHash),
          isNull(passwordResets.usedAt),
          gt(passwordResets.expiresAt, new Date())
        )
      );

    if (!reset) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    const newPasswordHash = await hashPassword(password);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, reset.userId));

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.id, reset.id));

    // Revoke all sessions
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.userId, reset.userId));

    // Audit log
    await db.insert(auditLogs).values({
      userId: reset.userId,
      eventType: 'reset_password',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    return res.json({ message: 'Password reset successfully. Please login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ========================================
// POST /api/auth/verify-email
// ========================================
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenHash = hashToken(token);
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.tokenHash, tokenHash),
          isNull(emailVerifications.usedAt),
          gt(emailVerifications.expiresAt, new Date())
        )
      );

    if (!verification) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark token as used
    await db
      .update(emailVerifications)
      .set({ usedAt: new Date() })
      .where(eq(emailVerifications.id, verification.id));

    // Mark email as verified
    await db
      .update(users)
      .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, verification.userId));

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
});

export default router;