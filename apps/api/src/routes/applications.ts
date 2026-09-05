import { Router, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import {
  applications,
  consents,
  auditLogs,
} from '../db/schema';
import {
  generateClientId,
  generateClientSecret,
  hashPassword,
} from '../utils/crypto';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createApplicationSchema,
  updateApplicationSchema,
  applicationParamsSchema,
} from '../validations/application';

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
// POST /api/applications
// ========================================
// Register a new application (OAuth client)
router.post('/', requireAuth, validate(createApplicationSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, description, logoUrl, redirectUris, scopes, homepageUrl } = req.body;

    const clientId = generateClientId();
    const clientSecret = generateClientSecret();
    const clientSecretHash = await hashPassword(clientSecret);

    const [app] = await db
      .insert(applications)
      .values({
        ownerId: req.user.id,
        name,
        description: description || null,
        logoUrl: logoUrl || null,
        clientId,
        clientSecretHash,
        redirectUris,
        scopes,
        homepageUrl: homepageUrl || null,
      })
      .returning({
        id: applications.id,
        name: applications.name,
        description: applications.description,
        logoUrl: applications.logoUrl,
        clientId: applications.clientId,
        redirectUris: applications.redirectUris,
        scopes: applications.scopes,
        homepageUrl: applications.homepageUrl,
        isActive: applications.isActive,
        createdAt: applications.createdAt,
      });

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      applicationId: app.id,
      eventType: 'application_created',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
      metadata: { name },
    });

    return res.status(201).json({
      application: app,
      clientSecret, // Only shown once!
      message: 'Application registered successfully. Save the client secret now - it will not be shown again.',
    });
  } catch (error) {
    console.error('Create application error:', error);
    return res.status(500).json({ error: 'Failed to create application' });
  }
});

// ========================================
// GET /api/applications
// ========================================
// List all applications owned by the current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userApps = await db
      .select({
        id: applications.id,
        name: applications.name,
        description: applications.description,
        logoUrl: applications.logoUrl,
        clientId: applications.clientId,
        redirectUris: applications.redirectUris,
        scopes: applications.scopes,
        homepageUrl: applications.homepageUrl,
        isActive: applications.isActive,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .where(eq(applications.ownerId, req.user.id))
      .orderBy(applications.createdAt);

    return res.json({ applications: userApps });
  } catch (error) {
    console.error('List applications error:', error);
    return res.status(500).json({ error: 'Failed to list applications' });
  }
});

// ========================================
// GET /api/applications/:id
// ========================================
// Get a single application by ID
router.get('/:id', requireAuth, validate(applicationParamsSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const [app] = await db
      .select({
        id: applications.id,
        name: applications.name,
        description: applications.description,
        logoUrl: applications.logoUrl,
        clientId: applications.clientId,
        redirectUris: applications.redirectUris,
        scopes: applications.scopes,
        homepageUrl: applications.homepageUrl,
        isActive: applications.isActive,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .where(
        and(
          eq(applications.id, req.params.id as string),
          eq(applications.ownerId, req.user.id)
        )
      );

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json({ application: app });
  } catch (error) {
    console.error('Get application error:', error);
    return res.status(500).json({ error: 'Failed to get application' });
  }
});

// ========================================
// PATCH /api/applications/:id
// ========================================
// Update an application
router.patch('/:id', requireAuth, validate(applicationParamsSchema), validate(updateApplicationSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, description, logoUrl, redirectUris, scopes, homepageUrl, isActive } = req.body;

    // Check ownership
    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, req.params.id as string),
          eq(applications.ownerId, req.user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const [updated] = await db
      .update(applications)
      .set({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(redirectUris !== undefined && { redirectUris }),
        ...(scopes !== undefined && { scopes }),
        ...(homepageUrl !== undefined && { homepageUrl }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, req.params.id as string))
      .returning({
        id: applications.id,
        name: applications.name,
        description: applications.description,
        logoUrl: applications.logoUrl,
        clientId: applications.clientId,
        redirectUris: applications.redirectUris,
        scopes: applications.scopes,
        homepageUrl: applications.homepageUrl,
        isActive: applications.isActive,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
      });

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      applicationId: updated.id,
      eventType: 'application_updated',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    return res.json({ application: updated });
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(500).json({ error: 'Failed to update application' });
  }
});

// ========================================
// DELETE /api/applications/:id
// ========================================
// Delete an application
router.delete('/:id', requireAuth, validate(applicationParamsSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // Check ownership
    const [existing] = await db
      .select({ id: applications.id, name: applications.name })
      .from(applications)
      .where(
        and(
          eq(applications.id, req.params.id as string),
          eq(applications.ownerId, req.user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Delete application (cascades to codes, tokens, consents, app_users)
    await db
      .delete(applications)
      .where(eq(applications.id, req.params.id as string));

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      eventType: 'application_deleted',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
      metadata: { name: existing.name },
    });

    return res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
});

// ========================================
// POST /api/applications/:id/regenerate-secret
// ========================================
// Regenerate client secret
router.post('/:id/regenerate-secret', requireAuth, validate(applicationParamsSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // Check ownership
    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, req.params.id as string),
          eq(applications.ownerId, req.user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const clientSecret = generateClientSecret();
    const clientSecretHash = await hashPassword(clientSecret);

    await db
      .update(applications)
      .set({ clientSecretHash, updatedAt: new Date() })
      .where(eq(applications.id, req.params.id as string));

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      applicationId: existing.id,
      eventType: 'application_secret_regenerated',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
    });

    return res.json({
      clientSecret,
      message: 'Client secret regenerated. Save it now - it will not be shown again.',
    });
  } catch (error) {
    console.error('Regenerate secret error:', error);
    return res.status(500).json({ error: 'Failed to regenerate client secret' });
  }
});

// ========================================
// GET /api/applications/:id/consents
// ========================================
// List users who have consented to this application
router.get('/:id/consents', requireAuth, validate(applicationParamsSchema), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // Check ownership
    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, req.params.id as string),
          eq(applications.ownerId, req.user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const userConsents = await db
      .select({
        id: consents.id,
        userId: consents.userId,
        scopes: consents.scopes,
        grantedAt: consents.grantedAt,
        revokedAt: consents.revokedAt,
      })
      .from(consents)
      .where(eq(consents.applicationId, req.params.id as string));

    return res.json({ consents: userConsents });
  } catch (error) {
    console.error('List consents error:', error);
    return res.status(500).json({ error: 'Failed to list consents' });
  }
});

export default router;