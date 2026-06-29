import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import "./auth/passport.js";
import authRoutes from "./routes/auth.js";
import ssoRoutes from "./routes/sso.js";
import profileRoutes from "./routes/profile.js";
import appRoutes from "./routes/applications.js";
import accessRoutes from "./routes/app-access.js";
import { logger, requestLogger, errorLogger } from "./utils/logger.js";

import logsRoutes from "./utils/logs.route.js";

// Add this route

dotenv.config();

// ============================================
// Fix for __dirname in ES modules
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
      user?: User;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Log Configuration Status
// ============================================
logger.info('🔄 Starting Unipass Server...');
logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
logger.info(`🗄️  Database: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);

const hasGoogleConfig = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
logger.info(`🔐 Google OAuth: ${hasGoogleConfig ? '✅ Configured' : '⚠️ Not configured (email/password only)'}`);

// ============================================
// Middleware
// ============================================

// Request logging middleware
app.use(requestLogger);
app.use("/api/logs", logsRoutes);

// CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    process.env.FRONTEND_URL || "http://localhost:3001"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// API Routes
// ============================================
logger.info('📡 Registering API routes...');

app.use("/api/auth", authRoutes);
app.use("/api/sso", ssoRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", appRoutes);
app.use("/api/app-access", accessRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    googleOAuth: hasGoogleConfig,
    logs: process.env.NODE_ENV === 'development' ? logger.getLogs(10) : undefined
  });
});

// ============================================
// Serve Static Files
// ============================================
const publicPath = path.join(__dirname, "../public");
logger.info(`📁 Serving static files from: ${publicPath}`);

if (!fs.existsSync(publicPath)) {
  logger.warn('⚠️ Public directory not found. Creating it...');
  fs.mkdirSync(publicPath, { recursive: true });
}

app.use(express.static(publicPath));

// Catch-all route - Serve React app
app.get("/*path", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    logger.warn('⚠️ index.html not found. Frontend may not be built.');
    res.status(404).send('Frontend not built. Run: cd ../frontend && npm run build');
  }
});

// ============================================
// Error Handler
// ============================================
app.use(errorLogger);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  logger.info(`🚀 Unipass running on port ${PORT}`);
  logger.info(`📍 http://localhost:${PORT}`);
  logger.info(`📝 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`📂 Logs directory: ${path.join(__dirname, '../logs')}`);
});
