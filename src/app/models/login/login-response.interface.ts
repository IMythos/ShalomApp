import { UserRole } from "../roles/user-role";

export interface LoginResponse {
  token: string;
  role: UserRole;
}
