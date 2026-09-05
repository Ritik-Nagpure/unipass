import { validate } from './validate';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const schema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
});

const createRes = () => {
  const res = {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res;
};

describe('validate middleware', () => {
  const buildReq = (body: unknown) =>
    ({ body, query: {}, params: {} }) as unknown as Request;

  it('calls next() for a valid payload', async () => {
    const middleware = validate(schema);
    const req = buildReq({ name: 'John Doe', email: 'john@example.com' });
    const res = createRes();
    const next = jest.fn();

    await middleware(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  it('returns 400 with field details for an invalid payload', async () => {
    const middleware = validate(schema);
    const req = buildReq({ name: 'J', email: 'not-an-email' });
    const res = createRes();
    const next = jest.fn();

    await middleware(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const body = res.body as { error: string; details: Array<{ field: string; message: string }> };
    expect(body.error).toBe('Validation failed');
    const fields = body.details.map((d) => d.field);
    expect(fields).toContain('body.name');
    expect(fields).toContain('body.email');
  });

  it('returns 400 when the body is missing entirely', async () => {
    const middleware = validate(schema);
    const req = buildReq(undefined);
    const res = createRes();
    const next = jest.fn();

    await middleware(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
  });
});