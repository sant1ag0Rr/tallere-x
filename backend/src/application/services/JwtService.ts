import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { JwtUserPayload } from '../../domain/models/Auth';

export class JwtService {
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '2h';

  sign(payload: JwtUserPayload): string {
    const secret = this.getSecret();
    const options: SignOptions = { expiresIn: this.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, secret, options);
  }

  verify(token: string): JwtUserPayload {
    try {
      const decoded = jwt.verify(token, this.getSecret());

      if (!this.isJwtUserPayload(decoded)) {
        throw new AppError(403, 'Invalid token payload');
      }

      return decoded;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(401, 'Token expired');
      }

      throw new AppError(403, 'Invalid token');
    }
  }

  getTokenExpiresIn(): string {
    return this.expiresIn;
  }

  private getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, 'JWT_SECRET is not configured');
    }
    return secret;
  }

  private isJwtUserPayload(value: unknown): value is JwtUserPayload {
    return (
      Boolean(value) &&
      typeof value === 'object' &&
      typeof (value as JwtUserPayload).sub === 'string' &&
      typeof (value as JwtUserPayload).email === 'string' &&
      typeof (value as JwtUserPayload).role === 'string'
    );
  }
}
