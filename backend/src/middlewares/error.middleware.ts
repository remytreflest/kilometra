import { Request, Response, NextFunction } from 'express';
import { formatError } from '../utils/response';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json(formatError(message, err?.code));
}
