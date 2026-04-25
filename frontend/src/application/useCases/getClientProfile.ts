import { userRepository } from '@/infrastructure/repositories/user-repository-impl';
import type { User } from '@/domain/models';

export const getClientProfileUseCase = async (clientId: string): Promise<User | undefined> => {
  return await userRepository.getUserById(clientId);
};
