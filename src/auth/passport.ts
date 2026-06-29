import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users, profiles } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Check if Google OAuth is configured
const isGoogleConfigured = (): boolean => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
};

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

// Google Strategy - Only register if configured
if (isGoogleConfigured()) {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
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
              // Update googleId if not set
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
                role: "user",
                isActive: true,
              }).returning();
              
              if (!newUser) {
                return done(new Error("Failed to create user"), undefined);
              }

              // Create profile
              const displayName = profile.displayName || email.split('@')[0];
              await db.insert(profiles).values({
                userId: newUser.id,
                displayName,
                username: email.split('@')[0],
                avatar: profile.photos?.[0]?.value || null,
              });
              
              return done(null, newUser);
            }
          } catch (err) {
            return done(err, undefined);
          }
        }
      )
    );
    console.log('✅ Google OAuth configured successfully');
  } catch (error) {
    console.warn('⚠️ Failed to configure Google OAuth:', error);
  }
} else {
  console.warn('⚠️ Google OAuth not configured - set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
  console.warn('   Email/password login will still work.');
}

export default passport;
