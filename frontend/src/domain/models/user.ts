import type { UserRole } from "@/domain/constants/roles";

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}
