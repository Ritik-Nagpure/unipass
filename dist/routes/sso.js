import express from "express";
import crypto from "crypto";
import { db } from "../db/index.js";
import { authCodes, refreshTokens, clients, users } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { signAccessToken, verifyAccessToken, verifyUnipassCookie, signOAuthState, } from "../utils/jwt.js";
const router = express.Router();
// 1. Authorize endpoint
router.get("/authorize", async (req, res) => {
    try {
        const { client_id, redirect_uri, state } = req.query;
        if (!client_id || !redirect_uri) {
            return res.status(400).send("Missing client_id or redirect_uri");
        }
        // Validate client
        const [client] = await db.select().from(clients).where(eq(clients.clientId, client_id));
        if (!client || client.redirectUri !== redirect_uri) {
            return res.status(400).send("Invalid client");
        }
        // Check if user is authenticated via Unipass cookie
        const token = req.cookies?.unipass_token;
        let user = null;
        if (token) {
            const payload = verifyUnipassCookie(token);
            if (payload) {
                user = payload;
            }
        }
        if (user) {
            // Generate authorization code
            const code = crypto.randomBytes(20).toString("hex");
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            await db.insert(authCodes).values({
                code,
                clientId: client_id,
                userId: user.userId,
                redirectUri: redirect_uri,
                expiresAt,
            });
            // Redirect back to client
            const redirectUrl = new URL(redirect_uri);
            redirectUrl.searchParams.set("code", code);
            if (state) {
                redirectUrl.searchParams.set("state", state);
            }
            return res.redirect(redirectUrl.toString());
        }
        else {
            // Not authenticated: save OAuth state in a signed cookie
            const oauthState = {
                client_id: client_id,
                redirect_uri: redirect_uri,
                state: state || undefined,
            };
            const signedState = signOAuthState(oauthState);
            res.cookie("oauth_state", signedState, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 10 * 60 * 1000, // 10 minutes
            });
            // Redirect to login page
            return res.redirect("/login.html");
        }
    }
    catch (error) {
        console.error("Authorize error:", error);
        res.status(500).send("Internal server error");
    }
});
// 2. Token endpoint
router.post("/token", async (req, res) => {
    try {
        const { code, client_id, client_secret, grant_type = "authorization_code" } = req.body;
        if (grant_type !== "authorization_code") {
            return res.status(400).json({ error: "Unsupported grant_type" });
        }
        // Validate client
        const [client] = await db.select().from(clients).where(eq(clients.clientId, client_id));
        if (!client || client.clientSecret !== client_secret) {
            return res.status(401).json({ error: "Invalid client credentials" });
        }
        // Validate code
        const [authCode] = await db.select().from(authCodes)
            .where(and(eq(authCodes.code, code), eq(authCodes.clientId, client_id), gt(authCodes.expiresAt, new Date())));
        if (!authCode) {
            return res.status(400).json({ error: "Invalid or expired code" });
        }
        // Delete used code
        await db.delete(authCodes).where(eq(authCodes.code, code));
        // IMPORTANT: authCode.userId is NOT NULL in schema, but TypeScript doesn't know that
        // Use a type assertion or check
        const userId = authCode.userId; // Type assertion since schema says NOT NULL
        // Get user - use the asserted userId
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
            return res.status(500).json({ error: "User not found" });
        }
        // Generate access token (JWT)
        const accessPayload = {
            userId: user.id,
            email: user.email,
            name: user.name || null,
            clientId: client_id,
        };
        const accessToken = signAccessToken(accessPayload);
        // Generate refresh token
        const refreshTokenStr = crypto.randomBytes(32).toString("hex");
        const refreshExpiry = new Date();
        refreshExpiry.setDate(refreshExpiry.getDate() + 30); // 30 days
        await db.insert(refreshTokens).values({
            token: refreshTokenStr,
            userId: user.id,
            clientId: client_id,
            expiresAt: refreshExpiry,
            revoked: false,
        });
        res.json({
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: 15 * 60, // 15 minutes
            refresh_token: refreshTokenStr,
        });
    }
    catch (error) {
        console.error("Token error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// 3. Refresh token endpoint
router.post("/refresh", async (req, res) => {
    try {
        const { refresh_token, client_id, client_secret } = req.body;
        // Validate client
        const [client] = await db.select().from(clients).where(eq(clients.clientId, client_id));
        if (!client || client.clientSecret !== client_secret) {
            return res.status(401).json({ error: "Invalid client credentials" });
        }
        // Find refresh token
        const [storedToken] = await db.select().from(refreshTokens)
            .where(and(eq(refreshTokens.token, refresh_token), eq(refreshTokens.clientId, client_id), gt(refreshTokens.expiresAt, new Date()), eq(refreshTokens.revoked, false)));
        if (!storedToken) {
            return res.status(400).json({ error: "Invalid or expired refresh token" });
        }
        // storedToken.userId is NOT NULL in schema, use type assertion
        const userId = storedToken.userId;
        // Get user
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
            return res.status(500).json({ error: "User not found" });
        }
        // Revoke old refresh token (rotation)
        await db.update(refreshTokens)
            .set({ revoked: true })
            .where(eq(refreshTokens.id, storedToken.id));
        // Issue new access token
        const accessPayload = {
            userId: user.id,
            email: user.email,
            name: user.name || null,
            clientId: client_id,
        };
        const newAccessToken = signAccessToken(accessPayload);
        // Issue new refresh token
        const newRefreshToken = crypto.randomBytes(32).toString("hex");
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);
        await db.insert(refreshTokens).values({
            token: newRefreshToken,
            userId: user.id,
            clientId: client_id,
            expiresAt: newExpiry,
            revoked: false,
        });
        res.json({
            access_token: newAccessToken,
            token_type: "Bearer",
            expires_in: 15 * 60,
            refresh_token: newRefreshToken,
        });
    }
    catch (error) {
        console.error("Refresh error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// 4. UserInfo endpoint
router.get("/userinfo", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or invalid Authorization header" });
        }
        const token = authHeader.slice(7);
        const payload = verifyAccessToken(token);
        if (!payload) {
            return res.status(401).json({ error: "Invalid or expired access token" });
        }
        const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
        });
    }
    catch (error) {
        console.error("Userinfo error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
