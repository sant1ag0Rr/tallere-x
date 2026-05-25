import { NextFunction, Request, Response } from 'express';

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, sanitizeValue(item)])
    );
  }

  return value;
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.body = sanitizeValue(req.body);
  Object.defineProperty(req, 'query', {
    value: sanitizeValue(req.query) as Request['query'],
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
};
