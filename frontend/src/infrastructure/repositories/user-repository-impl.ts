import type { User } from "@/domain/models";
import { httpClient } from "../http/httpClient";

export const userRepository = {
  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await httpClient.get<User>(`/users/${id}`);
    } catch (e) {
      return undefined;
    }
  },

  async getUsersByRole(role: "admin" | "mechanic" | "client" | "seller"): Promise<User[]> {
    try {
      // Assuming endpoint is filtered by role, or fetch all and filter
      const users = await httpClient.get<User[]>('/users');
      return users.filter(user => user.role === role);
    } catch (e) {
      return [];
    }
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, data);
  }
};
