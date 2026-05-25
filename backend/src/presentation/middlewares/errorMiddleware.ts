import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { AppError } from '../../application/errors/AppError';

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    details: []
  });
};

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
    return;
  }

  if (error instanceof jwt.TokenExpiredError) {
    res.status(401).json({ success: false, message: 'Token expired', details: [] });
    return;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    res.status(403).json({ success: false, message: 'Invalid token', details: [] });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'A record with this unique value already exists',
        details: [error.meta ?? {}]
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found', details: [] });
      return;
    }

    if (error.code === 'P2021' || error.code === 'EACCES') {
      res.status(503).json({
        success: false,
        message: 'Database schema or permissions are not ready',
        details: [{ code: error.code, meta: error.meta }]
      });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error', details: [] });
};
