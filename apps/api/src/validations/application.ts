import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Application name must be at least 2 characters').max(255),
    description: z.string().max(1000).optional(),
    logoUrl: z.string().url().optional().nullable(),
    redirectUris: z
      .array(z.string().url('Invalid redirect URI'))
      .min(1, 'At least one redirect URI is required')
      .max(10),
    scopes: z
      .array(z.enum(['openid', 'profile', 'email']))
      .min(1)
      .default(['openid', 'profile', 'email']),
    homepageUrl: z.string().url().optional().nullable(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    description: z.string().max(1000).optional().nullable(),
    logoUrl: z.string().url().optional().nullable(),
    redirectUris: z
      .array(z.string().url('Invalid redirect URI'))
      .min(1)
      .max(10)
      .optional(),
    scopes: z.array(z.enum(['openid', 'profile', 'email'])).min(1).optional(),
    homepageUrl: z.string().url().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const applicationParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid application ID'),
  }),
});