import { Request, Response } from 'express';
import { UserUseCases } from '../../application/useCases/UserUseCases';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { toSnakeCaseObject } from '../utils/caseTransform';

export class UserController {
  private useCases: UserUseCases;

  constructor() {
    const userRepository = new PrismaUserRepository();
    this.useCases = new UserUseCases(userRepository);
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.useCases.getUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.useCases.getUserById(req.params.id as string);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.useCases.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.useCases.updateUser(req.params.id as string, toSnakeCaseObject(req.body) as any);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteUser(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
