export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'ADMIN' | 'EMPLOYEE';
  dni?: string;
  phone?: string;
  address?: string;
}
