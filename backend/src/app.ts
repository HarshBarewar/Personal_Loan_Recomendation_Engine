import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
  }));
  app.use(express.json());

  // Health check endpoints
  const healthHandler = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      system: 'Personal Loan Recommendation Engine API',
      modelType: 'Rule-Based Engine (Zero Machine Learning)',
      timestamp: new Date().toISOString()
    });
  };
  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // API router
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
