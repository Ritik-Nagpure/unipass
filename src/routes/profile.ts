import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../db/index.js";
import { profiles, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth.js";
import { z } from "zod";
import { handleZodError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarDir = path.join(__dirname, "../../public/uploads/avatars");

const emptyToUndefined = (value: unknown) => value === "" ? undefined : value;
const emptyToNull = (value: unknown) => value === "" ? null : value;
const optionalUrl = z.preprocess(emptyToNull, z.string().url().nullable().optional());
const optionalText = (max: number) => z.preprocess(emptyToNull, z.string().max(max).nullable().optional());

// Validation schemas
const updateProfileSchema = z.object({
  username: z.preprocess(emptyToUndefined, z.string().min(3).max(50).optional()),
  displayName: z.preprocess(emptyToUndefined, z.string().min(1).max(100).optional()),
  avatar: z.preprocess(emptyToNull, z.string().max(500).nullable().optional()),
  phone: optionalText(30),
  bio: optionalText(500),
  website: optionalUrl,
  location: optionalText(100),
  company: optionalText(100),
  title: optionalText(100),
  socialLinks: z.object({
    twitter: optionalUrl,
    linkedin: optionalUrl,
    github: optionalUrl,
  }).optional(),
  preferences: z.object({
    theme: z.enum(["light", "dark"]).optional(),
    language: z.enum(["en", "es", "fr", "de"]).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

// Get user profile
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("profile:get:start");
    const userId = req.userId!;

    let [profile] = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    req.logStep?.("profile:get:profile-loaded", { exists: Boolean(profile) });

    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!profile) {
      req.logStep?.("profile:get:create-default");
      const [newProfile] = await db.insert(profiles).values({
        userId,
        username: user.email?.split('@')[0],
        displayName: user.email?.split('@')[0],
      }).returning();

      return res.json({
        ...newProfile,
        email: user.email,
      });
    }

    res.json({
      ...profile,
      email: user.email,
    });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Get profile error");
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Update user profile
router.put("/me", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("profile:update:start");
    const userId = req.userId!;
    const validatedData = updateProfileSchema.parse(req.body);
    req.logStep?.("profile:update:validated", { fields: Object.keys(validatedData) });

    if (validatedData.username) {
      req.logStep?.("profile:update:check-username");
      const [existing] = await db.select()
        .from(profiles)
        .where(eq(profiles.username, validatedData.username));

      if (existing && existing.userId !== userId) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const [existingProfile] = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!existingProfile) {
      req.logStep?.("profile:update:create-profile");
      const [newProfile] = await db.insert(profiles).values({
        userId,
        ...validatedData,
      }).returning();

      return res.json(newProfile);
    }

    const [updatedProfile] = await db.update(profiles)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    req.logStep?.("profile:update:saved", { profileId: updatedProfile.id });
    res.json(updatedProfile);
  } catch (error) {
    const zodError = handleZodError(error);
    if (zodError) {
      return res.status(400).json(zodError);
    }
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Update profile error");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.post("/avatar", authenticate, async (req: Request, res: Response) => {
  try {
    req.logStep?.("profile:avatar:start");
    const image = typeof req.body?.image === "string" ? req.body.image : "";
    const match = image.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/);

    if (!match || !match[1] || !match[2]) {
      req.logStep?.("profile:avatar:invalid-payload");
      return res.status(400).json({ error: "Avatar image must be a PNG, JPG, or WebP data URL" });
    }

    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Avatar image must be smaller than 5MB" });
    }

    fs.mkdirSync(avatarDir, { recursive: true });
    const filename = `user-${req.userId}-${Date.now()}.${ext}`;
    const relativeUrl = `/uploads/avatars/${filename}`;
    fs.writeFileSync(path.join(avatarDir, filename), buffer);
    req.logStep?.("profile:avatar:file-saved", { filename, bytes: buffer.length });

    const [existingProfile] = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, req.userId!));

    const [profile] = existingProfile
      ? await db.update(profiles)
          .set({ avatar: relativeUrl, updatedAt: new Date() })
          .where(eq(profiles.userId, req.userId!))
          .returning()
      : await db.insert(profiles)
          .values({ userId: req.userId!, avatar: relativeUrl })
          .returning();

    req.logStep?.("profile:avatar:saved", { profileId: profile?.id });
    res.json({ url: relativeUrl, profile });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Upload avatar error");
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

export default router;
