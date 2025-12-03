import { UserRole } from "../roles/user-role";

export interface UserResponseData {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  role: UserRole;
  dni: string;
  address: string;
  phone: string;
  position: string;
  hireDate: string;
}
