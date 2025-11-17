import { UserRole } from "../roles/user-role";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  dni: string;
  address: string;
  phone: string;
  position: string;
  hireDate: string;
}
