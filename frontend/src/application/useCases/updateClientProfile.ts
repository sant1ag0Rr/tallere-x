import type { Client, User } from "@/domain/models";
import { userRepository } from "@/infrastructure/repositories/user-repository-impl";

export const updateClientProfileUseCase = async (data: Partial<Client>): Promise<Client> => {
  // Assuming the client ID is available or passed in data
  // In a real app, this might come from auth context or the data object
  const id = data.id || "client-1"; // Fallback if no ID is provided

  // Transform Client data to User payload expected by backend if necessary
  const payload: Partial<User> = {
    email: data.email || "",
    profile: {
      firstName: data.name?.split(' ')[0] || "",
      lastName: data.name?.split(' ').slice(1).join(' ') || "",
      phone: data.phone || ""
    }
  };

  const updatedUser = await userRepository.updateUser(id, payload);
  return updatedUser as unknown as Client;
};
