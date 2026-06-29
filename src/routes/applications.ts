import express, { Request, Response } from "express";
import { db } from "../db/index.js";
import { applications, userAppAccess } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import crypto from "crypto";
import { z } from "zod";
import { handleZodError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const router = express.Router();
const emptyToUndefined = (value: unknown) => value === "" ? undefined : value;
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalText = z.preprocess(emptyToUndefined, z.string().optional());

// Validation schemas
const createAppSchema = z.object({
  name: z.string().min(1).max(255),
  description: optionalText,
  redirectUri: z.string().url(),
  website: optionalUrl,
  logo: optionalUrl,
  scopes: z.array(z.string()).default(["profile", "email"]),
});

const updateAppSchema = createAppSchema.partial();

// Helper function to safely get app ID from params
const getAppId = (param: string | string[] | undefined): number | null => {
  if (!param || typeof param !== 'string') {
    return null;
  }
  const id = parseInt(param);
  return isNaN(id) ? null : id;
};

// ============================================
// ADMIN ROUTES
// ============================================

// Create new application (Admin only)
router.post("/", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:create:start");
    const validatedData = createAppSchema.parse(req.body);
    const userId = req.userId!;
    req.logStep?.("applications:create:validated", { name: validatedData.name });
    
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");
    
    const [app] = await db.insert(applications).values({
      ...validatedData,
      clientId,
      clientSecret,
      createdBy: userId,
      isActive: true,
    }).returning();
    
    if (!app) {
      return res.status(500).json({ error: "Failed to create application" });
    }
    req.logStep?.("applications:create:saved", { applicationId: app.id });
    
    res.status(201).json({
      ...app,
      clientSecret, // Only show on creation
    });
  } catch (error) {
    const zodError = handleZodError(error);
    if (zodError) {
      return res.status(400).json(zodError);
    }
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Create app error");
    res.status(500).json({ error: "Failed to create application" });
  }
});

// Get all applications with user counts (Admin only)
const getAllApplications = async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:list:start");
    const allApps = await db.select({
      id: applications.id,
      name: applications.name,
      description: applications.description,
      clientId: applications.clientId,
      redirectUri: applications.redirectUri,
      website: applications.website,
      logo: applications.logo,
      isActive: applications.isActive,
      isPublic: applications.isPublic,
      scopes: applications.scopes,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      userCount: sql<number>`(
        SELECT COUNT(*) FROM ${userAppAccess} 
        WHERE ${userAppAccess.applicationId} = ${applications.id} 
        AND ${userAppAccess.isActive} = true
      )`,
    })
    .from(applications)
    .orderBy(applications.createdAt);

    req.logStep?.("applications:list:loaded", { count: allApps.length });
    res.json(allApps);
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Get all apps error");
    res.status(500).json({ error: "Failed to get applications" });
  }
};

router.get("/", authenticate, requireAdmin, getAllApplications);
router.get("/admin/all", authenticate, requireAdmin, getAllApplications);

// Get single application with user count (Admin only)
router.get("/admin/:id", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:get:start");
    const appId = getAppId(req.params.id);
    
    if (appId === null) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    const [app] = await db.select({
      id: applications.id,
      name: applications.name,
      description: applications.description,
      clientId: applications.clientId,
      redirectUri: applications.redirectUri,
      website: applications.website,
      logo: applications.logo,
      isActive: applications.isActive,
      isPublic: applications.isPublic,
      scopes: applications.scopes,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      userCount: sql<number>`(
        SELECT COUNT(*) FROM ${userAppAccess} 
        WHERE ${userAppAccess.applicationId} = ${applications.id} 
        AND ${userAppAccess.isActive} = true
      )`,
    })
    .from(applications)
    .where(eq(applications.id, appId));

    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json(app);
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Get app error");
    res.status(500).json({ error: "Failed to get application" });
  }
});

// Update application (Admin only)
const updateApplication = async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:update:start");
    const appId = getAppId(req.params.id);
    
    if (appId === null) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    const validatedData = updateAppSchema.parse(req.body);
    req.logStep?.("applications:update:validated", { appId, fields: Object.keys(validatedData) });
    
    const [updatedApp] = await db.update(applications)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, appId))
      .returning();
    
    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json(updatedApp);
  } catch (error) {
    const zodError = handleZodError(error);
    if (zodError) {
      return res.status(400).json(zodError);
    }
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Update app error");
    res.status(500).json({ error: "Failed to update application" });
  }
};

router.put("/:id", authenticate, requireAdmin, updateApplication);
router.put("/admin/:id", authenticate, requireAdmin, updateApplication);

// Delete/Deactivate application (Admin only)
const deactivateApplication = async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:delete:start");
    const appId = getAppId(req.params.id);
    
    if (appId === null) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    // Check if app exists
    const [app] = await db.select().from(applications).where(eq(applications.id, appId));
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Soft delete - deactivate
    await db.update(applications)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(eq(applications.id, appId));
    
    // Also revoke all user access for this app
    await db.update(userAppAccess)
      .set({ 
        isActive: false, 
        revokedAt: new Date() 
      })
      .where(eq(userAppAccess.applicationId, appId));
    
    res.json({ message: "Application deactivated and user access revoked" });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Delete app error");
    res.status(500).json({ error: "Failed to delete application" });
  }
};

router.delete("/:id", authenticate, requireAdmin, deactivateApplication);
router.delete("/admin/:id", authenticate, requireAdmin, deactivateApplication);

// Regenerate client secret (Admin only)
const regenerateSecret = async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:regenerate-secret:start");
    const appId = getAppId(req.params.id);
    
    if (appId === null) {
      return res.status(400).json({ error: "Invalid application ID" });
    }
    
    const newSecret = crypto.randomBytes(32).toString("hex");
    
    const [updatedApp] = await db.update(applications)
      .set({ clientSecret: newSecret, updatedAt: new Date() })
      .where(eq(applications.id, appId))
      .returning();
    
    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json({ clientSecret: newSecret });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Regenerate secret error");
    res.status(500).json({ error: "Failed to regenerate secret" });
  }
};

router.post("/:id/regenerate-secret", authenticate, requireAdmin, regenerateSecret);
router.post("/admin/:id/regenerate-secret", authenticate, requireAdmin, regenerateSecret);

// ============================================
// USER ROUTES (For regular users)
// ============================================

// Get all active applications (for users to see what's available)
router.get("/public", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("applications:public:start");
    const userId = req.userId!;
    
    // Get all active apps
    const allApps = await db.select()
      .from(applications)
      .where(eq(applications.isActive, true))
      .orderBy(applications.name);

    // Get user's connected apps
    const userAccess = await db.select()
      .from(userAppAccess)
      .where(and(
        eq(userAppAccess.userId, userId),
        eq(userAppAccess.isActive, true)
      ));

    const connectedAppIds = new Set(userAccess.map(ua => ua.applicationId));

    // Mark which apps user is connected to
    const appsWithStatus = allApps.map(app => ({
      ...app,
      isConnected: connectedAppIds.has(app.id),
    }));

    res.json(appsWithStatus);
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Get public apps error");
    res.status(500).json({ error: "Failed to get applications" });
  }
});

export default router;
