import request from 'supertest';
import { createHash, randomBytes } from 'crypto';
import { app, resetDatabase, createSession } from './helpers';

beforeEach(() => {
  resetDatabase();
});

const REDIRECT_URI = 'https://thirdparty.example.com/callback';

interface TestApp {
  application: { id: string; clientId: string };
  clientSecret: string;
}

const registerApp = async (
  session: Awaited<ReturnType<typeof createSession>>
): Promise<TestApp> => {
  const res = await session.agent.post('/api/applications').send({
    name: 'Third Party App',
    redirectUris: [REDIRECT_URI],
  });
  return res.body;
};

const getCodeFromRedirect = (location: string): URLSearchParams =>
  new URL(location).searchParams;

const consent = async (session: Awaited<ReturnType<typeof createSession>>, testApp: TestApp) => {
  await session.agent.post('/api/oauth/consent').send({
    applicationId: testApp.application.id,
    scopes: ['openid'],
    redirectUri: REDIRECT_URI,
    approved: true,
  });
  const res = await session.agent.get('/api/oauth/authorize').query({
    client_id: testApp.application.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid',
  });
  return getCodeFromRedirect(res.headers.location).get('code');
};

const exchangeCode = (testApp: TestApp, code: string, extra: Record<string, unknown> = {}) =>
  request(app).post('/api/oauth/token').send({
    grant_type: 'authorization_code',
    code,
    client_id: testApp.application.clientId,
    client_secret: testApp.clientSecret,
    redirect_uri: REDIRECT_URI,
    ...extra,
  });

describe('OAuth API (integration)', () => {
  it('exposes the OpenID discovery document', async () => {
    const res = await request(app).get('/.well-known/openid-configuration');

    expect(res.status).toBe(200);
    expect(res.body.authorization_endpoint).toContain('/api/oauth/authorize');
    expect(res.body.token_endpoint).toContain('/api/oauth/token');
    expect(res.body.userinfo_endpoint).toContain('/api/oauth/userinfo');
    expect(res.body.scopes_supported).toEqual(['openid', 'profile', 'email']);
  });

  it('exposes the JWKS endpoint', async () => {
    const res = await request(app).get('/api/oauth/jwks');
    expect(res.status).toBe(200);
    expect(res.body.keys).toHaveLength(1);
  });

  describe('authorize', () => {
    it('returns consent details for a first-time authorization', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      const res = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile',
        state: 'state-123',
      });

      expect(res.status).toBe(200);
      expect(res.body.consentRequired).toBe(true);
      expect(res.body.clientId).toBe(testApp.application.clientId);
      expect(res.body.requestedScopes).toEqual(['openid', 'profile']);
      expect(res.body.state).toBe('state-123');
    });

    it('rejects an unknown client_id', async () => {
      const session = await createSession();
      const res = await session.agent.get('/api/oauth/authorize').query({
        client_id: 'up_unknown',
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid client_id');
    });

    it('rejects an unregistered redirect_uri', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      const res = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: 'https://evil.example.com/callback',
        response_type: 'code',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid redirect_uri');
    });

    it('rejects an unsupported response_type', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      const res = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'token',
      });

      expect(res.status).toBe(400);
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/oauth/authorize').query({
        client_id: 'up_x',
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('full authorization code flow', () => {
    it('completes authorize -> consent -> token -> userinfo', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      // 1. Authorize - consent required the first time.
      const authorizeRes = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid profile email',
        state: 'abc',
      });
      expect(authorizeRes.body.consentRequired).toBe(true);

      // 2. Consent - returns a redirect carrying the code.
      const consentRes = await session.agent.post('/api/oauth/consent').send({
        applicationId: testApp.application.id,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: REDIRECT_URI,
        state: 'abc',
        approved: true,
      });
      expect(consentRes.status).toBe(302);
      const params = getCodeFromRedirect(consentRes.headers.location);
      const code = params.get('code');
      expect(code).toBeTruthy();
      expect(params.get('state')).toBe('abc');

      // 3. Token exchange.
      const tokenRes = await exchangeCode(testApp, code as string);
      expect(tokenRes.status).toBe(200);
      expect(tokenRes.body.access_token).toBeTruthy();
      expect(tokenRes.body.token_type).toBe('Bearer');
      expect(tokenRes.body.refresh_token).toBeTruthy();
      expect(tokenRes.body.expires_in).toBe(3600);

      // 4. Userinfo with the issued access token.
      const userinfoRes = await request(app)
        .get('/api/oauth/userinfo')
        .set('Authorization', `Bearer ${tokenRes.body.access_token}`);

      expect(userinfoRes.status).toBe(200);
      expect(userinfoRes.body.sub).toBeDefined();
      expect(userinfoRes.body.email).toBeDefined();
      expect(userinfoRes.body.name).toBeDefined();
    });

    it('auto-approves when consent already exists', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      await consent(session, testApp);

      const res = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid',
      });

      expect(res.status).toBe(302);
      expect(getCodeFromRedirect(res.headers.location).get('code')).toBeTruthy();
    });

    it('rejects a code that is reused', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);
      const code = await consent(session, testApp);

      const first = await exchangeCode(testApp, code as string);
      expect(first.status).toBe(200);

      const second = await exchangeCode(testApp, code as string);
      expect(second.status).toBe(400);
    });

    it('rejects a token exchange with wrong client credentials', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);
      const code = await consent(session, testApp);

      const res = await request(app).post('/api/oauth/token').send({
        grant_type: 'authorization_code',
        code,
        client_id: testApp.application.clientId,
        client_secret: 'ups_wrong',
        redirect_uri: REDIRECT_URI,
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid client credentials');
    });
  });

  describe('PKCE (S256)', () => {
    it('requires the code_verifier and succeeds with a valid one', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);

      const verifier = randomBytes(32).toString('base64url');
      const challenge = createHash('sha256').update(verifier).digest('base64url');

      // Grant consent first so authorize redirects with a code.
      await session.agent.post('/api/oauth/consent').send({
        applicationId: testApp.application.id,
        scopes: ['openid'],
        redirectUri: REDIRECT_URI,
        approved: true,
      });

      const authorizeRes = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
      const code = getCodeFromRedirect(authorizeRes.headers.location).get('code');

      // Without the verifier the exchange fails.
      const noVerifier = await exchangeCode(testApp, code as string);
      expect(noVerifier.status).toBe(400);

      // A fresh code exchanges successfully with the verifier.
      const authorizeRes2 = await session.agent.get('/api/oauth/authorize').query({
        client_id: testApp.application.clientId,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
      const code2 = getCodeFromRedirect(authorizeRes2.headers.location).get('code');

      const tokenRes = await exchangeCode(testApp, code2 as string, {
        code_verifier: verifier,
      });

      expect(tokenRes.status).toBe(200);
      expect(tokenRes.body.access_token).toBeTruthy();
    });
  });

  describe('userinfo + revoke', () => {
    it('requires a bearer token for userinfo', async () => {
      const res = await request(app).get('/api/oauth/userinfo');
      expect(res.status).toBe(401);
    });

    it('revokes an oauth refresh token', async () => {
      const session = await createSession();
      const testApp = await registerApp(session);
      const code = await consent(session, testApp);

      const tokenRes = await exchangeCode(testApp, code as string);
      expect(tokenRes.status).toBe(200);

      const revokeRes = await request(app).post('/api/oauth/revoke').send({
        token: tokenRes.body.refresh_token,
        token_type_hint: 'refresh_token',
      });
      expect(revokeRes.status).toBe(200);

      // Refreshing with the revoked token fails.
      const refreshRes = await request(app).post('/api/oauth/token').send({
        grant_type: 'refresh_token',
        refresh_token: tokenRes.body.refresh_token,
        client_id: testApp.application.clientId,
        client_secret: testApp.clientSecret,
      });
      expect(refreshRes.status).toBe(401);
    });

    it('returns 400 when the token is missing', async () => {
      const res = await request(app).post('/api/oauth/revoke').send({});
      expect(res.status).toBe(400);
    });
  });
});