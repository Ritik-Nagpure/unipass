import express, { type Request, type Response } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { signUnipassCookie, verifyUnipassCookie, signOAuthState, verifyOAuthState } from "../utils/jwt.js";

const router = express.Router();

// Helper to set cookie
const setUnipassCookie = (
  res: Response,
  userId: number,
  email: string,
  name?: string | null
) => {
  const token = signUnipassCookie({
    userId,
    email,
    name: name || null
  });

  res.cookie("unipass_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      email,
      password: hashed,
      name: name || null
    }).returning();

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    setUnipassCookie(res, user.id, user.email, user.name);

    // Check for OAuth state
    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        const redirectUrl = `/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          return res.redirect(`${redirectUrl}&state=${state.state}`);
        }
        return res.redirect(redirectUrl);
      }
    }

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Local login
router.post("/login", (req: Request, res: Response, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: "Login failed" });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    // Login successful
    setUnipassCookie(res, user.id, user.email, user.name);

    // Check for OAuth state
    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        const redirectUrl = `/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          return res.redirect(`${redirectUrl}&state=${state.state}`);
        }
        return res.redirect(redirectUrl);
      }
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  })(req, res, next);
});

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req: Request, res: Response, next) => {
  passport.authenticate("google", (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.redirect("/login.html?error=google-auth-failed");
    }

    setUnipassCookie(res, user.id, user.email, user.name);

    const oauthStateCookie = req.cookies?.oauth_state;
    if (oauthStateCookie) {
      const state = verifyOAuthState(oauthStateCookie);
      if (state) {
        res.clearCookie("oauth_state");
        const redirectUrl = `/sso/authorize?client_id=${state.client_id}&redirect_uri=${encodeURIComponent(state.redirect_uri)}`;
        if (state.state) {
          return res.redirect(`${redirectUrl}&state=${state.state}`);
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
router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.unipass_token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const payload = verifyUnipassCookie(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.json(payload);
});

export default router;
