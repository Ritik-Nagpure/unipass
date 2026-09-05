import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from './auth';
import { z } from 'zod';

const parseBody = (schema: z.ZodType, body: unknown) =>
  schema.safeParse({ body, query: {}, params: {} });

describe('auth validation schemas', () => {
  describe('registerSchema', () => {
    it('accepts a valid registration payload', () => {
      const result = parseBody(registerSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Str0ng!Pass',
      });
      expect(result.success).toBe(true);
    });

    it('rejects a name that is too short', () => {
      const result = parseBody(registerSchema, {
        name: 'J',
        email: 'john@example.com',
        password: 'Str0ng!Pass',
      });
      expect(result.success).toBe(false);
    });

    it('rejects an invalid email', () => {
      const result = parseBody(registerSchema, {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'Str0ng!Pass',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a short password', () => {
      const result = parseBody(registerSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Ab1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a password without a number', () => {
      const result = parseBody(registerSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'NoDigits!Pass',
      });
      expect(result.success).toBe(false);
    });

    it('rejects a password without a special character', () => {
      const result = parseBody(registerSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'NoSpecial123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = parseBody(registerSchema, { name: 'John Doe' });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('accepts a valid login payload', () => {
      const result = parseBody(loginSchema, {
        email: 'john@example.com',
        password: 'whatever',
      });
      expect(result.success).toBe(true);
    });

    it('rejects an empty password', () => {
      const result = parseBody(loginSchema, {
        email: 'john@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('accepts a valid email', () => {
      expect(
        parseBody(forgotPasswordSchema, { email: 'john@example.com' }).success
      ).toBe(true);
    });

    it('rejects an invalid email', () => {
      expect(
        parseBody(forgotPasswordSchema, { email: 'nope' }).success
      ).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('accepts a valid reset payload', () => {
      const result = parseBody(resetPasswordSchema, {
        token: 'reset-token',
        password: 'NewStr0ng!Pass',
      });
      expect(result.success).toBe(true);
    });

    it('rejects a missing token', () => {
      const result = parseBody(resetPasswordSchema, {
        password: 'NewStr0ng!Pass',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateProfileSchema', () => {
    it('accepts an optional name and avatarUrl', () => {
      expect(
        parseBody(updateProfileSchema, { name: 'New Name' }).success
      ).toBe(true);
      expect(
        parseBody(updateProfileSchema, { avatarUrl: null }).success
      ).toBe(true);
      expect(parseBody(updateProfileSchema, {}).success).toBe(true);
    });

    it('rejects an invalid avatar url', () => {
      expect(
        parseBody(updateProfileSchema, { avatarUrl: 'not-a-url' }).success
      ).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('accepts a valid payload', () => {
      const result = parseBody(changePasswordSchema, {
        currentPassword: 'OldPass1!',
        newPassword: 'NewStr0ng!Pass',
      });
      expect(result.success).toBe(true);
    });

    it('rejects a weak new password', () => {
      const result = parseBody(changePasswordSchema, {
        currentPassword: 'OldPass1!',
        newPassword: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });
});