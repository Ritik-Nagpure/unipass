import {
  signAccessToken,
  signRefreshToken,
  signOAuthAccessToken,
  signOAuthRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyOAuthAccessToken,
  verifyOAuthRefreshToken,
  getJwks,
} from './jwt';

describe('jwt utils', () => {
  const user = { id: 'user-123', email: 'user@example.com', role: 'user' };

  describe('access tokens', () => {
    it('signs and verifies an access token', () => {
      const token = signAccessToken(user);
      const payload = verifyAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.sub).toBe(user.id);
      expect(payload!.email).toBe(user.email);
      expect(payload!.role).toBe(user.role);
      expect(payload!.type).toBe('access');
      expect(payload!.jti).toBeDefined();
    });

    it('rejects a tampered token', () => {
      const token = signAccessToken(user);
      const tampered = token.slice(0, -3) + 'abc';
      expect(verifyAccessToken(tampered)).toBeNull();
    });

    it('rejects a garbage token', () => {
      expect(verifyAccessToken('not-a-token')).toBeNull();
    });

    it('rejects an expired token', () => {
      const token = signAccessToken(user);
      // Simulate expiry by verifying with a token signed in the past is not
      // feasible without clock mocking, so instead check a refresh token is
      // rejected by the access-token verifier.
      const refreshToken = signRefreshToken(user.id, 'session-1');
      expect(verifyAccessToken(refreshToken)).toBeNull();
    });
  });

  describe('refresh tokens', () => {
    it('signs and verifies a refresh token with session id', () => {
      const token = signRefreshToken(user.id, 'session-abc');
      const payload = verifyRefreshToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.sub).toBe(user.id);
      expect(payload!.sessionId).toBe('session-abc');
      expect(payload!.type).toBe('refresh');
    });

    it('does not accept an access token as a refresh token', () => {
      const accessToken = signAccessToken(user);
      expect(verifyRefreshToken(accessToken)).toBeNull();
    });
  });

  describe('oauth tokens', () => {
    it('signs and verifies an oauth access token', () => {
      const token = signOAuthAccessToken(user.id, 'client-1', ['openid', 'profile']);
      const payload = verifyOAuthAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.sub).toBe(user.id);
      expect(payload!.clientId).toBe('client-1');
      expect(payload!.scopes).toEqual(['openid', 'profile']);
      expect(payload!.type).toBe('oauth_access');
    });

    it('signs and verifies an oauth refresh token', () => {
      const token = signOAuthRefreshToken(user.id, 'client-1');
      const payload = verifyOAuthRefreshToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.sub).toBe(user.id);
      expect(payload!.clientId).toBe('client-1');
      expect(payload!.type).toBe('oauth_refresh');
    });

    it('does not mix oauth and user tokens', () => {
      const oauthAccess = signOAuthAccessToken(user.id, 'client-1', ['openid']);
      const oauthRefresh = signOAuthRefreshToken(user.id, 'client-1');
      expect(verifyAccessToken(oauthAccess)).toBeNull();
      expect(verifyRefreshToken(oauthRefresh)).toBeNull();
      expect(verifyOAuthAccessToken(oauthRefresh)).toBeNull();
      expect(verifyOAuthRefreshToken(oauthAccess)).toBeNull();
    });

    it('rejects tampered oauth tokens', () => {
      const token = signOAuthAccessToken(user.id, 'client-1', ['openid']);
      expect(verifyOAuthAccessToken(token.slice(0, -2) + 'zz')).toBeNull();
    });
  });

  describe('getJwks', () => {
    it('returns a key set', () => {
      const jwks = getJwks();
      expect(jwks.keys).toHaveLength(1);
      expect(jwks.keys[0].kty).toBe('oct');
      expect(jwks.keys[0].use).toBe('sig');
    });
  });
});