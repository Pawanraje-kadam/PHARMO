import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('💥 [SYSTEM CRASH HOOK]:', err.stack || err.message || err);
  
  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: err.message || 'Fatal background operation loop trace failure.'
  });
};