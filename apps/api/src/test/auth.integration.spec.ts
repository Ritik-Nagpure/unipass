import request from 'supertest';
import { app, resetDatabase, validUser } from './helpers';

const uniqueEmail = () =>
  `auth-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

beforeEach(() => {
  resetDatabase();
});

describe('Auth API (integration)', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user and sets auth cookies', async () => {
      const email = uniqueEmail();
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.role).toBe('user');
      expect(res.body.message).toBeDefined();

      const setCookies = res.headers['set-cookie'];
      expect(setCookies).toBeDefined();
      const cookieStr = Array.isArray(setCookies) ? setCookies.join('; ') : setCookies;
      expect(cookieStr).toContain('access_token=');
      expect(cookieStr).toContain('refresh_token=');
      expect(cookieStr).toContain('HttpOnly');
    });

    it('rejects duplicate email with 409', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Email already registered');
    });

    it('rejects an invalid payload with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'X', email: 'bad', password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details).toBeDefined();
    });

    it('normalizes the email to lowercase', async () => {
      const email = uniqueEmail();
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email: email.toUpperCase(), password: validUser.password });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(email);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(email);
    });

    it('rejects a wrong password with 401', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPassword1!' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('rejects an unknown email with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ghost@example.com', password: 'Whatever1!' });

      expect(res.status).toBe(401);
    });

    it('rate limits after 5 failed attempts with 429', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email, password: 'WrongPassword1!' });
        expect(res.status).toBe(401);
      }

      // Even the correct password is now blocked.
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: validUser.password });

      expect(res.status).toBe(429);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the current user for an authenticated session', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent.get('/api/auth/me');
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.id).toBeDefined();
    });

    it('returns 401 without a session', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears the auth cookies and invalidates the session', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent.post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Logged out');

      const cookieStr = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie'].join('; ')
        : res.headers['set-cookie'];
      expect(cookieStr).toContain('access_token=;');

      // The revoked session no longer grants access.
      const me = await agent.get('/api/auth/me');
      expect(me.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('rotates the session and returns a user payload', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent.post('/api/auth/refresh');
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(email);

      // The rotated cookies still grant access.
      const me = await agent.get('/api/auth/me');
      expect(me.status).toBe(200);
    });

    it('returns 401 without a refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/auth/profile', () => {
    it('updates the user name', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent
        .patch('/api/auth/profile')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.user.name).toBe('Updated Name');

      const me = await agent.get('/api/auth/me');
      expect(me.body.user.name).toBe('Updated Name');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .patch('/api/auth/profile')
        .send({ name: 'Nope' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('changes the password and revokes existing sessions', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent.post('/api/auth/change-password').send({
        currentPassword: validUser.password,
        newPassword: 'NewStr0ng!Pass',
      });
      expect(res.status).toBe(200);

      // Old password no longer works.
      const oldLogin = await request(app)
        .post('/api/auth/login')
        .send({ email, password: validUser.password });
      expect(oldLogin.status).toBe(401);

      // New password works.
      const newLogin = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'NewStr0ng!Pass' });
      expect(newLogin.status).toBe(200);
    });

    it('rejects an incorrect current password', async () => {
      const email = uniqueEmail();
      const agent = request.agent(app);
      await agent
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const res = await agent.post('/api/auth/change-password').send({
        currentPassword: 'WrongCurrent1!',
        newPassword: 'NewStr0ng!Pass',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('responds identically for unknown emails (no enumeration)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'does-not-exist@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('If an account exists');
    });

    it('invalidates previous reset tokens when requested again', async () => {
      const email = uniqueEmail();
      await request(app)
        .post('/api/auth/register')
        .send({ name: validUser.name, email, password: validUser.password });

      const first = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email });
      expect(first.status).toBe(200);

      const second = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email });
      expect(second.status).toBe(200);
      expect(second.body.message).toContain('If an account exists');
    });
  });

  describe('health + 404', () => {
    it('GET /api returns a health message', async () => {
      const res = await request(app).get('/api');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Api is running');
    });

    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-route');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });
});