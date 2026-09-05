import request from 'supertest';
import { createApp } from '../app';
import { resetDatabase } from '../db';

const app = createApp();

export { app, request, resetDatabase };

export const validUser = {
  name: 'Test User',
  email: 'test.user@example.com',
  password: 'Str0ng!Pass1',
};

export interface Session {
  agent: ReturnType<typeof request.agent>;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Register + login a fresh user and return the cookie session.
export const createSession = async (
  email = `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
): Promise<Session> => {
  const agent = request.agent(app);
  const res = await agent
    .post('/api/auth/register')
    .send({ name: validUser.name, email, password: validUser.password });

  if (res.status === 409) {
    // Account already exists (e.g. across runs) - log in instead.
    await agent
      .post('/api/auth/login')
      .send({ email, password: validUser.password });
  }

  return { agent, user: res.body.user };
};