import { Router, Request, Response } from 'express';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { db } from '../db';
import {
  applications,
  authorizationCodes,
  oauthAccessTokens,
  oauthRefreshTokens,
  consents,
  appUsers,
  users,
  auditLogs,
} from '../db/schema';
import {
  hashToken,
  generateToken,
  verifyPkce,
} from '../utils/crypto';
import {
  signOAuthAccessToken,
  signOAuthRefreshToken,
  verifyOAuthAccessToken,
  verifyOAuthRefreshToken,
} from '../utils/jwt';
import { getJwks } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';

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
// GET /api/oauth/authorize
// ========================================
// This is the entry point for third-party apps.
// User must be logged in. Shows consent screen.
router.get('/authorize', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method } = req.query;

    // Validate required params
    if (!client_id || !redirect_uri || !response_type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (response_type !== 'code') {
      return res.status(400).json({ error: 'Unsupported response_type. Must be "code"' });
    }

    // Find application
    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.clientId, client_id as string));

    if (!app || !app.isActive) {
      return res.status(400).json({ error: 'Invalid client_id' });
    }

    // Validate redirect URI
    const redirectUris = app.redirectUris as string[];
    if (!redirectUris.includes(redirect_uri as string)) {
      return res.status(400).json({ error: 'Invalid redirect_uri' });
    }

    // Parse scopes
    const requestedScopes = scope
      ? (scope as string).split(' ').filter((s) => ['openid', 'profile', 'email'].includes(s))
      : ['openid'];

    if (requestedScopes.length === 0) {
      return res.status(400).json({ error: 'Invalid scope' });
    }

    // Check if user has already consented
    const [existingConsent] = await db
      .select()
      .from(consents)
      .where(
        and(
          eq(consents.userId, req.user.id),
          eq(consents.applicationId, app.id),
          isNull(consents.revokedAt)
        )
      );

    // If already consented, auto-approve and redirect
    if (existingConsent) {
      // Generate authorization code
      const code = generateToken(32);
      await db.insert(authorizationCodes).values({
        applicationId: app.id,
        userId: req.user.id,
        codeHash: hashToken(code),
        redirectUri: redirect_uri as string,
        scopes: requestedScopes,
        codeChallenge: code_challenge as string | undefined,
        codeChallengeMethod: code_challenge_method as string | undefined,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      // Audit log
      await db.insert(auditLogs).values({
        userId: req.user.id,
        applicationId: app.id,
        eventType: 'oauth_authorize',
        ipAddress: getIp(req),
        userAgent: req.headers['user-agent'] || null,
        metadata: { scopes: requestedScopes, autoApproved: true },
      });

      const redirectUrl = new URL(redirect_uri as string);
      redirectUrl.searchParams.set('code', code);
      if (state) redirectUrl.searchParams.set('state', state as string);

      return res.redirect(redirectUrl.toString());
    }

    // Show consent screen
    // In a real implementation, this would render an HTML consent page.
    // For API-only mode, we return the consent details and the frontend handles it.
    return res.json({
      consentRequired: true,
      application: {
        id: app.id,
        name: app.name,
        description: app.description,
        logoUrl: app.logoUrl,
        homepageUrl: app.homepageUrl,
      },
      requestedScopes,
      clientId: client_id,
      redirectUri: redirect_uri,
      state: state || null,
      codeChallenge: code_challenge || null,
      codeChallengeMethod: code_challenge_method || null,
    });
  } catch (error) {
    console.error('Authorize error:', error);
    return res.status(500).json({ error: 'Authorization failed' });
  }
});

// ========================================
// POST /api/oauth/consent
// ========================================
// User approves the consent screen
router.post('/consent', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { applicationId, scopes, redirectUri, state, codeChallenge, codeChallengeMethod, approved } = req.body;

    if (!approved) {
      // User denied - redirect with error
      const redirectUrl = new URL(redirectUri);
      redirectUrl.searchParams.set('error', 'access_denied');
      if (state) redirectUrl.searchParams.set('state', state);
      return res.redirect(redirectUrl.toString());
    }

    // Find application
    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!app || !app.isActive) {
      return res.status(400).json({ error: 'Invalid application' });
    }

    // Validate redirect URI
    const redirectUris = app.redirectUris as string[];
    if (!redirectUris.includes(redirectUri)) {
      return res.status(400).json({ error: 'Invalid redirect_uri' });
    }

    // Create or update consent
    const [existingConsent] = await db
      .select()
      .from(consents)
      .where(
        and(
          eq(consents.userId, req.user.id),
          eq(consents.applicationId, app.id)
        )
      );

    if (existingConsent) {
      await db
        .update(consents)
        .set({ scopes, revokedAt: null, grantedAt: new Date() })
        .where(eq(consents.id, existingConsent.id));
    } else {
      await db.insert(consents).values({
        userId: req.user.id,
        applicationId: app.id,
        scopes,
      });
    }

    // Generate authorization code
    const code = generateToken(32);
    await db.insert(authorizationCodes).values({
      applicationId: app.id,
      userId: req.user.id,
      codeHash: hashToken(code),
      redirectUri,
      scopes,
      codeChallenge: codeChallenge || null,
      codeChallengeMethod: codeChallengeMethod || null,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user.id,
      applicationId: app.id,
      eventType: 'oauth_consent',
      ipAddress: getIp(req),
      userAgent: req.headers['user-agent'] || null,
      metadata: { scopes },
    });

    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (state) redirectUrl.searchParams.set('state', state);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Consent error:', error);
    return res.status(500).json({ error: 'Consent processing failed' });
  }
});

// ========================================
// POST /api/oauth/token
// ========================================
// Exchange authorization code for tokens
router.post('/token', async (req: Request, res: Response) => {
  try {
    const { grant_type, code, client_id, client_secret, redirect_uri, code_verifier, refresh_token } = req.body;

    if (grant_type === 'authorization_code') {
      // Validate required params
      if (!code || !client_id || !client_secret) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Find application
      const [app] = await db
        .select()
        .from(applications)
        .where(eq(applications.clientId, client_id));

      if (!app || !app.isActive) {
        return res.status(400).json({ error: 'Invalid client credentials' });
      }

      // Verify client secret
      const { verifyPassword } = await import('../utils/crypto');
      const secretValid = await verifyPassword(client_secret, app.clientSecretHash);
      if (!secretValid) {
        return res.status(401).json({ error: 'Invalid client credentials' });
      }

      // Find and validate authorization code
      const codeHash = hashToken(code);
      const [authCode] = await db
        .select()
        .from(authorizationCodes)
        .where(
          and(
            eq(authorizationCodes.codeHash, codeHash),
            isNull(authorizationCodes.usedAt),
            gt(authorizationCodes.expiresAt, new Date())
          )
        );

      if (!authCode) {
        return res.status(400).json({ error: 'Invalid or expired authorization code' });
      }

      // Verify redirect URI matches
      if (redirect_uri && authCode.redirectUri !== redirect_uri) {
        return res.status(400).json({ error: 'redirect_uri mismatch' });
      }

      // Verify PKCE if code_challenge was provided
      if (authCode.codeChallenge) {
        if (!code_verifier) {
          return res.status(400).json({ error: 'code_verifier is required' });
        }
        const valid = verifyPkce(
          code_verifier,
          authCode.codeChallenge,
          authCode.codeChallengeMethod || 'S256'
        );
        if (!valid) {
          return res.status(400).json({ error: 'PKCE verification failed' });
        }
      }

      // Mark code as used
      await db
        .update(authorizationCodes)
        .set({ usedAt: new Date() })
        .where(eq(authorizationCodes.id, authCode.id));

      // Get user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, authCode.userId));

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Generate tokens
      const accessToken = signOAuthAccessToken(user.id, app.clientId, authCode.scopes as string[]);
      const oauthRefreshToken = signOAuthRefreshToken(user.id, app.clientId);

      // Store token hashes
      await db.insert(oauthAccessTokens).values({
        applicationId: app.id,
        userId: user.id,
        tokenHash: hashToken(accessToken),
        scopes: authCode.scopes as string[],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      await db.insert(oauthRefreshTokens).values({
        applicationId: app.id,
        userId: user.id,
        tokenHash: hashToken(oauthRefreshToken),
        scopes: authCode.scopes as string[],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      // Create/update app user mapping
      const [existingAppUser] = await db
        .select()
        .from(appUsers)
        .where(
          and(
            eq(appUsers.userId, user.id),
            eq(appUsers.applicationId, app.id)
          )
        );

      if (!existingAppUser) {
        await db.insert(appUsers).values({
          userId: user.id,
          applicationId: app.id,
        });
      }

      // Audit log
      await db.insert(auditLogs).values({
        userId: user.id,
        applicationId: app.id,
        eventType: 'oauth_token_exchange',
        ipAddress: getIp(req),
        userAgent: req.headers['user-agent'] || null,
      });

      // Build id_token (OpenID Connect)
      const idToken = signOAuthAccessToken(user.id, app.clientId, authCode.scopes as string[]);

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: oauthRefreshToken,
        id_token: idToken,
        scope: (authCode.scopes as string[]).join(' '),
      });
    }

    if (grant_type === 'refresh_token') {
      if (!refresh_token || !client_id || !client_secret) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Find application
      const [app] = await db
        .select()
        .from(applications)
        .where(eq(applications.clientId, client_id));

      if (!app || !app.isActive) {
        return res.status(400).json({ error: 'Invalid client credentials' });
      }

      // Verify client secret
      const { verifyPassword } = await import('../utils/crypto');
      const secretValid = await verifyPassword(client_secret, app.clientSecretHash);
      if (!secretValid) {
        return res.status(401).json({ error: 'Invalid client credentials' });
      }

      // Verify refresh token
      const payload = verifyOAuthRefreshToken(refresh_token);
      if (!payload || payload.clientId !== client_id) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Check token exists and not revoked
      const tokenHash = hashToken(refresh_token);
      const [storedToken] = await db
        .select()
        .from(oauthRefreshTokens)
        .where(
          and(
            eq(oauthRefreshTokens.tokenHash, tokenHash),
            isNull(oauthRefreshTokens.revokedAt),
            gt(oauthRefreshTokens.expiresAt, new Date())
          )
        );

      if (!storedToken) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
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
      const newAccessToken = signOAuthAccessToken(user.id, app.clientId, storedToken.scopes as string[]);
      const newRefreshToken = signOAuthRefreshToken(user.id, app.clientId);

      // Revoke old refresh token
      await db
        .update(oauthRefreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(oauthRefreshTokens.id, storedToken.id));

      // Store new tokens
      await db.insert(oauthAccessTokens).values({
        applicationId: app.id,
        userId: user.id,
        tokenHash: hashToken(newAccessToken),
        scopes: storedToken.scopes as string[],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      await db.insert(oauthRefreshTokens).values({
        applicationId: app.id,
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        scopes: storedToken.scopes as string[],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      return res.json({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: newRefreshToken,
        scope: (storedToken.scopes as string[]).join(' '),
      });
    }

    return res.status(400).json({ error: 'Unsupported grant_type' });
  } catch (error) {
    console.error('Token error:', error);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
});

// ========================================
// GET /api/oauth/userinfo
// ========================================
// Third-party apps call this with Bearer token to get user info
router.get('/userinfo', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const token = authHeader.slice(7);
    const payload = verifyOAuthAccessToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check token exists and not revoked
    const tokenHash = hashToken(token);
    const [storedToken] = await db
      .select()
      .from(oauthAccessTokens)
      .where(
        and(
          eq(oauthAccessTokens.tokenHash, tokenHash),
          isNull(oauthAccessTokens.revokedAt),
          gt(oauthAccessTokens.expiresAt, new Date())
        )
      );

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build userinfo response based on scopes
    const scopes = payload.scopes;
    const userInfo: Record<string, unknown> = {
      sub: user.id,
    };

    if (scopes.includes('profile')) {
      userInfo.name = user.name;
      userInfo.picture = user.avatarUrl;
    }
    if (scopes.includes('email')) {
      userInfo.email = user.email;
      userInfo.email_verified = !!user.emailVerifiedAt;
    }

    return res.json(userInfo);
  } catch (error) {
    console.error('Userinfo error:', error);
    return res.status(500).json({ error: 'Failed to get user info' });
  }
});

// ========================================
// POST /api/oauth/revoke
// ========================================
// Revoke an access or refresh token
router.post('/revoke', async (req: Request, res: Response) => {
  try {
    const { token, token_type_hint } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const tokenHash = hashToken(token);

    if (token_type_hint === 'refresh_token' || !token_type_hint) {
      // Try refresh token first
      const [refreshToken] = await db
        .select()
        .from(oauthRefreshTokens)
        .where(eq(oauthRefreshTokens.tokenHash, tokenHash));

      if (refreshToken) {
        await db
          .update(oauthRefreshTokens)
          .set({ revokedAt: new Date() })
          .where(eq(oauthRefreshTokens.id, refreshToken.id));
        return res.json({ message: 'Token revoked' });
      }
    }

    if (token_type_hint === 'access_token' || !token_type_hint) {
      // Try access token
      const [accessToken] = await db
        .select()
        .from(oauthAccessTokens)
        .where(eq(oauthAccessTokens.tokenHash, tokenHash));

      if (accessToken) {
        await db
          .update(oauthAccessTokens)
          .set({ revokedAt: new Date() })
          .where(eq(oauthAccessTokens.id, accessToken.id));
        return res.json({ message: 'Token revoked' });
      }
    }

    return res.status(404).json({ error: 'Token not found' });
  } catch (error) {
    console.error('Revoke error:', error);
    return res.status(500).json({ error: 'Failed to revoke token' });
  }
});

// ========================================
// GET /.well-known/jwks.json
// ========================================
// Public keys for third-party apps to verify JWT signatures
router.get('/jwks', (req: Request, res: Response) => {
  res.json(getJwks());
});

// ========================================
// GET /.well-known/openid-configuration
// ========================================
// OpenID Connect discovery document
router.get('/openid-configuration', (req: Request, res: Response) => {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/oauth/authorize`,
    token_endpoint: `${baseUrl}/api/oauth/token`,
    userinfo_endpoint: `${baseUrl}/api/oauth/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    revocation_endpoint: `${baseUrl}/api/oauth/revoke`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['HS256'],
    scopes_supported: ['openid', 'profile', 'email'],
    token_endpoint_auth_methods_supported: ['client_secret_post'],
  });
});

export default router;