import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Response } from 'express';
import { JwtService } from '../src/application/services/JwtService';
import { authMiddleware, AuthRequest, requireRole, requireSelfOrRole } from '../src/presentation/middlewares/authMiddleware';

const createResponse = () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return response as unknown as Response;
};

describe('authMiddleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-more-than-32-characters';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  it('attaches verified JWT payload', () => {
    const token = new JwtService().sign({ sub: 'user-1', email: 'user@test.com', role: 'admin' });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = createResponse();
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user?.email).toBe('user@test.com');
    expect(next).toHaveBeenCalled();
  });

  it('rejects missing token', () => {
    const req = { headers: {} } as AuthRequest;
    const res = createResponse();
    const next: NextFunction = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('enforces roles and ownership', () => {
    const roleReq = { user: { sub: 'user-1', email: 'user@test.com', role: 'client' } } as AuthRequest;
    const roleRes = createResponse();
    const roleNext: NextFunction = jest.fn();

    requireRole(['admin'])(roleReq, roleRes, roleNext);
    expect(roleRes.status).toHaveBeenCalledWith(403);

    const selfReq = {
      user: { sub: 'user-1', email: 'user@test.com', role: 'client' },
      params: { id: 'user-1' }
    } as unknown as AuthRequest;
    const selfRes = createResponse();
    const selfNext: NextFunction = jest.fn();

    requireSelfOrRole(['admin'])(selfReq, selfRes, selfNext);
    expect(selfNext).toHaveBeenCalled();
  });
});
