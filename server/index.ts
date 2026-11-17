import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './config';
import { initDatabase } from './db/database';
import { authMiddleware } from './middleware/auth';
import { authRouter } from './routes/auth';
import { helpersRouter } from './routes/helpers';
import { bookingsRouter } from './routes/bookings';
import { adminRouter } from './routes/admin';

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin during development / tunnels while maintaining credentials
    callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach user authentication session if token present
app.use(authMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FixNear Backend API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/helpers', helpersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// Serve built frontend assets from dist directory
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for frontend client routing (non-API GET/HEAD requests)
  app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
async function start() {
  const dbStatus = await initDatabase();

  app.listen(CONFIG.PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`FixNear Full-Stack Backend API running on port ${CONFIG.PORT}`);
    console.log(`Database Status: ${dbStatus.message}`);
    console.log(`API Health: http://localhost:${CONFIG.PORT}/api/health`);
    console.log(`====================================================`);
  });
}

start().catch(err => {
  console.error('Fatal Server Initialization Error:', err);
  process.exit(1);
});
