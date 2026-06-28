import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./auth/passport.js";
import authRoutes from "./routes/auth.js";
import ssoRoutes from "./routes/sso.js";
import path from "path";
const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.resolve(process.cwd(), "public");
// CORS - add your client apps
app.use(cors({
    origin: [
        "http://localhost:3001",
        "http://localhost:3002",
        "https://your-app.com",
        // Add more client app origins
    ],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
// Initialize Passport (no session middleware)
app.use(passport.initialize());
// Routes
app.use("/auth", authRoutes);
app.use("/sso", ssoRoutes);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Serve the React SPA for client-side routes like /login, /register, /dashboard.
app.get(/^(?!\/(?:auth|sso|health)(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});
// Error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});
app.listen(PORT, () => {
    console.log(`🚀 Unipass running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
