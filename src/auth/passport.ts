import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done: any) => {
      try {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        
        if (!user.password) {
          return done(null, false, { message: "Account uses Google login" });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Google"), undefined);
        }

        // Check if user exists
        let [user] = await db.select().from(users).where(eq(users.email, email));

        if (user) {
          // If user exists but no googleId, update it
          if (!user.googleId) {
            await db.update(users)
              .set({ googleId: profile.id })
              .where(eq(users.id, user.id));
          }
          return done(null, user);
        } else {
          // Create new user
          const [newUser] = await db.insert(users).values({
            email,
            googleId: profile.id,
            name: profile.displayName || null,
          }).returning();
          
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;
