// Modelo para la API de Laravel (Autenticación)
export interface User {
  USR_ID: number;
  USR_Name: string;
  USR_LastName: string;
  USR_Email: string;
  USR_Phone: string;
  USR_UserRole: 'admin' | 'trainer' | 'trainee';
  USR_FCM?: string;
  created_at: string;
  updated_at: string;
}

// Modelo para el CRUD del Dashboard (datos locales simulados)
export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'trainer' | 'trainee';
  isActive: boolean;
  phone?: string;
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  USR_Email: string;
  USR_Password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  filter_applied: string;
  total_users: number;
  data: User[];
}

export interface RegisterRequest {
  USR_Name: string;
  USR_LastName: string;
  USR_Email: string;
  USR_Phone: string;
  USR_Password: string;
  USR_UserRole: 'trainer' | 'trainee';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any;
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    trainer: number;
    trainee: number;
  };
}