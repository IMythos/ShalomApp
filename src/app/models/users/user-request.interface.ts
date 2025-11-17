import { UserRole } from "../roles/user-role";

export interface UserRequest {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  dni: string;
  address: string;
  phone: string;
  position: string;
  hireDate: string;
}
