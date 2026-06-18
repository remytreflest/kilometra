import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { formatError } from '../utils/response';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(
        formatError(
          result.error.issues.map((e) => e.message).join(', '),
          'VALIDATION_ERROR'
        )
      );
    }
    req.body = result.data;
    next();
  };
}
