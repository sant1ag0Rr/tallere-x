import { LoginDto, RegisterDto } from '../dtos/AuthDtos';
import { AppError } from '../errors/AppError';
import { JwtService } from '../services/JwtService';
import { PasswordHasher } from '../services/PasswordHasher';
import { AuthResult, AuthUser } from '../../domain/models/Auth';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthUseCases {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async register(data: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(data.password);
    const user = await this.authRepository.create({
      email: data.email,
      passwordHash,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? null,
      avatarUrl: data.avatarUrl ?? null
    });

    return this.createAuthResult(user);
  }

  async login(data: LoginDto): Promise<AuthResult> {
    const authUser = await this.authRepository.findByEmail(data.email);
    if (!authUser || !authUser.passwordHash) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!authUser.user.isActive) {
      throw new AppError(403, 'User account is inactive');
    }

    const isValidPassword = await this.passwordHasher.compare(data.password, authUser.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid email or password');
    }

    return this.createAuthResult(authUser.user);
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'Authenticated user was not found');
    }
    return user;
  }

  private createAuthResult(user: AuthUser): AuthResult {
    return {
      user,
      token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role
      }),
      expiresIn: this.jwtService.getTokenExpiresIn()
    };
  }
}
