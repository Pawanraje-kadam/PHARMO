import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[ERROR]:', isDev ? err.stack || err.message || err : err.message || 'Internal error');

  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: isDev ? err.message : 'An unexpected error occurred.'
  });
};