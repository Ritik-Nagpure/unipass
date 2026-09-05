import {
  hashPassword,
  verifyPassword,
  generateToken,
  hashToken,
  generateClientId,
  generateClientSecret,
  generateCodeChallenge,
  verifyPkce,
  signOpaqueToken,
} from './crypto';
import { createHash, createHmac } from 'crypto';

describe('crypto utils', () => {
  describe('hashPassword / verifyPassword', () => {
    it('hashes a password and verifies it correctly', async () => {
      const hash = await hashPassword('MySecret123!');
      expect(hash).not.toBe('MySecret123!');
      expect(hash).toMatch(/^\$2[aby]\$/);
      await expect(verifyPassword('MySecret123!', hash)).resolves.toBe(true);
    });

    it('fails verification for a wrong password', async () => {
      const hash = await hashPassword('MySecret123!');
      await expect(verifyPassword('WrongPassword', hash)).resolves.toBe(false);
    });

    it('produces different hashes for the same password (unique salt)', async () => {
      const hash1 = await hashPassword('SamePassword1!');
      const hash2 = await hashPassword('SamePassword1!');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateToken', () => {
    it('generates a hex token of the requested byte length', () => {
      const token = generateToken(32);
      expect(token).toHaveLength(64); // 32 bytes -> 64 hex chars
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('defaults to 32 bytes', () => {
      expect(generateToken()).toHaveLength(64);
    });

    it('generates unique tokens', () => {
      const tokens = new Set(Array.from({ length: 50 }, () => generateToken()));
      expect(tokens.size).toBe(50);
    });
  });

  describe('hashToken', () => {
    it('produces a deterministic sha256 hex digest', () => {
      const h1 = hashToken('token-value');
      const h2 = hashToken('token-value');
      expect(h1).toBe(h2);
      expect(h1).toBe(createHash('sha256').update('token-value').digest('hex'));
    });

    it('produces different hashes for different inputs', () => {
      expect(hashToken('a')).not.toBe(hashToken('b'));
    });
  });

  describe('generateClientId / generateClientSecret', () => {
    it('prefixes client ids with up_', () => {
      const id = generateClientId();
      expect(id).toMatch(/^up_[a-f0-9]{32}$/);
    });

    it('prefixes client secrets with ups_ and uses 32 bytes', () => {
      const secret = generateClientSecret();
      expect(secret).toMatch(/^ups_[a-f0-9]{64}$/);
    });

    it('generates unique values', () => {
      const ids = new Set(Array.from({ length: 20 }, () => generateClientId()));
      expect(ids.size).toBe(20);
    });
  });

  describe('PKCE', () => {
    const verifier = 'correct-horse-battery-staple';

    it('generates a base64url S256 code challenge', () => {
      const challenge = generateCodeChallenge(verifier);
      expect(challenge).toBe(
        createHash('sha256').update(verifier).digest('base64url')
      );
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');
      expect(challenge).not.toContain('=');
    });

    it('verifies a valid S256 challenge', () => {
      const challenge = generateCodeChallenge(verifier);
      expect(verifyPkce(verifier, challenge, 'S256')).toBe(true);
    });

    it('rejects an invalid S256 verifier', () => {
      const challenge = generateCodeChallenge(verifier);
      expect(verifyPkce('wrong-verifier', challenge, 'S256')).toBe(false);
    });

    it('verifies a plain challenge', () => {
      expect(verifyPkce('abc', 'abc', 'plain')).toBe(true);
      expect(verifyPkce('abc', 'xyz', 'plain')).toBe(false);
    });

    it('rejects unknown methods', () => {
      expect(verifyPkce('abc', 'abc', 'weird-method')).toBe(false);
    });
  });

  describe('signOpaqueToken', () => {
    it('produces a deterministic HMAC', () => {
      const secret = process.env.JWT_SECRET || 'unipass-dev-secret';
      const expected = createHmac('sha256', secret).update('payload').digest('hex');
      expect(signOpaqueToken('payload')).toBe(expected);
    });
  });
});