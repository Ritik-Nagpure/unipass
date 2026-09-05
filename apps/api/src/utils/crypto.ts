import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, createHmac } from 'crypto';

const SALT_ROUNDS = 10;

// ========================================
// PASSWORD HASHING
// ========================================
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// ========================================
// TOKEN GENERATION & HASHING
// ========================================
export const generateToken = (bytes = 32): string => {
  return randomBytes(bytes).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

// ========================================
// CLIENT ID / SECRET GENERATION
// ========================================
export const generateClientId = (): string => {
  return `up_${randomBytes(16).toString('hex')}`;
};

export const generateClientSecret = (): string => {
  return `ups_${randomBytes(32).toString('hex')}`;
};

// ========================================
// PKCE VERIFICATION
// ========================================
export const generateCodeChallenge = (codeVerifier: string): string => {
  return createHash('sha256').update(codeVerifier).digest('base64url');
};

export const verifyPkce = (
  codeVerifier: string,
  codeChallenge: string,
  method: string
): boolean => {
  if (method === 'S256') {
    const computed = generateCodeChallenge(codeVerifier);
    return computed === codeChallenge;
  }
  if (method === 'plain') {
    return codeVerifier === codeChallenge;
  }
  return false;
};

// ========================================
// HMAC SIGNING (for opaque tokens)
// ========================================
export const signOpaqueToken = (payload: string): string => {
  const secret = process.env.JWT_SECRET || 'unipass-dev-secret';
  return createHmac('sha256', secret).update(payload).digest('hex');
};