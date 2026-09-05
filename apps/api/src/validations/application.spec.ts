import {
  createApplicationSchema,
  updateApplicationSchema,
  applicationParamsSchema,
} from './application';

const parseBody = (schema: typeof createApplicationSchema, body: unknown) =>
  schema.safeParse({ body, query: {}, params: {} });

const parseParams = (schema: typeof applicationParamsSchema, params: unknown) =>
  schema.safeParse({ body: {}, query: {}, params });

describe('application validation schemas', () => {
  describe('createApplicationSchema', () => {
    it('accepts a valid application payload', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: ['https://myapp.com/callback'],
        scopes: ['openid', 'profile'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.scopes).toEqual(['openid', 'profile']);
      }
    });

    it('defaults scopes when omitted', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: ['https://myapp.com/callback'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.scopes).toEqual(['openid', 'profile', 'email']);
      }
    });

    it('requires at least one redirect URI', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid redirect URIs', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: ['not a uri'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid scope value', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: ['https://myapp.com/callback'],
        scopes: ['openid', 'admin'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects a name that is too short', () => {
      const result = parseBody(createApplicationSchema, {
        name: 'A',
        redirectUris: ['https://myapp.com/callback'],
      });
      expect(result.success).toBe(false);
    });

    it('rejects more than 10 redirect URIs', () => {
      const uris = Array.from(
        { length: 11 },
        (_, i) => `https://myapp${i}.com/callback`
      );
      const result = parseBody(createApplicationSchema, {
        name: 'My App',
        redirectUris: uris,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateApplicationSchema', () => {
    it('accepts a partial update', () => {
      const result = updateApplicationSchema.safeParse({
        body: { name: 'Renamed' },
        query: {},
        params: {},
      });
      expect(result.success).toBe(true);
    });

    it('accepts toggling isActive', () => {
      const result = updateApplicationSchema.safeParse({
        body: { isActive: false },
        query: {},
        params: {},
      });
      expect(result.success).toBe(true);
    });

    it('accepts an empty update body', () => {
      const result = updateApplicationSchema.safeParse({
        body: {},
        query: {},
        params: {},
      });
      expect(result.success).toBe(true);
    });
  });

  describe('applicationParamsSchema', () => {
    it('accepts a valid uuid param', () => {
      const result = parseParams(applicationParamsSchema, {
        id: '6f1a2b3c-4d5e-6f70-8a9b-0c1d2e3f4a5b',
      });
      expect(result.success).toBe(true);
    });

    it('rejects a non-uuid param', () => {
      const result = parseParams(applicationParamsSchema, { id: 'abc123' });
      expect(result.success).toBe(false);
    });
  });
});