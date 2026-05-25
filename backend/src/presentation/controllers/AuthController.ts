import { Response } from 'express';
import { parseLoginDto, parseRegisterDto } from '../../application/dtos/AuthDtos';
import { AuthUseCases } from '../../application/useCases/AuthUseCases';
import { PrismaAuthRepository } from '../../infrastructure/repositories/PrismaAuthRepository';
import { JwtService } from '../../application/services/JwtService';
import { PasswordHasher } from '../../application/services/PasswordHasher';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AuthController {
  private readonly useCases: AuthUseCases;

  constructor() {
    this.useCases = new AuthUseCases(
      new PrismaAuthRepository(),
      new PasswordHasher(),
      new JwtService()
    );
  }

  register = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.useCases.register(parseRegisterDto(req.body));
    res.status(201).json(result);
  };

  login = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this.useCases.login(parseLoginDto(req.body));
    res.status(200).json(result);
  };

  me = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await this.useCases.getMe(userId);
    res.status(200).json({ user });
  };
}
