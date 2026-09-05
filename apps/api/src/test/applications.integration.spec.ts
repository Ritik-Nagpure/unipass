import request from 'supertest';
import { app, resetDatabase, createSession } from './helpers';

beforeEach(() => {
  resetDatabase();
});

const createAppFor = async (
  session: Awaited<ReturnType<typeof createSession>>,
  name = 'My App'
) => {
  const res = await session.agent.post('/api/applications').send({
    name,
    description: 'An app for testing',
    redirectUris: ['https://myapp.example.com/callback'],
  });
  return res;
};

describe('Applications API (integration)', () => {
  it('creates an application and returns the client secret once', async () => {
    const session = await createSession();
    const res = await createAppFor(session);

    expect(res.status).toBe(201);
    expect(res.body.application.name).toBe('My App');
    expect(res.body.application.clientId).toMatch(/^up_/);
    expect(res.body.clientSecret).toMatch(/^ups_/);
    expect(res.body.application).not.toHaveProperty('clientSecretHash');
  });

  it('requires authentication to create an application', async () => {
    const res = await request(app)
      .post('/api/applications')
      .send({ name: 'Nope', redirectUris: ['https://x.example.com/cb'] });

    expect(res.status).toBe(401);
  });

  it('rejects invalid payloads with 400', async () => {
    const session = await createSession();
    const res = await session.agent.post('/api/applications').send({
      name: 'A',
      redirectUris: ['not a uri'],
    });

    expect(res.status).toBe(400);
  });

  it('lists only the applications owned by the current user', async () => {
    const sessionA = await createSession();
    const sessionB = await createSession();

    await createAppFor(sessionA, 'App A1');
    await createAppFor(sessionA, 'App A2');
    await createAppFor(sessionB, 'App B1');

    const res = await sessionA.agent.get('/api/applications');
    expect(res.status).toBe(200);
    const names = res.body.applications.map((a: { name: string }) => a.name);
    expect(names).toContain('App A1');
    expect(names).toContain('App A2');
    expect(names).not.toContain('App B1');
  });

  it('gets a single application by id', async () => {
    const session = await createSession();
    const created = await createAppFor(session);

    const res = await session.agent.get(`/api/applications/${created.body.application.id}`);
    expect(res.status).toBe(200);
    expect(res.body.application.name).toBe('My App');
  });

  it("returns 404 when reading another user's application", async () => {
    const sessionA = await createSession();
    const sessionB = await createSession();
    const created = await createAppFor(sessionA);

    const res = await sessionB.agent.get(`/api/applications/${created.body.application.id}`);
    expect(res.status).toBe(404);
  });

  it('updates an application', async () => {
    const session = await createSession();
    const created = await createAppFor(session);

    const res = await session.agent
      .patch(`/api/applications/${created.body.application.id}`)
      .send({ name: 'Renamed App', isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.application.name).toBe('Renamed App');
    expect(res.body.application.isActive).toBe(false);
  });

  it("cannot update another user's application", async () => {
    const sessionA = await createSession();
    const sessionB = await createSession();
    const created = await createAppFor(sessionA);

    const res = await sessionB.agent
      .patch(`/api/applications/${created.body.application.id}`)
      .send({ name: 'Hacked' });

    expect(res.status).toBe(404);
  });

  it('deletes an application', async () => {
    const session = await createSession();
    const created = await createAppFor(session);

    const res = await session.agent.delete(`/api/applications/${created.body.application.id}`);
    expect(res.status).toBe(200);

    const list = await session.agent.get('/api/applications');
    expect(list.body.applications).toHaveLength(0);
  });

  it('regenerates the client secret', async () => {
    const session = await createSession();
    const created = await createAppFor(session);
    const firstSecret = created.body.clientSecret;

    const res = await session.agent.post(
      `/api/applications/${created.body.application.id}/regenerate-secret`
    );

    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toMatch(/^ups_/);
    expect(res.body.clientSecret).not.toBe(firstSecret);
  });

  it('lists consents for an application', async () => {
    const session = await createSession();
    const created = await createAppFor(session);

    const res = await session.agent.get(
      `/api/applications/${created.body.application.id}/consents`
    );

    expect(res.status).toBe(200);
    expect(res.body.consents).toEqual([]);
  });

  it('rejects a malformed application id with 400', async () => {
    const session = await createSession();
    const res = await session.agent.get('/api/applications/not-a-uuid');
    expect(res.status).toBe(400);
  });
});