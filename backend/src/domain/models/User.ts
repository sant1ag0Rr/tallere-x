export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
