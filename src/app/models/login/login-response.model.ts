import { UserRole } from "../roles/user-role";

export interface LoginResponseData {
  id: string;
  email: string
  displayName: string;
  token: string;
  role: UserRole;
}
