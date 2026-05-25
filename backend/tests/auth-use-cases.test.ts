import { beforeEach, describe, expect, it } from '@jest/globals';
import { AuthUseCases } from '../src/application/useCases/AuthUseCases';
import { JwtService } from '../src/application/services/JwtService';
import { PasswordHasher } from '../src/application/services/PasswordHasher';
import { AuthUserWithPassword, CreateAuthUserData, IAuthRepository } from '../src/domain/repositories/IAuthRepository';
import { AuthUser } from '../src/domain/models/Auth';

class MemoryAuthRepository implements IAuthRepository {
  private users: AuthUserWithPassword[] = [];

  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return this.users.find((item) => item.user.email === email) ?? null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    return this.users.find((item) => item.user.id === id)?.user ?? null;
  }

  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const user: AuthUser = {
      id: crypto.randomUUID(),
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push({ user, passwordHash: data.passwordHash });
    return user;
  }
}

describe('AuthUseCases', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-more-than-32-characters';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  it('registers a user with hashed password and returns a JWT', async () => {
    const repository = new MemoryAuthRepository();
    const useCases = new AuthUseCases(repository, new PasswordHasher(), new JwtService());

    const result = await useCases.register({
      email: 'client@test.com',
      password: 'Password123!',
      role: 'client',
      firstName: 'Test',
      lastName: 'Client',
      phone: null,
      avatarUrl: null
    });

    const stored = await repository.findByEmail('client@test.com');
    expect(result.token).toBeTruthy();
    expect(stored?.passwordHash).toBeTruthy();
    expect(stored?.passwordHash).not.toBe('Password123!');
  });

  it('logs in with valid credentials', async () => {
    const repository = new MemoryAuthRepository();
    const useCases = new AuthUseCases(repository, new PasswordHasher(), new JwtService());

    await useCases.register({
      email: 'admin@test.com',
      password: 'Password123!',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: null,
      avatarUrl: null
    });

    const result = await useCases.login({ email: 'admin@test.com', password: 'Password123!' });
    expect(result.user.role).toBe('admin');
    expect(result.token.length).toBeGreaterThan(40);
  });

  it('rejects invalid credentials', async () => {
    const useCases = new AuthUseCases(new MemoryAuthRepository(), new PasswordHasher(), new JwtService());
    await expect(useCases.login({ email: 'missing@test.com', password: 'Password123!' })).rejects.toThrow(
      'Invalid email or password'
    );
  });
});
