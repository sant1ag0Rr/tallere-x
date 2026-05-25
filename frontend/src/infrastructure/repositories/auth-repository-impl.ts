import {
  AuthResponse,
  LoginCredentials,
  MeResponse,
  RegisterCredentials,
  mapApiAuthUserToUser
} from "@/domain/models/auth";
import type { User } from "@/domain/models";
import { httpClient } from "@/infrastructure/http/httpClient";

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string; expiresIn: string }> {
    const response = await httpClient.post<AuthResponse>("/auth/login", credentials);
    return {
      user: mapApiAuthUserToUser(response.user),
      token: response.token,
      expiresIn: response.expiresIn
    };
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string; expiresIn: string }> {
    const response = await httpClient.post<AuthResponse>("/auth/register", credentials);
    return {
      user: mapApiAuthUserToUser(response.user),
      token: response.token,
      expiresIn: response.expiresIn
    };
  },

  async me(): Promise<User> {
    const response = await httpClient.get<MeResponse>("/auth/me");
    return mapApiAuthUserToUser(response.user);
  }
};
