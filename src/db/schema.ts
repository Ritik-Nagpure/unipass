import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  jsonb,
  unique 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// PROFILES TABLE
// ============================================
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
  username: varchar("username", { length: 50 }).unique(),
  displayName: varchar("display_name", { length: 100 }),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 20 }),
  bio: text("bio"),
  website: varchar("website", { length: 255 }),
  location: varchar("location", { length: 100 }),
  company: varchar("company", { length: 100 }),
  title: varchar("title", { length: 100 }),
  socialLinks: jsonb("social_links").$type<{
    twitter?: string | null;
    linkedin?: string | null;
    github?: string | null;
  }>().default({
    twitter: null,
    linkedin: null,
    github: null,
  }),
  preferences: jsonb("preferences").$type<{
    theme?: 'light' | 'dark';
    language?: 'en' | 'es' | 'fr' | 'de';
    notifications?: boolean;
  }>().default({
    theme: 'light',
    language: 'en',
    notifications: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// APPLICATIONS TABLE (was clients)
// ============================================
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id", { length: 255 }).unique().notNull(),
  clientSecret: varchar("client_secret", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
  logo: text("logo"),
  website: varchar("website", { length: 255 }),
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(false),
  scopes: text("scopes").array().default(["profile", "email"]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

// ============================================
// USER APP ACCESS TABLE
// ============================================
export const userAppAccess = pgTable("user_app_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  grantedAt: timestamp("granted_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
  lastAccessed: timestamp("last_accessed"),
}, (table) => ({
  uniqueUserApp: unique().on(table.userId, table.applicationId),
}));

// ============================================
// AUTH CODES TABLE
// ============================================
export const authCodes = pgTable("auth_codes", {
  code: varchar("code", { length: 255 }).primaryKey(),
  clientId: varchar("client_id", { length: 255 }).notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// REFRESH TOKENS TABLE
// ============================================
export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  clientId: varchar("client_id", { length: 255 }).notNull(),
  applicationId: integer("application_id").references(() => applications.id),
  expiresAt: timestamp("expires_at").notNull(),
  revoked: boolean("revoked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// AUDIT LOGS TABLE
// ============================================
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  applicationId: integer("application_id").references(() => applications.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: jsonb("details").$type<Record<string, unknown>>(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  applications: many(userAppAccess),
  auditLogs: many(auditLogs),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ many }) => ({
  users: many(userAppAccess),
}));

export const userAppAccessRelations = relations(userAppAccess, ({ one }) => ({
  user: one(users, {
    fields: [userAppAccess.userId],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [userAppAccess.applicationId],
    references: [applications.id],
  }),
}));

// ============================================
// EXPORT TYPES
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type UserAppAccess = typeof userAppAccess.$inferSelect;
export type NewUserAppAccess = typeof userAppAccess.$inferInsert;
export type AuthCode = typeof authCodes.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;