import express, { Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users, profiles } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { signUnipassCookie, verifyUnipassCookie, verifyOAuthState } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

const router = express.Router();
const hasGoogleOAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Helper to set cookie
const setUnipassCookie = (
  res: Response, 
  userId: number, 
  email: string
) => {
  const token = signUnipassCookie({ 
    userId, 
    email, 
    name: null 
  });
  
  res.cookie("unipass_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// Helper to get user with profile
const getUserWithProfile = async (userId: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return null;
  
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
  
  return {
    id: user.id,
    email: user.email,
    name: profile?.displayName || user.email.split('@')[0],
    avatar: profile?.avatar || null,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    req.logStep?.("auth:register:start");
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      req.logStep?.("auth:register:missing-fields");
      return res.status(400).json({ error: "Email and password required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      req.logStep?.("auth:register:email-exists");
      return res.status(400).json({ error: "Email already registered" });
    }
    req.logStep?.("auth:register:email-available");

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user
    const [user] = await db.insert(users).values({ 
      email, 
      password: hashed, 
      role: "user",
      isActive: true,
    }).returning();

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Create profile with name
    const displayName = name || email.split('@')[0];
    const [profile] = await db.insert(profiles).values({
      userId: user.id,
      displayName: displayName,
      username: email.split('@')[0],
    }).returning();

    setUnipassCookie(res, user.id, user.email);
    req.logStep?.("auth:register:success", { userId: user.id });
    
    // Check for OAuth state
    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        let redirectUrl = `/api/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          redirectUrl += `&state=${state.state}`;
        }
        return res.redirect(redirectUrl);
      }
    }

    res.status(201).json({ 
      user: { 
        id: user.id, 
        email: user.email,
        name: profile?.displayName || displayName
      } 
    });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error(String(error)), "Registration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Local login
router.post("/login", (req: Request, res: Response, next) => {
  req.logStep?.("auth:login:start");
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      req.logStep?.("auth:login:error");
      return res.status(500).json({ error: "Login failed" });
    }
    if (!user) {
      req.logStep?.("auth:login:invalid");
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }
    
    setUnipassCookie(res, user.id, user.email);
    req.logStep?.("auth:login:success", { userId: user.id });
    
    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id))
      .catch(console.error);
    
    // Get profile for name
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    
    // Check for OAuth state
    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        let redirectUrl = `/api/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          redirectUrl += `&state=${state.state}`;
        }
        return res.redirect(redirectUrl);
      }
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email,
        name: profile?.displayName || user.email.split('@')[0]
      } 
    });
  })(req, res, next);
});

// Google OAuth routes
router.get("/google", (req: Request, res: Response, next) => {
  if (!hasGoogleOAuth) {
    return res.status(503).json({ error: "Google OAuth is not configured" });
  }

  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback", (req: Request, res: Response, next) => {
  if (!hasGoogleOAuth) {
    return res.redirect("/login.html?error=google-auth-unavailable");
  }

  passport.authenticate("google", async (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.redirect("/login.html?error=google-auth-failed");
    }
    
    setUnipassCookie(res, user.id, user.email);
    
    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id))
      .catch(console.error);
    
    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        let redirectUrl = `/api/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          redirectUrl += `&state=${state.state}`;
        }
        return res.redirect(redirectUrl);
      }
    }
    
    res.redirect("/dashboard.html");
  })(req, res, next);
});

// Logout
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("unipass_token");
  res.clearCookie("oauth_state");
  res.json({ message: "Logged out" });
});

// Get current user
router.get("/me", async (req: Request, res: Response) => {
  const token = req.cookies?.unipass_token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const payload = verifyUnipassCookie(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }
  
  // Get user with profile
  const userWithProfile = await getUserWithProfile(payload.userId);
  if (!userWithProfile) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json(userWithProfile);
});

export default router;
