import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

const readDemoUser = (req: AuthRequest): any | null => {
  const rawUser = req.headers['x-tallerx-user'];
  const headerValue = Array.isArray(rawUser) ? rawUser[0] : rawUser;

  if (!headerValue || process.env.NODE_ENV === 'production') {
    return null;
  }

  try {
    return JSON.parse(headerValue);
  } catch {
    return null;
  }
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const demoUser = readDemoUser(req);
  if (demoUser) {
    req.user = demoUser;
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in the environment variables');
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    return;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};
