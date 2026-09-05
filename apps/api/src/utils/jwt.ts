import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'unipass-dev-secret';
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '30d';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access';
  jti: string;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  jti: string;
  sessionId: string;
}

export interface OAuthAccessTokenPayload {
  sub: string;
  clientId: string;
  scopes: string[];
  type: 'oauth_access';
  jti: string;
}

export interface OAuthRefreshTokenPayload {
  sub: string;
  clientId: string;
  type: 'oauth_refresh';
  jti: string;
}

// ========================================
// SIGN TOKENS
// ========================================
export const signAccessToken = (user: {
  id: string;
  email: string;
  role: string;
}): string => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
    jti: randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  });
};

export const signRefreshToken = (
  userId: string,
  sessionId: string
): string => {
  const payload: RefreshTokenPayload = {
    sub: userId,
    type: 'refresh',
    jti: randomBytes(16).toString('hex'),
    sessionId,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  });
};

export const signOAuthAccessToken = (
  userId: string,
  clientId: string,
  scopes: string[]
): string => {
  const payload: OAuthAccessTokenPayload = {
    sub: userId,
    clientId,
    scopes,
    type: 'oauth_access',
    jti: randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const signOAuthRefreshToken = (
  userId: string,
  clientId: string
): string => {
  const payload: OAuthRefreshTokenPayload = {
    sub: userId,
    clientId,
    type: 'oauth_refresh',
    jti: randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ========================================
// VERIFY TOKENS
// ========================================
export const verifyAccessToken = (
  token: string
): AccessTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyOAuthAccessToken = (
  token: string
): OAuthAccessTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as OAuthAccessTokenPayload;
    if (decoded.type !== 'oauth_access') return null;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyOAuthRefreshToken = (
  token: string
): OAuthRefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as OAuthRefreshTokenPayload;
    if (decoded.type !== 'oauth_refresh') return null;
    return decoded;
  } catch {
    return null;
  }
};

// ========================================
// JWKS (Public key set for third-party verification)
// ========================================
// In production, use asymmetric keys (RS256). For dev, we expose a placeholder.
export const getJwks = () => {
  return {
    keys: [
      {
        kty: 'oct',
        kid: 'unipass-dev-key',
        use: 'sig',
        alg: 'HS256',
        // Note: In production this should be an RSA public key.
        // For development, third-party apps can verify using the shared secret.
      },
    ],
  };
};