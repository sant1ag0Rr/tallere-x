import { Response } from 'express';
import { UserUseCases } from '../../application/useCases/UserUseCases';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserFilters } from '../../application/dtos/CommonDtos';

export class UserController {
  private useCases: UserUseCases;

  constructor() {
    const userRepository = new PrismaUserRepository();
    this.useCases = new UserUseCases(userRepository);
  }

  getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    const users = await this.useCases.getUsersPaginated(req.query as unknown as UserFilters);
    res.status(200).json({ success: true, ...users });
  };

  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.useCases.getUserById(String(req.params.id));
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'Not found', details: [] });
    }
  };

  createUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.useCases.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  };

  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.useCases.updateUser(String(req.params.id), toSnakeCaseObject(req.body) as Partial<never>);
    res.status(200).json({ success: true, data: user });
  };

  deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    await this.useCases.deleteUser(String(req.params.id));
    res.status(204).send();
  };
}
