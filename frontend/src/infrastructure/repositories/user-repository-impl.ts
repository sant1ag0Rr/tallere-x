import type { User } from "@/domain/models";
import { delay } from "@/infrastructure/utils/delay";

const NOW = new Date();

const MOCK_USERS: User[] = [
  {
    id: "cli-100",
    email: "cliente1@ejemplo.com",
    role: "client",
    isActive: true,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: NOW.toISOString(),
    profile: {
      firstName: "Juan",
      lastName: "Perez",
      phone: "+57 300 123 4567"
    }
  },
  {
    id: "cli-200",
    email: "cliente2@ejemplo.com",
    role: "client",
    isActive: true,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: NOW.toISOString(),
    profile: {
      firstName: "Maria",
      lastName: "Gomez",
      phone: "+57 310 987 6543"
    }
  },
  {
    id: "mec-100",
    email: "mecanico@taller.com",
    role: "mechanic",
    isActive: true,
    createdAt: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    updatedAt: NOW.toISOString(),
    profile: {
      firstName: "Carlos",
      lastName: "Mecanico",
      phone: "+57 320 555 5555"
    }
  }
];

export const userRepository = {
  async getUserById(id: string): Promise<User | undefined> {
    await delay(500);
    return MOCK_USERS.find(user => user.id === id);
  },

  async getUsersByRole(role: "admin" | "mechanic" | "client" | "seller"): Promise<User[]> {
    await delay(500);
    return MOCK_USERS.filter(user => user.role === role);
  }
};
