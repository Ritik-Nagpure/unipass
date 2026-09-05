import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ========================================
// USERS
// ========================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: text('password_hash').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    role: varchar('role', { length: 20 }).notNull().default('user'),
    emailVerifiedAt: timestamp('email_verified_at'),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    index('users_role_idx').on(table.role),
  ]
);

// ========================================
// SESSIONS (Refresh Token Rotation)
// ========================================
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    userAgent: text('user_agent'),
    ipAddress: varchar('ip_address', { length: 45 }),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('sessions_user_id_idx').on(table.userId),
    index('sessions_refresh_token_hash_idx').on(table.refreshTokenHash),
  ]
);

// ========================================
// EMAIL VERIFICATIONS
// ========================================
export const emailVerifications = pgTable(
  'email_verifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('email_verifications_user_id_idx').on(table.userId),
    index('email_verifications_token_hash_idx').on(table.tokenHash),
  ]
);

// ========================================
// PASSWORD RESETS
// ========================================
export const passwordResets = pgTable(
  'password_resets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('password_resets_user_id_idx').on(table.userId),
    index('password_resets_token_hash_idx').on(table.tokenHash),
  ]
);

// ========================================
// LOGIN ATTEMPTS (Brute-force protection)
// ========================================
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    success: boolean('success').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('login_attempts_email_idx').on(table.email),
    index('login_attempts_ip_idx').on(table.ipAddress),
  ]
);

// ========================================
// APPLICATIONS (OAuth Clients)
// ========================================
export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    clientId: varchar('client_id', { length: 64 }).notNull(),
    clientSecretHash: text('client_secret_hash').notNull(),
    redirectUris: jsonb('redirect_uris').notNull().default([]),
    scopes: jsonb('scopes').notNull().default(['openid', 'profile', 'email']),
    homepageUrl: text('homepage_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('applications_client_id_unique').on(table.clientId),
    index('applications_owner_id_idx').on(table.ownerId),
  ]
);

// ========================================
// AUTHORIZATION CODES (OAuth)
// ========================================
export const authorizationCodes = pgTable(
  'authorization_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull(),
    redirectUri: text('redirect_uri').notNull(),
    scopes: jsonb('scopes').notNull().default([]),
    codeChallenge: text('code_challenge'),
    codeChallengeMethod: varchar('code_challenge_method', { length: 10 }),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('authorization_codes_application_id_idx').on(table.applicationId),
    index('authorization_codes_user_id_idx').on(table.userId),
    index('authorization_codes_code_hash_idx').on(table.codeHash),
  ]
);

// ========================================
// OAUTH ACCESS TOKENS
// ========================================
export const oauthAccessTokens = pgTable(
  'oauth_access_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    scopes: jsonb('scopes').notNull().default([]),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('oauth_access_tokens_application_id_idx').on(table.applicationId),
    index('oauth_access_tokens_user_id_idx').on(table.userId),
    index('oauth_access_tokens_token_hash_idx').on(table.tokenHash),
  ]
);

// ========================================
// OAUTH REFRESH TOKENS
// ========================================
export const oauthRefreshTokens = pgTable(
  'oauth_refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    scopes: jsonb('scopes').notNull().default([]),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('oauth_refresh_tokens_application_id_idx').on(table.applicationId),
    index('oauth_refresh_tokens_user_id_idx').on(table.userId),
    index('oauth_refresh_tokens_token_hash_idx').on(table.tokenHash),
  ]
);

// ========================================
// CONSENTS (User grants to applications)
// ========================================
export const consents = pgTable(
  'consents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    scopes: jsonb('scopes').notNull().default([]),
    grantedAt: timestamp('granted_at').notNull().defaultNow(),
    revokedAt: timestamp('revoked_at'),
  },
  (table) => [
    uniqueIndex('consents_user_application_unique').on(
      table.userId,
      table.applicationId
    ),
    index('consents_application_id_idx').on(table.applicationId),
  ]
);

// ========================================
// APP USERS (Mapping UniPass users to third-party app users)
// ========================================
export const appUsers = pgTable(
  'app_users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    externalUserId: varchar('external_user_id', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('app_users_user_application_unique').on(
      table.userId,
      table.applicationId
    ),
    index('app_users_application_id_idx').on(table.applicationId),
  ]
);

// ========================================
// AUDIT LOGS
// ========================================
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    applicationId: uuid('application_id').references(() => applications.id, {
      onDelete: 'set null',
    }),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('audit_logs_user_id_idx').on(table.userId),
    index('audit_logs_application_id_idx').on(table.applicationId),
    index('audit_logs_event_type_idx').on(table.eventType),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ]
);

// ========================================
// TYPES
// ========================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type AuthorizationCode = typeof authorizationCodes.$inferSelect;
export type NewAuthorizationCode = typeof authorizationCodes.$inferInsert;
export type OAuthAccessToken = typeof oauthAccessTokens.$inferSelect;
export type NewOAuthAccessToken = typeof oauthAccessTokens.$inferInsert;
export type OAuthRefreshToken = typeof oauthRefreshTokens.$inferSelect;
export type NewOAuthRefreshToken = typeof oauthRefreshTokens.$inferInsert;
export type Consent = typeof consents.$inferSelect;
export type NewConsent = typeof consents.$inferInsert;
export type AppUser = typeof appUsers.$inferSelect;
export type NewAppUser = typeof appUsers.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;