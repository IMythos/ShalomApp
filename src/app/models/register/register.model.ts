export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  dni?: string;
  address?: string;
  phone?: string;
  role: UserVerificationRequirement;
}
