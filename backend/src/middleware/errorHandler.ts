import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Never expose sensitive stack traces to users in production responses
  console.error('[API Error]:', err.message);

  res.status(500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred while processing your request.',
    timestamp: new Date().toISOString()
  });
}
