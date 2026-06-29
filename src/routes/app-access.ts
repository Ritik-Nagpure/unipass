import express, { Request, Response } from "express";
import { db } from "../db/index.js";
import { applications, userAppAccess, refreshTokens, auditLogs } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticate } from "../middleware/auth.js";
import { z } from "zod";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Connect to an application (Subscribe)
router.post("/connect", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("app-access:connect:start");
    const userId = req.userId!;
    const { applicationId } = z.object({
      applicationId: z.number(),
    }).parse(req.body);
    
    // Check if app exists and is active
    const [app] = await db.select()
      .from(applications)
      .where(and(
        eq(applications.id, applicationId),
        eq(applications.isActive, true)
      ));
    
    if (!app) {
      req.logStep?.("app-access:connect:app-not-found", { applicationId });
      return res.status(404).json({ error: "Application not found or inactive" });
    }
    
    // Check if access already exists
    const [existing] = await db.select()
      .from(userAppAccess)
      .where(and(
        eq(userAppAccess.userId, userId),
        eq(userAppAccess.applicationId, applicationId)
      ));
    
    if (existing) {
      // Reactivate if revoked
      if (!existing.isActive) {
        await db.update(userAppAccess)
          .set({ 
            isActive: true, 
            revokedAt: null,
            grantedAt: new Date(),
          })
          .where(eq(userAppAccess.id, existing.id));
        
        // Log audit
        await db.insert(auditLogs).values({
          userId,
          applicationId,
          action: "CONNECT_APP",
          resource: `app_${applicationId}`,
          details: { appName: app.name },
        });
        
        req.logStep?.("app-access:connect:reactivated", { applicationId });
        return res.json({ message: "Application reconnected successfully" });
      }
      req.logStep?.("app-access:connect:already-connected", { applicationId });
      return res.status(400).json({ error: "Already connected to this application" });
    }
    
    // Create new access
    await db.insert(userAppAccess).values({
      userId,
      applicationId,
      isActive: true,
      grantedAt: new Date(),
    });
    
    // Log audit
    await db.insert(auditLogs).values({
      userId,
      applicationId,
      action: "CONNECT_APP",
      resource: `app_${applicationId}`,
      details: { appName: app.name },
    });
    
    req.logStep?.("app-access:connect:success", { applicationId });
    res.json({ message: "Application connected successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Connect app error");
    res.status(500).json({ error: "Failed to connect application" });
  }
});

// Disconnect from an application (Unsubscribe)
router.post("/disconnect", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("app-access:disconnect:start");
    const userId = req.userId!;
    const { applicationId } = z.object({
      applicationId: z.number(),
    }).parse(req.body);
    
    const [access] = await db.select()
      .from(userAppAccess)
      .where(and(
        eq(userAppAccess.userId, userId),
        eq(userAppAccess.applicationId, applicationId),
        eq(userAppAccess.isActive, true)
      ));
    
    if (!access) {
      req.logStep?.("app-access:disconnect:not-connected", { applicationId });
      return res.status(404).json({ error: "Not connected to this application" });
    }
    
    await db.update(userAppAccess)
      .set({ 
        isActive: false, 
        revokedAt: new Date(),
      })
      .where(eq(userAppAccess.id, access.id));
    
    // Revoke refresh tokens for this app
    await db.update(refreshTokens)
      .set({ revoked: true })
      .where(and(
        eq(refreshTokens.userId, userId),
        eq(refreshTokens.applicationId, applicationId)
      ));
    
    // Get app name for logging
    const [app] = await db.select().from(applications).where(eq(applications.id, applicationId));
    
    // Log audit
    await db.insert(auditLogs).values({
      userId,
      applicationId,
      action: "DISCONNECT_APP",
      resource: `app_${applicationId}`,
      details: { appName: app?.name },
    });
    
    req.logStep?.("app-access:disconnect:success", { applicationId });
    res.json({ message: "Application disconnected successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Disconnect app error");
    res.status(500).json({ error: "Failed to disconnect application" });
  }
});

// Get user's connected applications
router.get("/my-apps", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("app-access:my-apps:start");
    const userId = req.userId!;
    
    const userApps = await db.select({
      id: applications.id,
      name: applications.name,
      description: applications.description,
      logo: applications.logo,
      website: applications.website,
      redirectUri: applications.redirectUri,
      isActive: applications.isActive,
      connectedAt: userAppAccess.grantedAt,
    })
    .from(applications)
    .innerJoin(userAppAccess, and(
      eq(userAppAccess.applicationId, applications.id),
      eq(userAppAccess.userId, userId),
      eq(userAppAccess.isActive, true)
    ))
    .where(eq(applications.isActive, true));
    
    req.logStep?.("app-access:my-apps:loaded", { count: userApps.length });
    res.json(userApps);
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Get my apps error");
    res.status(500).json({ error: "Failed to get connected applications" });
  }
});

export default router;
