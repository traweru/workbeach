export interface Student {
  id: number;
  name: string;
  grade: number;
  attendance: number;
  assignments: number;
  rating: number;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Student;
  label: string;
  numeric: boolean;
}
export interface AuthProvider {
  id: string;
  name: string;
}

export interface AuthResponse {
  type: 'CredentialsSignin' | 'Success';
  error?: string;
  success?: boolean;
}

export interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}
export interface User {
  username: string;
  roles: string;
  authenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}