import express from 'express';
import * as path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import applicationRoutes from './routes/applications';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS - allow frontend
  app.use(
    cors({
      origin: process.env.DEV_UI_URL || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Static assets
  app.use(express.static(path.join(__dirname, 'assets')));

  // Health check
  app.get('/api', (req, res) => {
    const time = new Date().toLocaleTimeString();
    res.send({ message: `The Api is running fine response sent at ${time}` });
  });

  // ========================================
  // ROUTES
  // ========================================
  app.use('/api/auth', authRoutes);
  app.use('/api/oauth', oauthRoutes);
  app.use('/api/applications', applicationRoutes);

  // OIDC discovery endpoints
  app.use('/.well-known', oauthRoutes);

  // Serve frontend in production
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  );

  return app;
};