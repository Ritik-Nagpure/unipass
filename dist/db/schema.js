import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }),
    googleId: varchar("google_id", { length: 255 }).unique(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
});
export const clients = pgTable("clients", {
    id: serial("id").primaryKey(),
    clientId: varchar("client_id", { length: 255 }).unique().notNull(),
    clientSecret: varchar("client_secret", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
export const authCodes = pgTable("auth_codes", {
    code: varchar("code", { length: 255 }).primaryKey(),
    clientId: varchar("client_id", { length: 255 }).notNull(),
    userId: integer("user_id").references(() => users.id),
    redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
});
export const refreshTokens = pgTable("refresh_tokens", {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 255 }).unique().notNull(),
    userId: integer("user_id").references(() => users.id),
    clientId: varchar("client_id", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revoked: boolean("revoked").default(false),
});
