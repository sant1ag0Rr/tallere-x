import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../application/services/JwtService';
import { AppError } from '../../application/errors/AppError';
import { JwtUserPayload, UserRole } from '../../domain/models/Auth';

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

const jwtService = new JwtService();

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwtService.verify(token);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(403).json({ error: 'Invalid token' });
    return;
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};

export const requireSelfOrRole = (roles: UserRole[], paramName = 'id') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const requestedUserId = req.params[paramName];
    const isSelf = Boolean(req.user?.sub && requestedUserId && req.user.sub === requestedUserId);
    const hasRole = Boolean(req.user?.role && roles.includes(req.user.role));

    if (!isSelf && !hasRole) {
      res.status(403).json({ error: 'Forbidden: You can only access your own resource' });
      return;
    }

    next();
  };
};
