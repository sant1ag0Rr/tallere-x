import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

type RequestKey = 'body' | 'params' | 'query';

const validate = (key: RequestKey, schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[key]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }

    Object.defineProperty(req, key, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true
    });

    next();
  };
};

export const validateBody = (schema: ZodType) => validate('body', schema);
export const validateParams = (schema: ZodType) => validate('params', schema);
export const validateQuery = (schema: ZodType) => validate('query', schema);
